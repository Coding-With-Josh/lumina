import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const platform = body.platform || "unknown";

  // TODO: hook into real platform sync per user/platform
  return NextResponse.json({
    success: true,
    message: `Sync for ${platform} queued`,
  });
}
