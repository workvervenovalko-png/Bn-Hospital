"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Briefcase, 
  IndianRupee, 
  X, 
  Save, 
  ShieldCheck, 
  Trash2,
  MoreVertical,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StaffManagement() {
  const [staff, setStaff] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchStaff = async () => {
    const res = await fetch("/api/staff");
    const data = await res.json();
    if (Array.isArray(data)) setStaff(data);
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      designation: formData.get("designation"),
      contact: formData.get("contact"),
      salary: formData.get("salary"),
    };

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchStaff();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Hospital <span className="text-blue-500">Personnel</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Workforce administration and role management.</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-sidebar-fg" size={20} />
            <input 
              type="text" 
              placeholder="Search employee directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-500/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-2xl blue-gradient text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
          >
            <Plus size={20} />
            Onboard Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((member, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={member.id}
              className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:bg-white/[0.03] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
              
              <div className="flex items-start justify-between mb-8 relative">
                <div className="w-16 h-16 rounded-2xl blue-gradient flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {member.user.name[0]}
                </div>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                     Active
                   </span>
                   <button className="text-sidebar-fg hover:text-white transition-colors">
                      <MoreVertical size={20} />
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{member.user.name}</h3>
                  <p className="text-blue-500 text-sm font-bold flex items-center gap-2 mt-1">
                    <Briefcase size={14} /> {member.designation}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sidebar-fg">
                    <Mail size={14} className="text-blue-400" />
                    <span className="text-xs truncate">{member.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sidebar-fg">
                    <Phone size={14} className="text-blue-400" />
                    <span className="text-xs">{member.contact}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sidebar-fg">
                    <IndianRupee size={14} className="text-blue-400" />
                    <span className="text-xs font-mono font-bold text-white">₹{member.salary?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                 <p className="text-[10px] text-sidebar-fg uppercase font-black tracking-widest opacity-50">
                   Joined {new Date(member.joiningDate).toLocaleDateString()}
                 </p>
                 <Activity size={14} className="text-green-500 opacity-20" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredStaff.length === 0 && (
        <div className="p-32 text-center flex flex-col items-center gap-6 opacity-30">
          <Users size={64} className="text-sidebar-fg" />
          <p className="text-lg font-medium italic">No personnel records found in the current cluster.</p>
        </div>
      )}

      {/* Onboarding Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-[2.5rem] p-10 max-w-xl w-full border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Staff Onboarding</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-sidebar-fg hover:text-white transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Personal Identifier</label>
                  <input name="name" required placeholder="Full Name" className="w-full bg-dark-500/50 p-4 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Enterprise Email</label>
                    <input name="email" type="email" required placeholder="name@bnhospital.com" className="w-full bg-dark-500/50 p-4 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Contact Telemetry</label>
                    <input name="contact" required placeholder="+91 00000 00000" className="w-full bg-dark-500/50 p-4 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Designation</label>
                    <input name="designation" required placeholder="Nurse, Admin, etc." className="w-full bg-dark-500/50 p-4 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Gross Salary (₹)</label>
                    <input name="salary" type="number" required placeholder="50000" className="w-full bg-dark-500/50 p-4 rounded-2xl border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full blue-gradient text-white p-5 rounded-2xl font-bold shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><ShieldCheck size={20} /> Authorize & Onboard Personnel</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
