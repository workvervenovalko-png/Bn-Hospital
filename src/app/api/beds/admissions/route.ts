import { NextResponse } from "next/server";
import { bedService } from "@/services/bedService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await bedService.admitPatient(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bedId = searchParams.get("bedId");
    if (!bedId) return NextResponse.json({ error: "Bed ID required" }, { status: 400 });
    
    const data = await bedService.dischargePatient(bedId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
