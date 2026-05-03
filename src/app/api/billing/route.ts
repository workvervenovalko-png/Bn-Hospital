import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
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

    const count = await prisma.invoice.count();
    const invoiceId = `BN-INV-${1000 + count + 1}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceId,
        patientId: patient.id,
        amount: Number(body.amount),
        items: body.items || {},
        status: "UNPAID"
      },
      include: { patient: true }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
