"use client";

import React from "react";
import { Stethoscope, Plus, X, User, Mail, Award, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      specialization: formData.get("specialization"),
    };

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Doctor added successfully!");
        setIsModalOpen(false);
        fetchDoctors();
      } else {
        alert("Failed to add doctor");
      }
    } catch (e) {
      alert("Error adding doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Profiles</h1>
          <p className="text-muted-foreground">Manage hospital staff and doctor specializations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={doc.id} 
            className="p-6 rounded-3xl bg-card border border-border hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
              <Stethoscope size={24} />
            </div>
            <h3 className="text-lg font-bold">{doc.user?.name || doc.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{doc.specialization}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                doc.status === "Available" || !doc.status ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
              }`}>
                {doc.status || "Available"}
              </span>
              <p className="text-[10px] text-muted-foreground font-mono">{doc.user?.email}</p>
            </div>
          </motion.div>
        ))}
        {doctors.length === 0 && (
          <div className="col-span-3 p-20 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl">
            No doctors found in the hospital records.
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">New Doctor</h2>
                    <p className="text-xs text-muted-foreground">Register a new specialist to the hospital.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddDoctor} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <input 
                      name="name"
                      required
                      type="text" 
                      placeholder="Dr. John Doe"
                      className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <input 
                      name="email"
                      required
                      type="email" 
                      placeholder="john.doe@hospital.com"
                      className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialization</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <input 
                      name="specialization"
                      required
                      type="text" 
                      placeholder="Cardiology, Orthopedics, etc."
                      className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full premium-gradient text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:opacity-90 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      Register Doctor
                    </>
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
