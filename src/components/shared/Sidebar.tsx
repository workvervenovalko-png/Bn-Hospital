"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  Bed, 
  FlaskConical, 
  Pill, 
  Receipt, 
  ClipboardList,
  ShieldCheck,
  LogOut,
  BarChart3,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Doctors", href: "/doctors", icon: UserRound },
  { name: "Beds/Wards", href: "/beds", icon: Bed },
  { name: "Pharmacy", href: "/pharmacy", icon: Pill },
  { name: "Lab Tests", href: "/lab", icon: FlaskConical },
  { name: "Workforce", href: "/staff", icon: Briefcase },
  { name: "Billing", href: "/billing", icon: Receipt },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Approvals", href: "/admin/approvals", icon: ShieldCheck, adminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 glass-card h-screen sticky top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-2 px-2 py-6 mb-4">
        <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center">
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          BN <span className="text-green-500">Hospital</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto remove-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                  : "text-sidebar-fg hover:bg-dark-400 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-green-500" : "group-hover:text-green-500"
              )} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#24AE7C]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sidebar-fg hover:bg-red-500/10 hover:text-red-500 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <a 
            href="https://vervenovatech.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-sidebar-fg/60 hover:text-green-500 transition-colors inline-block tracking-wider"
          >
            Powered by <br />
            <strong className="text-sidebar-fg font-bold">Verve Nova Technologies</strong>
          </a>
        </div>
      </div>
    </aside>
  )
}
