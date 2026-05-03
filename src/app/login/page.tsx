"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // User's strict requirement: Single account
    if (email === "puneetkushwaha88@gmail.com" && password === "123123") {
      // Set a cookie for simulation (In real app, use JWT)
      document.cookie = "isLoggedIn=true; path=/";
      router.push("/");
    } else {
      setError("Invalid credentials. Access denied.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl premium-gradient flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">BN Hospital</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to access the portal</p>
        </div>

        <div className="p-8 rounded-[32px] bg-card/40 border border-border/50 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-xs font-bold text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full premium-gradient text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Hospital Administrative Access Only
        </p>
      </motion.div>
    </div>
  );
}
