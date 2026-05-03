import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🛠️ Starting Manual DB Sync via API...");

    // 1. Add isApproved to User if not exists
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN DEFAULT false`);
      console.log("✅ Added isApproved to User");
    } catch (e) { console.log("⚠️ isApproved might already exist"); }

    // 2. Create Staff table
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Staff" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "designation" TEXT NOT NULL,
          "department" TEXT,
          "contact" TEXT NOT NULL,
          "salary" DOUBLE PRECISION,
          "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
        )
      `);
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Staff_userId_key" ON "Staff"("userId")`);
      console.log("✅ Created Staff table");
    } catch (e) { console.log("❌ Staff table error:", e); }

    // 3. Create Medicine table (if missing)
    try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Medicine" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "stock" INTEGER NOT NULL,
            "price" DOUBLE PRECISION NOT NULL,
            "expiryDate" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
          )
        `);
        console.log("✅ Created Medicine table");
    } catch (e) { console.log("❌ Medicine table error:", e); }

    // 4. Create Invoice table
    try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Invoice" (
            "id" TEXT NOT NULL,
            "invoiceId" TEXT NOT NULL,
            "patientId" TEXT NOT NULL,
            "amount" DOUBLE PRECISION NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'UNPAID',
            "items" JSONB NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
          )
        `);
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_invoiceId_key" ON "Invoice"("invoiceId")`);
        console.log("✅ Created Invoice table");
    } catch (e) { console.log("❌ Invoice table error:", e); }

    return NextResponse.json({ message: "Manual sync executed. Check server logs." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
