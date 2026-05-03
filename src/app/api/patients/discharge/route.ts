import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";

export async function POST(req: Request) {
  try {
    const { admissionId, summary } = await req.json();

    // Fetch admission first to get the date
    const admission = await prisma.admission.findUnique({
      where: { id: admissionId },
      include: {
        bed: true,
        patient: true
      }
    });

    if (!admission) return NextResponse.json({ error: "Admission not found" }, { status: 404 });

    // Fetch prescriptions since admission
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: admission.patientId,
        createdAt: { gte: admission.admissionDate }
      }
    });

    // 1. Calculate Room Charges
    const days = Math.max(1, differenceInDays(new Date(), admission.admissionDate));
    // @ts-ignore - Field added in recent schema update
    const roomCharges = days * (admission.bed.pricePerDay || 1000);

    // 2. Calculate Medicine Charges
    let medicineCharges = 0;
    prescriptions.forEach((p: any) => {
      if (Array.isArray(p.medicines)) {
        p.medicines.forEach((m: any) => {
          medicineCharges += (m.price || 100) * (m.quantity || 1);
        });
      }
    });

    // 3. Doctor Consultation Fee
    const doctorFee = 500; // Fixed or could be fetched from Doctor model

    const totalBill = roomCharges + medicineCharges + doctorFee;

    // Transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceId: `INV-${Date.now().toString().slice(-6)}`,
          patientId: admission.patientId,
          amount: totalBill,
          items: {
            room: roomCharges,
            medicine: medicineCharges,
            doctor: doctorFee,
            days: days
          }
        }
      });

      // Create Discharge Record
      // @ts-ignore - Model added in recent schema update
      const discharge = await (tx as any).discharge.create({
        data: {
          admissionId: admission.id,
          patientId: admission.patientId,
          totalBill: totalBill,
          invoiceId: invoice.id,
          summary: summary
        }
      });

      // Update Admission Status
      await tx.admission.update({
        where: { id: admission.id },
        // @ts-ignore - Field added in recent schema update
        data: { status: "DISCHARGED" }
      });

      // Release Bed
      await tx.bed.update({
        where: { id: admission.bedId },
        data: { status: "AVAILABLE" }
      });

      return { discharge, invoice };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Discharge Error:", error);
    return NextResponse.json({ error: "Discharge process failed" }, { status: 500 });
  }
}
