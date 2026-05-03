import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, diagnosis, medicines, testsRecommended } = body;

    // 1. Save prescription to database
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: "cm0y1m2p30000abcde", // In real app, get from session
        diagnosis,
        medicines, // This is Json
        testsRecommended
      },
      include: {
        patient: true,
        doctor: {
            include: {
                user: true
            }
        }
      }
    });

    // 2. If tests are recommended, create pending lab reports
    if (testsRecommended) {
      const tests = testsRecommended.split(",").map((t: string) => t.trim());
      await Promise.all(
        tests.map((testName: string) => 
          prisma.labReport.create({
            data: {
              patientId,
              testName,
              status: "PENDING"
            }
          })
        )
      );
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Prescription Error:", error);
    return NextResponse.json({ error: "Failed to save prescription" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const prescriptions = await prisma.prescription.findMany({
        where: patientId ? { patientId } : {},
        include: {
            patient: true,
            doctor: {
                include: {
                    user: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(prescriptions);
}
