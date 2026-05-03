"use client";

import React from "react";
import { Users, Search, UserPlus } from "lucide-react";
import Link from "next/link";

export default function PatientsPage() {
  const [patients, setPatients] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/patients")
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.details || "Failed to fetch");
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setPatients(data);
        else console.error("Patients fetch error - not an array:", data);
      })
      .catch(err => console.error("Patients fetch error:", err.message));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Directory</h1>
          <p className="text-muted-foreground">Manage and view all registered patients.</p>
        </div>
        <Link 
          href="/patients/register"
          className="px-4 py-2 rounded-xl bg-brand-primary text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <UserPlus size={18} /> Register New
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.patientId}</td>
                  <td className="px-6 py-4 text-sm">{p.age} / {p.gender}</td>
                  <td className="px-6 py-4 text-sm">{p.contact}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground italic truncate max-w-xs">{p.medicalHistory}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">No patients found in the database.</div>
          )}
        </div>
      </div>
    </div>
  );
}
