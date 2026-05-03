"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, AlertCircle, Plus, Search, ShoppingCart, Package, X, Save, Tag, IndianRupee, Activity, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function PharmacyManagement() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/pharmacy");
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
    };

    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Pharmacy <span className="text-blue-500">Operations</span>
          </h1>
          <p className="text-sidebar-fg mt-2 text-lg">Inventory tracking, pharmaceutical stock & dispensing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 rounded-2xl blue-gradient text-white font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Inventory", value: inventory.length, icon: Package, color: "text-blue-500" },
          { label: "Critical Stock", value: inventory.filter(i => i.stock < 10 && i.stock > 0).length, icon: Activity, color: "text-orange-500" },
          { label: "Depleted Stock", value: inventory.filter(i => i.stock === 0).length, icon: ShieldAlert, color: "text-red-500" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:opacity-20 ${stat.color.replace('text', 'bg')}`} />
            <div className="flex items-center justify-between mb-4 relative">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sidebar-fg">{stat.label}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-white">Central Inventory</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-sidebar-fg" size={20} />
            <input 
              type="text" 
              placeholder="Search medicine database..."
              className="w-full bg-dark-500/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-sidebar-fg/40"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-fg border-b border-white/5">
                <th className="px-10 py-6">Pharmaceutical Item</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6 text-center">Unit Stock</th>
                <th className="px-10 py-6">Unit Price</th>
                <th className="px-10 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Pill size={18} />
                      </div>
                      <span className="font-bold text-white text-sm tracking-tight">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-medium text-sidebar-fg bg-dark-500/50 px-3 py-1 rounded-lg border border-white/5">{item.category}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-sm font-black text-white font-mono">{item.stock}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-bold text-blue-400">₹{item.price}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={async () => {
                          await fetch(`/api/pharmacy/${item.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ stock: 50 }) // Default restock of 50
                          });
                          fetchInventory();
                        }}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        title="Restock +50 Units"
                       >
                         <Plus size={16} />
                       </button>
                       <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        item.stock > 10 ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                        item.stock > 0 ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                       )}>
                        {item.stock > 10 ? "Optimal" : item.stock > 0 ? "Low" : "Depleted"}
                       </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {inventory.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center gap-6 opacity-30">
              <Package size={64} className="text-sidebar-fg" />
              <p className="text-lg font-medium italic">The central inventory is currently empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-200/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="glass-card rounded-[2.5rem] p-10 max-w-lg w-full border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">Register Pharmaceutical Item</h2>
            <form onSubmit={handleAddMedicine} className="space-y-6">
               <input name="name" required placeholder="Medicine Name" className="w-full bg-dark-500/50 p-5 rounded-2xl border border-white/10 text-white outline-none" />
               <div className="grid grid-cols-2 gap-4">
                  <input name="category" required placeholder="Category" className="w-full bg-dark-500/50 p-5 rounded-2xl border border-white/10 text-white outline-none" />
                  <input name="stock" type="number" required placeholder="Initial Stock" className="w-full bg-dark-500/50 p-5 rounded-2xl border border-white/10 text-white outline-none" />
               </div>
               <input name="price" type="number" step="0.01" required placeholder="Unit Price (₹)" className="w-full bg-dark-500/50 p-5 rounded-2xl border border-white/10 text-white outline-none" />
               <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 text-sidebar-fg font-bold">Cancel</button>
                  <button type="submit" className="flex-1 blue-gradient text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20">Add Item</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

