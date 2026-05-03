"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, UserCheck, UserX, Clock, Mail, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminApprovalsPage() {
  const [pendingUsers, setPendingUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/admin/approve")
      const data = await res.json()
      if (Array.isArray(data)) setPendingUsers(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPending()
  }, [])

  const handleAction = async (userId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        body: JSON.stringify({ userId, approve })
      })
      if (res.ok) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
            Staff <span className="text-blue-500">Approvals</span>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-blue-500 uppercase tracking-widest">
              Review Queue
            </div>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Verify and authorize clinical staff access to the enterprise console.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-sidebar-fg w-5 h-5" />
            <span className="text-white font-bold">Pending Requests ({pendingUsers.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-sidebar-fg uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Staff Member</th>
                <th className="px-8 py-6">Requested Role</th>
                <th className="px-8 py-6">Applied Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pendingUsers.map((user, i) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl blue-gradient flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-sidebar-fg" />
                          <p className="text-[11px] text-sidebar-fg">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-500/50 border border-white/10">
                      <Briefcase className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-sidebar-fg">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleAction(user.id, false)}
                        className="p-3 rounded-xl glass border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">Reject</span>
                      </button>
                      <button 
                        onClick={() => handleAction(user.id, true)}
                        className="p-3 rounded-xl green-gradient text-white shadow-lg shadow-green-500/20 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">Approve</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {pendingUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <ShieldCheck className="w-12 h-12 text-sidebar-fg" />
                      <p className="text-sidebar-fg italic">No pending staff approvals at this time.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
