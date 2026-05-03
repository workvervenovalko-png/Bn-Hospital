import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, approve } = await req.json();

    if (approve) {
      await prisma.user.update({
        where: { id: userId },
        // @ts-ignore - Field added in recent schema update
        data: { isApproved: true }
      });
      return NextResponse.json({ message: "User approved successfully" });
    } else {
      // Logic for rejection (e.g., delete user or mark as rejected)
      await prisma.user.delete({
        where: { id: userId }
      });
      return NextResponse.json({ message: "User rejected and removed" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { 
        // @ts-ignore - Field added in recent schema update
        isApproved: false,
        role: { in: ["DOCTOR", "STAFF"] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    return NextResponse.json(pendingUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pending approvals" }, { status: 500 });
  }
}
