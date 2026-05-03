import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: body.status,
      },
      include: { patient: true }
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}
