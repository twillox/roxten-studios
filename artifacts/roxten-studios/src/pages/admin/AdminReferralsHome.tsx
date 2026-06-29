import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@workspace/firebase";

export default function AdminReferralsHome() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const q = query(collection(db, "referrals"));
        const snap = await getDocs(q);
        let refs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        refs.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          return dateB - dateA; // Descending
        });
        setReferrals(refs);
      } catch (err) {
        console.error("Error fetching referrals in admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight">Admin Dashboard</h1>
        <p className="text-white/50 mt-2">Manage partners, approve referrals, and process payouts.</p>
      </header>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-black/40">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">All Referrals</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-white/50 animate-pulse">Loading leads...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Lead</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Partner Ref Code</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Type</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/40">No referrals found in the system.</td>
                  </tr>
                ) : (
                  referrals.map((ref) => (
                    <tr key={ref.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold">{ref.clientName}</p>
                        <p className="text-xs text-white/50">{ref.company || ref.businessName || "No Company"}</p>
                        <p className="text-xs text-white/30">{ref.email} | {ref.phone}</p>
                      </td>
                      <td className="p-4 text-sm font-mono text-[#00ffcc]">{ref.referralCode || "N/A"}</td>
                      <td className="p-4 text-sm text-white/80">{ref.projectType}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(ref.status || "Pending")}`}>
                          {ref.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white/60">
                        {ref.createdAt?.toDate ? ref.createdAt.toDate().toLocaleDateString() : new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
