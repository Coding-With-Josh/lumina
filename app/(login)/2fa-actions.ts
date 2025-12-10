"use server";

import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { comparePasswords } from "@/lib/auth/session";

type TwoFactorSetup = {
  secret: string;
  qrCode: string;
  backupCodes: string[];
};

export async function generateTwoFactorSecret(): Promise<TwoFactorSetup> {
  const user = await getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Lumina Clippers (${user.email})`,
    issuer: "Lumina Clippers",
  });

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

const enableTwoFactorSchema = z.object({
  secret: z.string(),
  code: z.string().length(6),
  backupCodes: z.array(z.string()),
});

export async function enableTwoFactor(
  data: z.infer<typeof enableTwoFactorSchema>
): Promise<{ success?: boolean; error?: string; backupCodes?: string[] }> {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify the code
  const verified = speakeasy.totp.verify({
    secret: data.secret,
    encoding: "base32",
    token: data.code,
    window: 2, // Allow 2 time windows before/after for clock skew
  });

  if (!verified) {
    return { error: "Invalid verification code. Please try again." };
  }

  // Save secret and enable 2FA
  await db
    .update(users)
    .set({
      twoFactorEnabled: true,
      twoFactorSecret: data.secret,
      twoFactorBackupCodes: data.backupCodes,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return {
    success: true,
    backupCodes: data.backupCodes,
  };
}

const disableTwoFactorSchema = z.object({
  password: z.string().min(8),
});

export async function disableTwoFactor(
  data: z.infer<typeof disableTwoFactorSchema>
): Promise<{ success?: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  if (!user.passwordHash) {
    return { error: "Password not set" };
  }

  // Verify password
  const isPasswordValid = await comparePasswords(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return { error: "Incorrect password" };
  }

  // Disable 2FA and clear secrets
  await db
    .update(users)
    .set({
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true };
}

export async function verifyTwoFactorCode(
  code: string
): Promise<{ valid: boolean }> {
  const user = await getUser();
  if (!user || !user.twoFactorSecret) {
    return { valid: false };
  }

  // Try TOTP verification
  const totpValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 2,
  });

  if (totpValid) {
    return { valid: true };
  }

  // Try backup code
  const backupCodes = user.twoFactorBackupCodes as string[] | null;
  if (backupCodes && backupCodes.includes(code)) {
    // Remove used backup code
    const remainingCodes = backupCodes.filter((c) => c !== code);
    await db
      .update(users)
      .set({
        twoFactorBackupCodes: remainingCodes,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { valid: true };
  }

  return { valid: false };
}
