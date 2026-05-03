import { NextResponse } from "next/server";
import { patientService } from "@/services/patientService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const patient = await patientService.registerPatient(body);
    return NextResponse.json(patient);
  } catch (error: any) {
    console.error("❌ PATIENT REGISTRATION FAILED:", error);
    return NextResponse.json({ 
      error: "Failed to register patient", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const patients = await patientService.getAllPatients();
    console.log("📦 API - Patients fetched:", Array.isArray(patients) ? patients.length : typeof patients);
    return NextResponse.json(patients);
  } catch (error: any) {
    console.error("❌ PATIENTS FETCH FAILED:", error);
    return NextResponse.json({ 
      error: "Failed to fetch patients", 
      details: error.message 
    }, { status: 500 });
  }
}
