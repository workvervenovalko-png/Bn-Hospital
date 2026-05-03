import { prisma } from "@/lib/prisma";

const withRetry = async (fn: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (i === retries - 1) throw e;
      console.log(`🔄 Retrying DB operation... (${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, 1000));
    }
  }
};

export const doctorService = {
  getAllDoctors: async () => {
    return await withRetry(() => prisma.doctor.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    }));
  },
  
  addDoctor: async (data: { name: string; email: string; specialization: string }) => {
    return await withRetry(() => prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: "password123",
        role: "DOCTOR",
        doctorProfile: {
          create: {
            specialization: data.specialization,
          }
        }
      }
    }));
  },

  getConsultations: async (doctorId: string) => {
    return await withRetry(() => prisma.prescription.findMany({
      where: { doctorId },
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    }));
  }
};

export const appointmentService = {
  getAppointments: async () => {
    return await withRetry(() => prisma.appointment.findMany({
      include: { 
        patient: true,
        doctor: { include: { user: true } }
      },
      orderBy: { date: 'asc' }
    }));
  },

  bookAppointment: async (data: { patientId: string; doctorId: string; date: string; timeSlot: string; reason: string }) => {
    return await withRetry(() => prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        reason: data.reason,
        status: "PENDING"
      }
    }));
  }
};
