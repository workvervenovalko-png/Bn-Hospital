import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";

export const patientService = {
  getRecentPatients: async () => {
    return await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  },

  getAllPatients: async () => {
    return await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  getPatientList: async () => {
    return await prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        patientId: true
      },
      orderBy: { name: 'asc' }
    });
  },

  registerPatient: async (data: any) => {
    try {
      // Generate a unique Patient ID
      const count = await prisma.patient.count();
      const patientId = `BN-${1000 + count + 1}`;

      return await prisma.patient.create({
        data: {
          patientId,
          name: String(data.name),
          age: Number(data.age),
          gender: data.gender,
          contact: String(data.contact),
          address: data.address ? String(data.address) : null,
          medicalHistory: data.medicalHistory ? String(data.medicalHistory) : null,
          bloodGroup: data.bloodGroup ? String(data.bloodGroup) : null,
        },
      });
    } catch (e: any) {
      console.error("Service Error:", e);
      throw e;
    }
  }
};
