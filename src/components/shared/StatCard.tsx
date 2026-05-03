import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "green" | "blue" | "red" | "yellow"
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  description, 
  trend,
  color = "green" 
}: StatCardProps) {
  const colorMap = {
    green: "from-green-500/20 to-green-500/5 text-green-500 border-green-500/20",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20",
    red: "from-red-500/20 to-red-500/5 text-red-500 border-red-500/20",
    yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-500 border-yellow-500/20",
  }

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-30",
        color === "green" && "bg-green-500",
        color === "blue" && "bg-blue-500",
        color === "red" && "bg-red-500",
        color === "yellow" && "bg-yellow-500",
      )} />

      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center border",
          colorMap[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sidebar-fg text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        {description && (
          <p className="text-sidebar-fg/60 text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}
