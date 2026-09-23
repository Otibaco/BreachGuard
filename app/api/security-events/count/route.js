import { NextResponse } from "next/server";
import { getSecurityEventCountSince } from "@/controllers/securityEventController";

export async function GET() {
  try {
    const count = await getSecurityEventCountSince(24);
    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json({ success: true, count: 0 });
  }
}
