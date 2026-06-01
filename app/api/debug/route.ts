import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlStart: process.env.DATABASE_URL?.substring(0, 25) ?? "NOT SET",
    nodeEnv: process.env.NODE_ENV,
  });
}
