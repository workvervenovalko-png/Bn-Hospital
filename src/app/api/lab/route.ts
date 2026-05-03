import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.labReport.findMany({
      include: {
        patient: {
          select: { name: true, patientId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lab reports" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real app, we search by patientId string to get the DB ID
    const patient = await prisma.patient.findFirst({
      where: { 
        OR: [
          { patientId: body.patientId },
          { name: { contains: body.patientId, mode: 'insensitive' } }
        ]
      }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const report = await prisma.labReport.create({
      data: {
        patientId: patient.id,
        testName: body.testName,
        status: "PENDING"
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to create test request" }, { status: 500 });
  }
}
