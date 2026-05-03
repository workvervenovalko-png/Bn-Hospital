"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Clock, 
  ArrowUpRight,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Plus,
  ArrowDownRight,
  Stethoscope
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";

export default function DashboardPage() {
  const [recentPatients, setRecentPatients] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, statRes, docRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/stats"),
          fetch("/api/doctors")
        ]);
        
        const patData = await patRes.json();
        const statData = await statRes.json();
        const docData = await docRes.json();

        if (Array.isArray(patData)) setRecentPatients(patData.slice(0, 5));
        setStats(statData);
        if (Array.isArray(docData)) setDoctors(docData.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Clinical <span className="text-green-500">Intelligence</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Real-time enterprise metrics and patient flow telemetry.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link 
            href="/patients/register"
            className="px-8 py-4 rounded-2xl green-gradient text-white font-bold flex items-center gap-2 shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all"
          >
            <UserPlus size={20} />
            Admission Portal
          </Link>
          <button className="p-4 rounded-2xl glass border border-white/10 hover:bg-white/5 text-white transition-all">
            <Plus />
          </button>
        </motion.div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Admissions" 
          value={stats?.patientCount || "0"} 
          icon={Users} 
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
          description="Active registrations this cycle"
        />
        <StatCard 
          label="Enterprise Revenue" 
          value={stats?.totalRevenue || "₹0"} 
          icon={TrendingUp} 
          color="green"
          trend={{ value: 8.2, isPositive: true }}
          description="Gross clinical settlement"
        />
        <StatCard 
          label="Verified Doctors" 
          value={stats?.doctorCount || "0"} 
          icon={Stethoscope} 
          color="yellow"
          trend={{ value: 2, isPositive: true }}
          description="Board-certified staff active"
        />
        <StatCard 
          label="Lab Throughput" 
          value={stats?.pendingTests || "0"} 
          icon={Activity} 
          color="red"
          trend={{ value: 4.1, isPositive: false }}
          description="Awaiting clinical review"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full -z-10" />
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Patient Flow Analytics</h2>
              <p className="text-sm text-sidebar-fg mt-1 italic opacity-60">Admission volume trends over last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
               <TrendingUp size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">+14.2%</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.analytics || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24AE7C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#24AE7C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ABB8C4', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ABB8C4', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131619', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FFF'
                  }}
                  itemStyle={{ color: '#24AE7C' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#24AE7C" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Intake List */}
        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Intake</h2>
            <Link href="/patients" className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 hover:underline">Full Registry</Link>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentPatients.length > 0 ? recentPatients.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl green-gradient flex items-center justify-center font-bold text-[10px] text-white shadow-lg">
                  {patient.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{patient.name}</p>
                  <p className="text-[10px] text-sidebar-fg uppercase tracking-widest">{patient.patientId}</p>
                </div>
                <ArrowUpRight className="text-sidebar-fg group-hover:text-white transition-colors w-4 h-4 opacity-40 group-hover:opacity-100" />
              </motion.div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4 border-2 border-dashed border-white/10 rounded-3xl p-10 text-center">
                <Clock className="w-12 h-12" />
                <p className="text-xs italic">No clinical intake detected in recent cycle.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
             <div className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                <AlertTriangle size={18} />
                <p className="text-[10px] font-bold leading-tight">Critical stock alerts active for 2 items in ICU ward.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}




