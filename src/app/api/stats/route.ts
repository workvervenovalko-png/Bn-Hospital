import { NextResponse } from "next/server";
import { dashboardService } from "@/services/dashboardService";

export async function GET() {
  try {
    const stats = await dashboardService.getStats();
    const analytics = await dashboardService.getAnalytics();
    return NextResponse.json({ ...stats, analytics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
