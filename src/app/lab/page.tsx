"use client";

import React from "react";
import { FlaskConical, Plus, Search, FileText, CheckCircle2, Clock, Upload, X, Save, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LabPage() {
  const [reports, setReports] = React.useState<any[]>([]);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      const [reportsRes, patientsRes] = await Promise.all([
        fetch("/api/lab"),
        fetch("/api/patients")
      ]);
      const reportsData = await reportsRes.json();
      const patientsData = await patientsRes.json();
      
      if (Array.isArray(reportsData)) setReports(reportsData);
      if (Array.isArray(patientsData)) setPatients(patientsData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleRequestTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = { patientId: formData.get("patientId"), testName: formData.get("testName"), status: "PENDING" };
    try {
      const res = await fetch("/api/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) { setIsModalOpen(false); fetchData(); }
    } catch (e) { alert("Error requesting test"); } finally { setLoading(false); }
  };

  const handleCompleteTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      results: formData.get("results"),
      fileName: (formData.get("file") as File)?.name || "uploaded_report.pdf",
      status: "COMPLETED"
    };

    try {
      const res = await fetch(`/api/lab/${selectedReport.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert("Lab Report Saved Successfully!");
        setIsUploadModalOpen(false);
        fetchData();
      }
    } catch (e) { alert("Error completing test"); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab & Diagnostics</h1>
          <p className="text-muted-foreground">Manage test requests and upload patient reports.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Request New Test
        </button>
      </div>

      <div className="grid gap-4">
        {reports.length > 0 ? (
          reports.map((report, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={report.id}
              className="p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FlaskConical size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{report.testName}</h3>
                  <p className="text-sm text-muted-foreground">Patient: {report.patient?.name} ({report.patient?.patientId})</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    report.status === "PENDING" ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {report.status === "PENDING" ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                    {report.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-2">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                
                {report.status === "PENDING" ? (
                  <button 
                    onClick={() => { setSelectedReport(report); setIsUploadModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Upload size={16} /> Upload Results
                  </button>
                ) : (
                  <button 
                    onClick={() => { setSelectedReport(report); setIsViewModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                  >
                    <Eye size={16} /> View Report
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center">
            <FlaskConical className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold">No lab reports found.</h3>
          </div>
        )}
      </div>

      {/* Request Modal (Simplified for brevity) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-card border border-border p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Request Diagnostic Test</h2>
              <form onSubmit={handleRequestTest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Patient</label>
                  <select name="patientId" required className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option value="">Choose Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Type</label>
                  <select name="testName" required className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                    <option value="Lipid Profile">Lipid Profile</option>
                    <option value="Chest X-Ray">Chest X-Ray</option>
                    <option value="MRI Scan - Brain">MRI Scan - Brain</option>
                  </select>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
                  {loading ? "Requesting..." : "Generate Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal (Previous logic) */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUploadModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-card border border-border p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-bold mb-2">Upload Test Results</h2>
              <p className="text-sm text-muted-foreground mb-6">For: {selectedReport?.testName}</p>
              <form onSubmit={handleCompleteTest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Observations</label>
                  <textarea name="results" required rows={3} className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload File</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center relative">
                    <Upload className="text-muted-foreground" size={24} />
                    <input name="file" type="file" className="absolute inset-0 opacity-0" />
                    <p className="text-xs text-muted-foreground">Click to select file</p>
                  </div>
                </div>
                <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold">
                  {loading ? "Saving..." : "Complete & Save Report"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Report Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="p-8 bg-emerald-500/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Diagnostic Report</h2>
                    <p className="text-xs text-muted-foreground">Detailed findings for {selectedReport?.testName}</p>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8 p-6 rounded-2xl bg-muted/30">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Patient Name</p>
                    <p className="font-bold">{selectedReport?.patient?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Report ID</p>
                    <p className="font-mono text-sm">{selectedReport?.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Test Date</p>
                    <p className="font-medium text-sm">{new Date(selectedReport?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Status</p>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Final Report</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Observations & Findings</p>
                  <div className="p-6 rounded-2xl border border-border bg-background min-h-[120px] text-sm leading-relaxed italic">
                    "{selectedReport?.results}"
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm font-bold">{selectedReport?.reportUrl}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Digital Copy Attached</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:opacity-90 transition-opacity">
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
