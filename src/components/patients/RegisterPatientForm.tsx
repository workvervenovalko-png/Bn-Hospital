"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Activity, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function RegisterPatientForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          age: parseInt(formData.get("age") as string),
          gender: formData.get("gender"),
          contact: formData.get("contact"),
          address: formData.get("address"),
          bloodGroup: formData.get("bloodGroup"),
          medicalHistory: formData.get("medicalHistory"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || "Registration failed");
      }
      
      alert("Patient registered successfully in Database!");
      router.push("/");
      router.refresh();
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-card border border-border shadow-2xl shadow-brand-primary/5"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Patient Registration</h1>
            <p className="text-sm text-muted-foreground">Enter the patient's details to generate a unique ID.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input 
                  required
                  name="contact"
                  type="tel" 
                  placeholder="+91 98765 43210"
                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <input 
                required
                name="age"
                type="number" 
                placeholder="25"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <select name="gender" className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Group (Optional)</label>
              <select name="bloodGroup" className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>

            {/* Emergency Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Type</label>
              <div className="flex gap-4">
                {["OPD", "IPD", "EMERGENCY"].map((type) => (
                  <label key={type} className="flex-1 cursor-pointer">
                    <input type="radio" name="regType" value={type} className="peer hidden" defaultChecked={type === "OPD"} />
                    <div className="py-2 text-center rounded-xl border border-border peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary transition-all text-xs font-bold uppercase tracking-wider">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <textarea 
                name="address"
                rows={3}
                placeholder="Street address, City, State..."
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-red-500 flex items-center gap-2">
              <Activity size={16} /> Symptoms / Reason for Visit
            </label>
            <textarea 
              required
              name="medicalHistory"
              rows={3}
              placeholder="Fever, cough, chest pain..."
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className={cn(
                "w-full premium-gradient text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:opacity-90 transition-all",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Register & Generate ID
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
