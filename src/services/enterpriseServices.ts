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

export const labService = {
  getAllReports: async () => {
    return await withRetry(() => prisma.labReport.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    }));
  }
};

export const pharmacyService = {
  getInventory: async () => {
    return await withRetry(() => prisma.medicine.findMany({
      orderBy: { name: 'asc' }
    }));
  },
  addMedicine: async (data: { name: string; category: string; price: number; stock: number }) => {
    return await withRetry(() => prisma.medicine.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
      }
    }));
  }
};

export const billingService = {
  getInvoices: async () => {
    return await withRetry(() => prisma.invoice.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    }));
  }
};
