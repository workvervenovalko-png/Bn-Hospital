import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [patients, invoices, inventory, staff] = await Promise.all([
      prisma.patient.findMany({ 
        select: { patientId: true, name: true, age: true, gender: true, contact: true, createdAt: true },
        take: 100 // Limit for performance
      }),
      prisma.invoice.findMany({ 
        include: { patient: { select: { name: true } } },
        take: 100
      }),
      prisma.medicine.findMany({ take: 100 }),
      prisma.staff.findMany({ 
        include: { user: { select: { name: true, email: true } } },
        take: 100
      })
    ]);

    return NextResponse.json({
      patients: patients || [],
      invoices: (invoices || []).map(i => ({ 
        id: i.invoiceId, 
        patient: i.patient?.name || "Unknown", 
        amount: i.amount, 
        status: i.status, 
        date: i.createdAt 
      })),
      inventory: inventory || [],
      staff: (staff || []).map(s => ({ 
        name: s.user?.name || "Unknown", 
        role: s.designation, 
        salary: s.salary, 
        joined: s.joiningDate 
      }))
    });
  } catch (error: any) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate reports" }, { status: 500 });
  }
}
