import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { results, status } = body;

    const report = await prisma.labReport.update({
      where: { id },
      data: {
        results,
        status: status || "COMPLETED",
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lab report" }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      await prisma.labReport.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete lab report" }, { status: 500 });
    }
  }
