import { prisma } from "@/lib/prisma";

export const dashboardService = {
  getStats: async () => {
    const [patientCount, doctorCount, testCount, medicineCount] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.labReport.count({ where: { status: "PENDING" } }),
      prisma.medicine.count(),
    ]);

    // Calculate total revenue from PAID invoices
    const invoices = await prisma.invoice.findMany({
      where: { status: "PAID" },
      select: { amount: true }
    });
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);

    return {
      patientCount,
      doctorCount,
      pendingTests: testCount,
      totalRevenue: totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      medicineCount
    };
  },

  getAnalytics: async () => {
    // Get last 7 days admission counts
    const analytics = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.admission.count({
        where: { admissionDate: { gte: start, lte: end } }
      });

      analytics.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }
    return analytics;
  }
};
