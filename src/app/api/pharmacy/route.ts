import { NextResponse } from "next/server";
import { pharmacyService } from "@/services/enterpriseServices";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await pharmacyService.getInventory();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await pharmacyService.addMedicine(body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add medicine" }, { status: 500 });
  }
}
