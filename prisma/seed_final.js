const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Database...");
  
  // Create Doctors
  await prisma.user.create({
    data: {
      name: "Dr. Aditya Sharma",
      email: "aditya@bnhospital.com",
      password: "password123",
      role: "DOCTOR",
      doctorProfile: { create: { specialization: "Cardiologist" } }
    }
  });

  await prisma.user.create({
    data: {
      name: "Dr. Sneha Verma",
      email: "sneha@bnhospital.com",
      password: "password123",
      role: "DOCTOR",
      doctorProfile: { create: { specialization: "Pediatrician" } }
    }
  });

  // Create Medicines
  await prisma.medicine.createMany({
    data: [
      { name: "Paracetamol 500mg", category: "Analgesic", stock: 150, price: 15, expiryDate: new Date('2027-12-01') },
      { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 15, price: 45, expiryDate: new Date('2026-06-01') },
    ],
  });

  console.log("✅ Seed Complete!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
