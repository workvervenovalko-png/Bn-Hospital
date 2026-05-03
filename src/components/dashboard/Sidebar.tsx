"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Bot,
  Users, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Bed, 
  CreditCard, 
  LogOut,
  Settings,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Stethoscope, label: "Doctors", href: "/doctors" },
  { icon: FlaskConical, label: "Lab Tests", href: "/lab" },
  { icon: Pill, label: "Pharmacy", href: "/pharmacy" },
  { icon: Users, label: "Workforce", href: "/staff" },
  { icon: Bed, label: "IPD/Beds", href: "/beds" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={cn(
      "h-screen bg-sidebar-bg text-sidebar-fg transition-all duration-300 relative",
      isOpen ? "w-64" : "w-20"
    )}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-10 bg-brand-primary p-1 rounded-full text-white hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shrink-0">
          <Stethoscope size={20} className="text-white" />
        </div>
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl tracking-tight"
          >
            BN Hospital
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-6 w-full px-3 space-y-2">
        <Link 
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
        >
          <Settings size={20} className="text-slate-400" />
          {isOpen && <span>Settings</span>}
        </Link>
        <button 
          onClick={() => {
            document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all"
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>

        {isOpen && (
          <div className="pt-4 mt-4 border-t border-white/5 text-center">
            <a 
              href="https://vervenovatech.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-brand-primary transition-colors inline-block tracking-wider"
            >
              Powered by <br />
              <strong className="text-slate-400 font-bold">Verve Nova Technologies</strong>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
