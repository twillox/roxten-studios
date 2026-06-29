import React, { useState, useEffect } from "react";
import { commissionService } from "../../lib/firebase-services";
import { Commission } from "../../lib/mock-api/models";
import { useAuth } from "../../hooks/useAuth";
import { DollarSign, ArrowUpRight, Download, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Commissions() {
  const { user, loading: authLoading } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      commissionService.getCommissions(user.id).then(cs => {
        setCommissions(cs);
        setDataLoading(false);
      });
    }
  }, [user, authLoading]);

  if (authLoading || dataLoading) return <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>;

  const pendingAmount = commissions.filter(c => c.status === "Pending").reduce((s, c) => s + c.amount, 0);
  const approvedAmount = commissions.filter(c => c.status === "Approved").reduce((s, c) => s + c.amount, 0);
  const paidAmount = commissions.filter(c => c.status === "Paid").reduce((s, c) => s + c.amount, 0);
  const totalAmount = pendingAmount + approvedAmount + paidAmount;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Commissions</h1>
          <p className="text-white/50 mt-2">Track your earnings and commission history.</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Lifetime Earnings", amount: totalAmount, color: "text-white" },
          { label: "Pending (Est.)", amount: pendingAmount, color: "text-orange-400" },
          { label: "Available to Payout", amount: approvedAmount, color: "text-[#00ffcc]" },
          { label: "Already Paid", amount: paidAmount, color: "text-blue-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-40"
          >
            <p className="text-sm text-white/50 uppercase tracking-widest font-bold">{stat.label}</p>
            <p className={`text-4xl font-black font-mono ${stat.color}`}>${stat.amount.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-white/50" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Commission History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Referral ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">No commissions yet.</td>
                </tr>
              ) : (
                commissions.map((comm) => (
                  <tr key={comm.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-white/50">{comm.id}</td>
                    <td className="p-4 font-mono text-sm">{comm.referralId}</td>
                    <td className="p-4 font-mono text-sm text-[#00ffcc] font-bold">
                      +${comm.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        comm.status === "Approved" ? "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/20" :
                        comm.status === "Paid" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
                        "text-orange-400 bg-orange-400/10 border-orange-400/20"
                      }`}>
                        {comm.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
