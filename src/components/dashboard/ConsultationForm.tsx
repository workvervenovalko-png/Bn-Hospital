"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Pill, 
  FlaskConical, 
  Save, 
  Plus, 
  Trash2,
  Stethoscope,
  Clock,
  User,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { generatePrescriptionPDF } from "@/lib/pdf-generator";

interface MedicineEntry {
  name: string;
  dosage: string;
  duration: string;
}

export function ConsultationForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [patient, setPatient] = React.useState<any>(null);
  const [medicines, setMedicines] = React.useState<MedicineEntry[]>([{ name: "", dosage: "", duration: "" }]);
  const [diagnosis, setDiagnosis] = React.useState("");
  const [tests, setTests] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.patientId === patientId || p.id === patientId);
        setPatient(found);
      });
  }, [patientId]);

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const removeMedicine = (index: number) => setMedicines(medicines.filter((_, i) => i !== index));
  
  const updateMedicine = (index: number, field: keyof MedicineEntry, value: string) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          diagnosis,
          medicines,
          testsRecommended: tests
        })
      });

      if (res.ok) {
        const savedData = await res.json();
        // Generate PDF
        generatePrescriptionPDF(savedData);
        router.push("/");
      } else {
        alert("Failed to save prescription");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving consultation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-sidebar-fg hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Exit Consultation
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-green-500" /> Patient Details
            </h2>
            {patient ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] text-sidebar-fg uppercase font-black tracking-widest">Name</span>
                  <span className="text-sm font-bold text-white">{patient.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] text-sidebar-fg uppercase font-black tracking-widest">ID</span>
                  <span className="text-sm font-bold text-green-500">{patient.patientId}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] text-sidebar-fg uppercase font-black tracking-widest">Age/Gender</span>
                  <span className="text-sm font-bold text-white">{patient.age} / {patient.gender}</span>
                </div>
                <div className="mt-8 p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-3">Chief Complaint</p>
                  <p className="text-sm text-sidebar-fg italic leading-relaxed">"{patient.medicalHistory || "No symptoms recorded."}"</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-sidebar-fg py-10 text-center animate-pulse">Synchronizing records...</div>
            )}
          </div>
        </div>

        {/* Main Consultation Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Diagnosis Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Stethoscope className="text-green-500" /> Diagnosis & Findings
              </h2>
              <div className="space-y-4">
                <textarea 
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                  placeholder="Enter clinical observations and professional diagnosis..."
                  className="w-full bg-dark-500/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-sidebar-fg/30"
                />
              </div>
            </motion.div>

            {/* Medicines Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Pill className="text-emerald-500" /> Clinical Prescription
                </h2>
                <button 
                  type="button"
                  onClick={addMedicine}
                  className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                {medicines.map((med, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-in fade-in slide-in-from-right-4 duration-300 relative group">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Medicine Name</label>
                      <input 
                        value={med.name}
                        onChange={(e) => updateMedicine(index, "name", e.target.value)}
                        placeholder="e.g. Paracetamol"
                        className="w-full bg-dark-500/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Dosage Schedule</label>
                      <input 
                        value={med.dosage}
                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                        placeholder="1-0-1 (After Food)"
                        className="w-full bg-dark-500/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      />
                    </div>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-sidebar-fg tracking-widest ml-1">Duration</label>
                        <input 
                          value={med.duration}
                          onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                          placeholder="5 Days"
                          className="w-full bg-dark-500/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        />
                      </div>
                      {medicines.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="p-3 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all mb-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lab Recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FlaskConical className="text-purple-500" /> Laboratory Orders
              </h2>
              <input 
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                placeholder="Comma separated: CBC, Widal, Chest X-Ray..."
                className="w-full bg-dark-500/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-sidebar-fg/30"
              />
              <p className="text-[10px] text-sidebar-fg mt-3 italic opacity-50 px-2">Note: Recommended tests will automatically create pending requests in the Lab module.</p>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                disabled={loading}
                type="submit"
                className="flex-1 green-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-green-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FileText size={20} />
                    Finalize & Generate Official Prescription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

