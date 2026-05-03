"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Upload, CheckCircle, Clock, FileText, Search, User, X, Save, Trash2, Activity, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function LabManagement() {
  const [reports, setReports] = React.useState<any[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchReports = async () => {
    const res = await fetch("/api/lab");
    const data = await res.json();
    if (Array.isArray(data)) setReports(data);
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedReport) return;
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const results = formData.get("results");

    try {
      const res = await fetch(`/api/lab/${selectedReport.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results, status: "COMPLETED" })
      });

      if (res.ok) {
        setSelectedReport(null);
        fetchReports();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Diagnostics <span className="text-purple-500">& Labs</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Electronic test monitoring and clinical data reporting.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-sidebar-fg" size={20} />
          <input 
            type="text" 
            placeholder="Search diagnostic records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-500/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-sidebar-fg/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Requests", value: reports.filter(r => r.status === "PENDING").length, icon: Activity, color: "text-purple-500" },
          { label: "Finalized Reports", value: reports.filter(r => r.status === "COMPLETED").length, icon: CheckCircle, color: "text-green-500" },
          { label: "Diagnostic Load", value: "Optimal", icon: Microscope, color: "text-blue-500" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sidebar-fg">{stat.label}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-bold text-white">Clinical Order Stream</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-fg border-b border-white/5">
                <th className="px-10 py-6">Diagnostic Procedure</th>
                <th className="px-10 py-6">Patient Record</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReports.map((report, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={report.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                        <FlaskConical size={18} />
                      </div>
                      <span className="font-bold text-white text-sm tracking-tight">{report.testName}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <User size={14} className="text-sidebar-fg" />
                       <span className="text-sm font-medium text-white">{report.patient?.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-sidebar-fg font-mono">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      report.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {report.status === "PENDING" ? (
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="px-4 py-2 rounded-xl bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                      >
                        Upload Results
                      </button>
                    ) : (
                      <button className="p-3 rounded-xl glass border border-white/5 text-sidebar-fg hover:text-white transition-all">
                        <FileText size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredReports.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center gap-6 opacity-30">
              <FlaskConical size={64} className="text-sidebar-fg" />
              <p className="text-lg font-medium italic">No clinical order matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Upload Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="glass-card rounded-[2.5rem] p-10 max-w-xl w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Diagnostic Reporting</h2>
              <button onClick={() => setSelectedReport(null)} className="text-sidebar-fg hover:text-white"><X /></button>
            </div>
            <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
               <p className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest mb-1">Patient</p>
               <p className="text-lg font-bold text-white mb-4">{selectedReport.patient?.name}</p>
               <p className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest mb-1">Test Ordered</p>
               <p className="text-lg font-bold text-purple-500">{selectedReport.testName}</p>
            </div>
            <form onSubmit={handleUpdateReport} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Clinical Findings / Observations</label>
                  <textarea 
                    name="results" 
                    required 
                    rows={6}
                    placeholder="Enter detailed laboratory results..."
                    className="w-full bg-dark-500/50 p-6 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
               </div>
               <button 
                type="submit" 
                disabled={loading}
                className="w-full purple-gradient text-white p-5 rounded-2xl font-bold shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3"
               >
                 {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> Finalize Diagnostic Report</>}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

