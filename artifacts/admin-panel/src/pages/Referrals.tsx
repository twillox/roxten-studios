import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db, storage } from "@workspace/firebase";
import { collection, getDocs, query, updateDoc, doc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Users, MousePointerClick, TrendingUp, CheckCircle, DollarSign, X, Upload } from "lucide-react";

async function fetchReferralsData() {
  let partners: any[] = [];
  let submissions: any[] = [];
  let fetchError = null;

  try {
    const partnersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "partner")));
    partners = partnersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch (err: any) {
    console.error("Error fetching partners:", err);
    fetchError = "Failed to fetch partners. You may not have Admin permissions. " + err.message;
  }

  try {
    const leadsSnap = await getDocs(collection(db, "referrals"));
    submissions = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any))
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return dateB - dateA;
      });
  } catch (err: any) {
    console.error("Error fetching referrals:", err);
    fetchError = fetchError || ("Failed to fetch referrals. You may not have Admin permissions. " + err.message);
  }

  if (fetchError) {
    throw new Error(fetchError);
  }

  const totalPartners = partners.length;
  const totalClicks = partners.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalLeads = submissions.length;
  const approvedProjects = submissions.filter(s => s.status === "Won" || s.status === "Paid").length;
  const totalRevenue = submissions.reduce((acc, curr) => acc + (curr.commissionEarned || curr.projectValue || 0), 0);

  return {
    referrals: partners,
    submissions,
    stats: {
      totalPartners,
      totalClicks,
      totalLeads,
      approvedProjects,
      totalRevenue
    }
  };
}

export default function Referrals() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["referrals-data"],
    queryFn: async () => {
      try {
        return await fetchReferralsData();
      } catch (err) {
        console.error("fetchReferralsData Error:", err);
        throw err;
      }
    },
  });

  const [paidModalLeadId, setPaidModalLeadId] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500 p-8 bg-red-500/10 rounded-xl font-mono">Error: {error?.toString()}</div>;

  const { submissions, stats } = data || { submissions: [], stats: {} as any };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
        <p className="text-muted-foreground mt-2">Manage your referral partners, analytics, and track referred projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Partners" value={stats?.totalPartners} icon={Users} />
        <StatCard title="Total Clicks" value={stats?.totalClicks} icon={MousePointerClick} />
        <StatCard title="Total Leads" value={stats?.totalLeads} icon={TrendingUp} />
        <StatCard title="Approved Projects" value={stats?.approvedProjects} icon={CheckCircle} />
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon={DollarSign} />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Referral Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Project Type</th>
                <th className="px-6 py-4">Budget / Amount</th>
                <th className="px-6 py-4">Ref Code</th>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {sub.clientName}
                    <div className="text-xs text-muted-foreground">{sub.company || sub.businessName}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div>{sub.email || sub.clientEmail}</div>
                    <div>{sub.phone || sub.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4 capitalize">{sub.projectType}</td>
                  <td className="px-6 py-4">
                    {sub.amount || sub.projectValue ? `$${sub.amount || sub.projectValue}` : "TBD"}
                    {sub.commissionEarned && (
                      <div className="text-xs text-[#00ffcc] mt-1">Comm: ${sub.commissionEarned}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-secondary px-2 py-1 rounded text-xs">
                      {sub.referralCode || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{sub.partnerId || "N/A"}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : (sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "N/A")}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={sub.status || "Pending"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        if (newStatus === "Paid") {
                          setPaidModalLeadId(sub.id);
                        } else {
                          try {
                            await updateDoc(doc(db, "referrals", sub.id), { status: newStatus });
                            refetch();
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      className="bg-input border border-border text-sm rounded-md px-3 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Paid">Paid</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paidModalLeadId && (
        <MarkAsPaidModal 
          leadId={paidModalLeadId} 
          onClose={() => setPaidModalLeadId(null)} 
          onSuccess={() => {
            setPaidModalLeadId(null);
            refetch();
          }} 
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="text-muted-foreground" size={20} />
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function MarkAsPaidModal({ leadId, onClose, onSuccess }: { leadId: string, onClose: () => void, onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [percent, setPercent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !percent) return;
    
    setLoading(true);
    try {
      let invoiceUrl = "";
      let invoiceName = "";

      if (file) {
        const storageRef = ref(storage, `invoices/${leadId}/${file.name}`);
        await uploadBytes(storageRef, file);
        invoiceUrl = await getDownloadURL(storageRef);
        invoiceName = file.name;
      }

      const totalAmount = parseFloat(amount);
      const commissionPct = parseFloat(percent);
      const commissionEarned = totalAmount * (commissionPct / 100);

      await updateDoc(doc(db, "referrals", leadId), {
        status: "Paid",
        amount: totalAmount,
        commissionPercentage: commissionPct,
        commissionEarned,
        invoiceUrl: invoiceUrl || null,
        invoiceName: invoiceName || null,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as paid. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-6">Mark Lead as Paid</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Total Amount Paid ($)</label>
            <input 
              type="number" 
              required 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2"
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Commission Percentage (%)</label>
            <input 
              type="number" 
              required 
              value={percent}
              onChange={e => setPercent(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2"
              placeholder="e.g. 10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Invoice (Optional)</label>
            <label className="flex items-center gap-2 w-full bg-input border border-border border-dashed rounded-lg px-4 py-4 cursor-pointer hover:bg-secondary/20 transition-colors">
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Click to upload PDF or Image"}
              </span>
              <input 
                type="file" 
                className="hidden" 
                onChange={e => setFile(e.target.files?.[0] || null)}
                accept="application/pdf,image/*"
              />
            </label>
          </div>
          
          <div className="bg-secondary/20 p-4 rounded-lg mt-6">
            <p className="text-sm text-muted-foreground flex justify-between">
              Calculated Commission:
              <span className="font-bold text-foreground">
                ${(parseFloat(amount || "0") * (parseFloat(percent || "0") / 100)).toFixed(2)}
              </span>
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-medium rounded-lg px-4 py-2 mt-4 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
