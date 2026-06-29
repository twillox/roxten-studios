import React, { useState, useEffect } from "react";
import { referralService } from "../../lib/firebase-services";
import { Referral } from "../../lib/mock-api/models";
import { useAuth } from "../../hooks/useAuth";
import { Search, Filter, Plus, ChevronDown, Download } from "lucide-react";

export default function MyReferrals() {
  const { user, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && user) {
      referralService.getReferrals(user.id, user.referralCode).then(refs => {
        setReferrals(refs);
        setDataLoading(false);
      }).catch(err => {
        console.error("Failed to load referrals:", err);
        setDataLoading(false);
      });
    }
  }, [user, authLoading]);

  const filteredReferrals = referrals.filter(r => {
    const compName = r.company || r.businessName || "";
    const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          compName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "Contacted": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Proposal Sent": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "Negotiation": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Won": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Paid": return "text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/20";
      case "Lost": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-white/60 bg-white/5 border-white/10";
    }
  };

  if (authLoading || dataLoading) return <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Referrals</h1>
          <p className="text-white/50 mt-2">Track the status of all your submitted leads.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-6 py-3 bg-[#00ffcc] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Referral
          </button>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* FILTERS */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full md:w-48 appearance-none bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Paid">Paid</option>
                <option value="Lost">Lost</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
            <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Client</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Project Type</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Value</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">No referrals found matching your criteria.</td>
                </tr>
              ) : (
                filteredReferrals.map((ref, i) => (
                  <tr key={ref.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold">{ref.clientName}</p>
                      <p className="text-xs text-white/50">{ref.company || ref.businessName || "No Company"}</p>
                    </td>
                    <td className="p-4 text-sm text-white/80">{ref.projectType}</td>
                    <td className="p-4 font-mono text-sm">
                      {ref.projectValue ? `$${ref.projectValue.toLocaleString()}` : <span className="text-white/30">TBD</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(ref.status)}`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {new Date(ref.createdAt).toLocaleDateString()}
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
