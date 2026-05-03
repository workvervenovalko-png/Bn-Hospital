import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        user: {
          select: { name: true, email: true, isApproved: true }
        }
      },
      orderBy: { joiningDate: 'desc' }
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, designation, contact, salary } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // 1. Create User first
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: "hashed_password_placeholder",
        role: "STAFF",
        isApproved: true
      }
    });

    // 2. Create Staff profile
    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        designation: designation || "Staff",
        contact: contact || "N/A",
        salary: salary && !isNaN(parseFloat(salary.toString())) ? parseFloat(salary.toString()) : 0,
      }
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error("Staff Creation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create staff" }, { status: 500 });
  }
}
