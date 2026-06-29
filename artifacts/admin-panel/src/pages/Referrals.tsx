import { useQuery } from "@tanstack/react-query";
import { db } from "@workspace/firebase";
import { collection, getDocs, query, updateDoc, doc, where } from "firebase/firestore";
import { Users, MousePointerClick, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

async function fetchReferralsData() {
  let partners: any[] = [];
  let submissions: any[] = [];
  let fetchError = null;

  try {
    // 1. Fetch Partners from 'users' collection
    const partnersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "partner")));
    partners = partnersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  } catch (err: any) {
    console.error("Error fetching partners:", err);
    fetchError = "Failed to fetch partners. You may not have Admin permissions. " + err.message;
  }

  try {
    // 2. Fetch Leads from 'referrals' collection
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
  // Clicks and commissions can be calculated if those fields exist, else default to 0
  const totalClicks = partners.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalLeads = submissions.length;
  const approvedProjects = submissions.filter(s => s.status === "Won" || s.status === "Paid").length;
  const totalRevenue = submissions.reduce((acc, curr) => acc + (curr.commissionEarned || curr.projectValue || 0), 0);

  return {
    referrals: partners, // Keep the key as 'referrals' for backward compatibility if needed, though it's partners now
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



  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500 p-8 bg-red-500/10 rounded-xl font-mono">Error: {error?.toString()}</div>;

  const { submissions, stats } = data || { submissions: [], stats: {} as any };

  return (
    <div className="space-y-8">
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
                <th className="px-6 py-4">Budget</th>
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
                  <td className="px-6 py-4">{sub.amount || sub.projectValue ? `$${sub.amount || sub.projectValue}` : "TBD"}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-secondary px-2 py-1 rounded text-xs">
                      {sub.referralCode || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{sub.partnerId || "N/A"}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : (sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "N/A")}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={sub.status || "Pending"}
                      onChange={async (e) => {
                        try {
                          await updateDoc(doc(db, "referrals", sub.id), { status: e.target.value });
                          refetch();
                        } catch (err) {
                          console.error(err);
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
