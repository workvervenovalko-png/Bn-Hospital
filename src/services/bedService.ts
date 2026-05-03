import { prisma } from "@/lib/prisma";

export const bedService = {
  getWardStats: async () => {
    // Optimized grouping using database aggregation
    const stats = await prisma.bed.groupBy({
      by: ['ward', 'status'],
      _count: {
        _all: true
      }
    });

    const wardGroups = stats.reduce((acc: any, curr: any) => {
      if (!acc[curr.ward]) {
        acc[curr.ward] = { name: curr.ward, total: 0, occupied: 0 };
      }
      acc[curr.ward].total += curr._count._all;
      if (curr.status === "OCCUPIED") {
        acc[curr.ward].occupied += curr._count._all;
      }
      return acc;
    }, {});

    return Object.values(wardGroups);
  },

  getAllBeds: async () => {
    // Fetch with selective includes to reduce payload size
    return await prisma.bed.findMany({
      include: {
        admission: {
          where: { status: "ADMITTED" }, // Only active admissions
          select: {
            id: true,
            patient: {
              select: {
                id: true,
                name: true,
                patientId: true
              }
            }
          }
        }
      },
      orderBy: { bedNumber: 'asc' }
    });
  },

  addBed: async (data: { bedNumber: string; ward: string }) => {
    return await prisma.bed.create({
      data: {
        bedNumber: data.bedNumber,
        ward: data.ward,
        status: "AVAILABLE"
      }
    });
  },

  deleteBed: async (id: string) => {
    return await prisma.bed.delete({
      where: { id }
    });
  },

  admitPatient: async (data: { patientId: string; bedId: string }) => {
    return await prisma.$transaction([
      prisma.admission.create({
        data: {
          patientId: data.patientId,
          bedId: data.bedId,
        }
      }),
      prisma.bed.update({
        where: { id: data.bedId },
        data: { status: "OCCUPIED" }
      })
    ]);
  },

  dischargePatient: async (bedId: string) => {
    // Find the active admission
    const admission = await prisma.admission.findFirst({
      where: { bedId, status: "ADMITTED" }
    });

    if (!admission) throw new Error("No active admission found for this bed");

    return await prisma.$transaction([
      prisma.admission.update({
        where: { id: admission.id },
        data: { status: "DISCHARGED" }
      }),
      prisma.bed.update({
        where: { id: bedId },
        data: { status: "AVAILABLE" }
      })
    ]);
  }
};
