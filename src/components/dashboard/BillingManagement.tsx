"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Download, Printer, CheckCircle2, History, User, IndianRupee, FileText, ArrowUpRight, Plus, X, Save, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf-generator";

export function BillingManagement() {
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [activeInvoice, setActiveInvoice] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      const [invRes, patRes] = await Promise.all([
        fetch("/api/billing"),
        fetch("/api/patients")
      ]);
      const invData = await invRes.json();
      const patData = await patRes.json();
      
      if (Array.isArray(invData)) {
        setInvoices(invData);
        if (invData.length > 0 && !activeInvoice) setActiveInvoice(invData[0]);
      }
      if (Array.isArray(patData)) setPatients(patData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsPaid = async () => {
    if (!activeInvoice) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/billing/${activeInvoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });

      if (res.ok) {
        fetchData();
        setActiveInvoice({ ...activeInvoice, status: "PAID" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === "PAID" ? inv.amount : 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Financial <span className="text-green-500">Ledger</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Real-time revenue tracking and invoice management.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 rounded-2xl green-gradient text-white font-bold flex items-center gap-2 shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} /> Generate Bill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Invoice Details */}
        <div className="lg:col-span-2">
          {activeInvoice ? (
            <motion.div 
              key={activeInvoice.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full -z-10" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-white/5">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center text-white shadow-lg">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Invoice #{activeInvoice.invoiceId}</h2>
                    <p className="text-sm text-sidebar-fg">{new Date(activeInvoice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                  activeInvoice.status === "PAID" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {activeInvoice.status}
                </div>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-dark-500/30 border border-white/5">
                    <p className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest mb-3">Billed To</p>
                    <p className="font-bold text-white text-lg">{activeInvoice.patient?.name}</p>
                    <p className="text-xs text-sidebar-fg mt-1">ID: {activeInvoice.patient?.patientId}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-dark-500/30 border border-white/5 text-right">
                    <p className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest mb-3">Enterprise Status</p>
                    <p className="font-bold text-white text-lg uppercase tracking-wider">{activeInvoice.status}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                       <ShieldCheck className="w-3 h-3 text-green-500" />
                       <span className="text-[10px] text-green-500 font-bold">Verified Transaction</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-black uppercase tracking-widest text-sidebar-fg/60 border-b border-white/5 pb-4">Itemized Breakdown</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Clinical Services & Consultation</span>
                      <span className="text-white font-bold font-mono">₹{activeInvoice.amount}</span>
                    </div>
                  </div>
                  
                  <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-white">Total Amount Due</span>
                      <p className="text-xs text-sidebar-fg">Including applicable taxes & service fees</p>
                    </div>
                    <span className="text-4xl font-black text-green-500 tracking-tighter">₹{activeInvoice.amount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-12">
                  {activeInvoice.status === "UNPAID" ? (
                    <button 
                      onClick={handleMarkAsPaid}
                      disabled={loading}
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-3xl green-gradient text-white font-bold hover:scale-[1.02] transition-all shadow-xl shadow-green-500/20"
                    >
                      {loading ? "Processing..." : <><CheckCircle2 size={24} /> Authorize Payment</>}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-3 px-8 py-5 rounded-3xl bg-green-500/10 text-green-500 font-bold border border-green-500/20">
                      <CheckCircle2 size={24} /> Payment Finalized
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => generateInvoicePDF(activeInvoice)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl glass border border-white/10 hover:bg-white/5 text-white transition-all"
                    >
                      <Printer size={20} />
                    </button>
                    <button 
                      onClick={() => generateInvoicePDF(activeInvoice)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl glass border border-white/10 hover:bg-white/5 text-white transition-all"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-20 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-6 border-dashed border-white/10">
              <CreditCard size={64} className="text-sidebar-fg/20" />
              <p className="text-sidebar-fg italic font-medium">Select an active record to view the enterprise ledger.</p>
            </div>
          )}
        </div>

        {/* Sidebar History */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <History size={20} className="text-green-500" /> Recent Invoices
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto remove-scrollbar pr-1">
              {invoices.map((inv) => (
                <motion.div 
                  key={inv.id} 
                  onClick={() => setActiveInvoice(inv)}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group",
                    activeInvoice?.id === inv.id 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-dark-500/20 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      inv.status === "PAID" ? "bg-green-500 shadow-[0_0_8px_#24AE7C]" : "bg-red-500 shadow-[0_0_8px_#F23F44]"
                    )} />
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-green-500 transition-colors">{inv.invoiceId}</p>
                      <p className="text-[10px] text-sidebar-fg font-black uppercase tracking-widest">{inv.patient?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-mono">₹{inv.amount}</p>
                    <p className="text-[10px] text-sidebar-fg">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-10 rounded-[2rem] green-gradient text-white shadow-2xl shadow-green-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-white/20 transition-all" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-2">Aggregate Revenue</h3>
            <p className="text-4xl font-black tracking-tighter">₹{totalRevenue.toLocaleString()}</p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/90">
              <Activity size={14} className="animate-pulse" /> Live Settlement Tracked
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Modal Background Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
           {/* Modal Implementation would go here - similar to the ones above */}
           <div className="glass-card p-10 rounded-[2.5rem] max-w-lg w-full text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Generate Enterprise Bill</h2>
              <p className="text-sidebar-fg mb-8">This action creates a new financial record in the ledger.</p>
              {/* Form elements would go here */}
              <button onClick={() => setIsModalOpen(false)} className="w-full py-4 green-gradient rounded-2xl text-white font-bold">Close Portal</button>
           </div>
        </div>
      )}
    </div>
  );
}

