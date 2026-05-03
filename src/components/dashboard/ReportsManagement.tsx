"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileDown, 
  Table, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileJson,
  Activity,
  ShieldCheck
} from "lucide-react";
import * as XLSX from 'xlsx';
import { cn } from "@/lib/utils";

export function ReportsManagement() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const exportToExcel = (sheetName: string, exportData: any[]) => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `BN_Hospital_${sheetName}_Report_${Date.now()}.xlsx`);
  };

  const reportCards = [
    { 
      title: "Patient Registry", 
      desc: "Full database of registered patients with contact telemetry.",
      key: "patients",
      icon: Table,
      color: "blue"
    },
    { 
      title: "Financial Ledger", 
      desc: "Comprehensive invoice history and revenue settlement data.",
      key: "invoices",
      icon: BarChart3,
      color: "green"
    },
    { 
      title: "Pharmacy Inventory", 
      desc: "Pharmaceutical stock levels and unit pricing analytics.",
      key: "inventory",
      icon: Activity,
      color: "purple"
    },
    { 
      title: "Workforce Directory", 
      desc: "Human resources and clinical staff payroll records.",
      key: "staff",
      icon: ShieldCheck,
      color: "orange"
    }
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Enterprise <span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Centralized data export and clinical intelligence reporting.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-sidebar-fg bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
           <Calendar size={14} className="text-blue-500" />
           Current Cycle: Q2 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reportCards.map((report, i) => (
          <motion.div
            key={report.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all"
          >
            <div className={cn(
              "absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full -mr-24 -mt-24 opacity-10 group-hover:opacity-20 transition-all",
              `bg-${report.color}-500`
            )} />
            
            <div className="flex items-start justify-between mb-8 relative">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl",
                report.color === "blue" ? "bg-blue-500 shadow-blue-500/20" :
                report.color === "green" ? "bg-green-500 shadow-green-500/20" :
                report.color === "purple" ? "bg-purple-500 shadow-purple-500/20" : "bg-orange-500 shadow-orange-500/20"
              )}>
                <report.icon size={24} />
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-sidebar-fg opacity-50">CSV / XLSX</span>
                 <FileSpreadsheet size={16} className="text-sidebar-fg opacity-20" />
              </div>
            </div>

            <div className="mb-10 relative">
              <h3 className="text-2xl font-bold text-white tracking-tight">{report.title}</h3>
              <p className="text-sidebar-fg mt-2 leading-relaxed text-sm">{report.desc}</p>
            </div>

            <div className="flex gap-3 relative">
              <button 
                disabled={loading || !data}
                onClick={() => exportToExcel(report.title, data[report.key])}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.05] border border-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <FileSpreadsheet size={18} className="text-green-500" />
                Excel (.xlsx)
              </button>
              <button 
                disabled={loading || !data}
                onClick={() => {
                  const csvContent = data[report.key].map((row: any) => Object.values(row).join(",")).join("\n");
                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `BN_Hospital_${report.title}.csv`;
                  a.click();
                }}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.05] border border-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <FileDown size={18} className="text-blue-500" />
                Raw Data (.csv)
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
           <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
           <p className="text-sm font-bold uppercase tracking-widest text-sidebar-fg">Synchronizing Enterprise Data...</p>
        </div>
      )}
    </div>
  );
}
