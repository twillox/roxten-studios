import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { referralService, commissionService, activityService } from "../../lib/firebase-services";
import { Referral, Commission, ActivityLog } from "../../lib/mock-api/models";
import { useAuth } from "../../hooks/useAuth";
import { Users, CheckCircle, Clock, IndianRupee, ArrowUpRight } from "lucide-react";

export default function ReferralDashboardHome() {
  const { user, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [refs, comms, acts] = await Promise.all([
          referralService.getReferrals(user.id, user.referralCode),
          commissionService.getCommissions(user.id),
          activityService.getLogs(user.id)
        ]);
        
        setReferrals(refs);
        setCommissions(comms);
        setLogs(acts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || dataLoading || !user) {
    return <div className="animate-pulse flex flex-col gap-8">
      <div className="h-10 w-1/3 bg-white/5 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
    </div>;
  }

  const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0) + 
    referrals.filter(r => r.status === "Paid" && r.commissionEarned).reduce((sum, r) => sum + (r.commissionEarned || 0), 0);
  const approvedReferrals = referrals.filter(r => r.status === "Won" || r.status === "Paid").length;
  const pendingReferrals = referrals.filter(r => !["Won", "Paid", "Lost"].includes(r.status)).length;

  const stats = [
    { label: "Total Referrals", value: referrals.length, icon: <Users className="text-[#00ffcc]" />, prefix: "" },
    { label: "Approved Projects", value: approvedReferrals, icon: <CheckCircle className="text-blue-400" />, prefix: "" },
    { label: "Pending Referrals", value: pendingReferrals, icon: <Clock className="text-orange-400" />, prefix: "" },
    { label: "Total Earnings", value: totalEarnings.toLocaleString(), icon: <IndianRupee className="text-green-400" />, prefix: "₹" }
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Overview</h1>
          <p className="text-white/50 mt-2">Welcome back, {user.name.split(" ")[0]}. Here's what's happening today.</p>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl font-black mb-1">{stat.prefix}{stat.value}</p>
              <p className="text-sm text-white/50 uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
            
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-32 h-32" })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">Recent Activity</h2>
            <a href="/dashboard/referral/list" className="text-[#00ffcc] text-sm hover:underline">View All</a>
          </div>
          <div className="space-y-6">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_10px_#00ffcc]" />
                <div>
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-white/50">{log.details}</p>
                  <p className="text-xs text-white/30 mt-1">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-white/40">No recent activity.</p>}
          </div>
        </div>

        {/* QUICK ACTIONS & LINK */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#00ffcc]/20 to-transparent border border-[#00ffcc]/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Your Referral Link</h2>
            <div className="p-3 bg-black/60 rounded-xl font-mono text-sm border border-white/10 truncate mb-4 select-all">
              https://roxtenstudios.in/ref/{user.referralCode}
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(`https://roxtenstudios.in/ref/${user.referralCode}`)}
              className="w-full py-3 bg-[#00ffcc] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors"
            >
              Copy Link
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Top Performers</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">1</div>
                  <span className="text-sm font-medium">Sarah M.</span>
                </div>
                <span className="text-[#00ffcc] font-mono text-xs">₹12k</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">2</div>
                  <span className="text-sm font-medium">David O.</span>
                </div>
                <span className="text-[#00ffcc] font-mono text-xs">₹8.5k</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">3</div>
                  <span className="text-sm font-medium">You</span>
                </div>
                <span className="text-[#00ffcc] font-mono text-xs">₹{(totalEarnings/1000).toFixed(1)}k</span>
              </div>
            </div>
            <button className="mt-6 w-full py-2 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              View Leaderboard <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
