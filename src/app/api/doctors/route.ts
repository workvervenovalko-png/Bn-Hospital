import { NextResponse } from "next/server";
import { doctorService } from "@/services/staffServices";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const doctor = await doctorService.addDoctor(body);
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to add doctor" }, { status: 500 });
  }
}

export async function GET() {
  const data = await doctorService.getAllDoctors();
  return NextResponse.json(data);
}
