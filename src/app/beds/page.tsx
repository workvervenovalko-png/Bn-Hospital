"use client";

import React from "react";
import { Bed as BedIcon, Plus, Trash2, LogIn, LogOut, ShieldCheck, Activity, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BedsPage() {
  const [wards, setWards] = React.useState<any[]>([]);
  const [beds, setBeds] = React.useState<any[]>([]);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = React.useState<string | null>(null);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = React.useState<any | null>(null);
  const [newBed, setNewBed] = React.useState({ bedNumber: "", ward: "General", pricePerDay: 1000 });
  const [selectedPatientId, setSelectedPatientId] = React.useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/beds?init=true");
      const data = await res.json();
      setWards(data.wards);
      setBeds(data.beds);
      setPatients(data.patients);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/beds", {
      method: "POST",
      body: JSON.stringify(newBed)
    });
    if (res.ok) {
      setIsAddModalOpen(false);
      setNewBed({ bedNumber: "", ward: "General", pricePerDay: 1000 });
      fetchData();
    }
  };

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/beds/admissions", {
      method: "POST",
      body: JSON.stringify({ patientId: selectedPatientId, bedId: isAdmitModalOpen })
    });
    if (res.ok) {
      setIsAdmitModalOpen(null);
      setSelectedPatientId("");
      fetchData();
    }
  };

  const handleDischarge = async (admissionId: string) => {
    const res = await fetch("/api/patients/discharge", {
      method: "POST",
      body: JSON.stringify({ admissionId, summary: "Standard Discharge" })
    });
    if (res.ok) {
      setIsDischargeModalOpen(null);
      fetchData();
    }
  };

  const bedsByWard = beds.reduce((acc: any, bed) => {
    if (!acc[bed.ward]) acc[bed.ward] = [];
    acc[bed.ward].push(bed);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Bed <span className="text-green-500">Management</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Real-time ward telemetry and medical unit allocation.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 rounded-2xl green-gradient text-white font-bold flex items-center gap-2 shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          Provision Unit
        </button>
      </div>

      {/* Ward Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {wards.map((ward) => (
          <div key={ward.name} className="glass-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{ward.name}</h3>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <BedIcon size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black text-green-500 tracking-tighter">
                  {ward.total - ward.occupied}
                </p>
                <p className="text-[10px] text-sidebar-fg font-black uppercase tracking-[0.2em] mt-1">Available</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white mb-1">{Math.round((ward.occupied / ward.total) * 100)}% Occupied</p>
                <div className="w-24 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                  <div className="h-full green-gradient" style={{ width: `${(ward.occupied / ward.total) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ward Units */}
      <div className="space-y-16">
        {Object.entries(bedsByWard).map(([wardName, wardBeds]: [string, any]) => (
          <div key={wardName} className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-green-500/60 flex items-center gap-3">
                <Activity size={14} />
                {wardName} Wing Operations
              </h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {wardBeds.map((bed: any) => {
                const isOccupied = bed.status === "OCCUPIED"
                return (
                  <motion.div 
                    key={bed.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "glass-card p-6 rounded-3xl border transition-all duration-300 group",
                      isOccupied ? "border-red-500/20" : "border-green-500/20"
                    )}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-sidebar-fg">Unit {bed.bedNumber}</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isOccupied ? "bg-red-500 shadow-[0_0_8px_#F23F44]" : "bg-green-500 shadow-[0_0_8px_#24AE7C]"
                      )} />
                    </div>

                    {isOccupied ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter mb-1">Assigned to</p>
                          <p className="font-bold text-sm text-white truncate">{bed.admission?.patient?.name || "Patient"}</p>
                        </div>
                        <button 
                          onClick={() => setIsDischargeModalOpen(bed.admission)}
                          className="w-full py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <LogOut size={14} />
                          Discharge
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter mb-1">Status</p>
                          <p className="font-bold text-[10px] text-sidebar-fg uppercase tracking-widest">Vacant</p>
                        </div>
                        <button 
                          onClick={() => setIsAdmitModalOpen(bed.id)}
                          className="w-full py-3 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <LogIn size={14} />
                          Allocate
                        </button>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Discharge/Billing Modal */}
      {isDischargeModalOpen && (
        <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="glass-card rounded-[2.5rem] p-10 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Receipt size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Authorize Discharge</h2>
                <p className="text-xs text-sidebar-fg">This will finalize automated billing.</p>
              </div>
            </div>
            
            <div className="space-y-6 bg-dark-500/30 p-6 rounded-3xl border border-white/5 mb-8">
              <div className="flex justify-between">
                <span className="text-xs text-sidebar-fg">Patient</span>
                <span className="text-xs font-bold text-white">{isDischargeModalOpen.patient?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-sidebar-fg">Admission Date</span>
                <span className="text-xs font-bold text-white">{new Date(isDischargeModalOpen.admissionDate).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm font-bold text-green-500">Auto-Calculate Fees</span>
                <ShieldCheck className="text-green-500 w-5 h-5" />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsDischargeModalOpen(null)}
                className="flex-1 p-4 rounded-2xl font-bold text-xs text-sidebar-fg hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDischarge(isDischargeModalOpen.id)}
                className="flex-1 bg-red-500 text-white p-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20"
              >
                Confirm & Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Modal (Simplified for brevity) */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="glass-card rounded-[2.5rem] p-10 max-w-md w-full border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Allocate Unit</h2>
            <form onSubmit={handleAdmit} className="space-y-6">
              <select 
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-dark-500/50 p-5 rounded-2xl border border-white/10 text-white font-bold outline-none"
              >
                <option value="">Select Patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsAdmitModalOpen(null)} className="flex-1 p-4 text-sidebar-fg">Cancel</button>
                <button type="submit" className="flex-1 green-gradient text-white p-4 rounded-2xl font-bold">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

