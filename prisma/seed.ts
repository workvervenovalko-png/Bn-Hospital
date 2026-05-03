import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");
  
  // Clear existing data safely (using try-catch for relations)
  try {
    await prisma.prescription.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.labReport.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.medicine.deleteMany({});
    console.log("Old records cleared.");
  } catch (e) {
    console.log("Cleanup skipped or failed (might be empty).");
  }

  // 1. Create Doctors (Users + Doctor Profile)
  const doctorsData = [
    { name: "Dr. Aditya Sharma", email: "aditya@bnhospital.com", specialization: "Cardiologist" },
    { name: "Dr. Sneha Verma", email: "sneha@bnhospital.com", specialization: "Pediatrician" },
    { name: "Dr. Rohan Khanna", email: "rohan@bnhospital.com", specialization: "Neurologist" },
  ];

  for (const doc of doctorsData) {
    await prisma.user.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: "password123",
        role: "DOCTOR",
        doctorProfile: {
          create: {
            specialization: doc.specialization,
          }
        }
      }
    });
  }

  // 2. Create Medicines (Inventory)
  await prisma.medicine.createMany({
    data: [
      { name: "Paracetamol 500mg", category: "Analgesic", stock: 150, price: 15, expiryDate: new Date('2027-12-01') },
      { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 15, price: 45, expiryDate: new Date('2026-06-01') },
      { name: "Cetirizine 10mg", category: "Antihistamine", stock: 85, price: 12, expiryDate: new Date('2027-01-01') },
      { name: "Pantoprazole 40mg", category: "Antacid", stock: 200, price: 8, expiryDate: new Date('2026-10-01') },
    ],
  });

  console.log("✅ Database seeded successfully with Enterprise-Grade records!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
