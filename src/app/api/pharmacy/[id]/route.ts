import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stock, price } = body;

    const medicine = await prisma.medicine.update({
      where: { id },
      data: {
        stock: stock !== undefined ? { increment: parseInt(stock.toString()) } : undefined,
        price: price !== undefined ? parseFloat(price.toString()) : undefined,
      }
    });

    return NextResponse.json(medicine);
  } catch (error: any) {
    console.error("Pharmacy Update Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update medicine" }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      await prisma.medicine.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete medicine" }, { status: 500 });
    }
  }
