import { NextResponse } from "next/server";
import { bedService } from "@/services/bedService";
import { patientService } from "@/services/patientService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  const init = searchParams.get("init");

  if (init === "true") {
    const [wards, beds, patients] = await Promise.all([
      bedService.getWardStats(),
      bedService.getAllBeds(),
      patientService.getPatientList()
    ]);
    return NextResponse.json({ wards, beds, patients });
  }

  if (all === "true") {
    const data = await bedService.getAllBeds();
    return NextResponse.json(data);
  }

  const data = await bedService.getWardStats();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await bedService.addBed(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await bedService.deleteBed(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
