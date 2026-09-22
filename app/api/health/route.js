import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/connectDB";
import { isBreachApiConfigured } from "@/services/breachApiService";

export async function GET() {
  let dbConnected = false;
  try {
    await connectToDatabase();
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  return NextResponse.json({
    success: true,
    status: "ok",
    database: dbConnected ? "connected" : "unavailable",
    breachApiConfigured: isBreachApiConfigured(),
    timestamp: new Date().toISOString(),
  });
}
