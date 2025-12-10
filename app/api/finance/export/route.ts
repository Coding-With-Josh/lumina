import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "finance";

  // Mock CSV payload; replace with real data aggregation later.
  const rows = [
    ["type", "name", "amount", "date", "status"],
    ["payout", "Dec 29 window", "7250", "2025-12-29", "pending"],
    ["payout", "Jan 12 window", "5430", "2026-01-12", "scheduled"],
    ["invoice", "INV-9821", "4200", "2025-12-01", "paid"],
    ["campaign", "Holiday UGC Push", "9400", "2025-12-08", "active"],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${scope}-export.csv`,
    },
  });
}
