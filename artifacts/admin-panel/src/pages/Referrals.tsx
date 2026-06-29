import { useQuery } from "@tanstack/react-query";
import { db } from "@workspace/firebase";
import { collection, getDocs, query, updateDoc, doc, where } from "firebase/firestore";
import { Users, MousePointerClick, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

async function fetchReferralsData() {
  const referralsSnap = await getDocs(collection(db, "referrals"));
  const referrals = referralsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  const submissionsSnap = await getDocs(query(collection(db, "projects"), where("referred", "==", true)));
  const submissions = submissionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any))
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPartners = referrals.length;
  const totalClicks = referrals.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalLeads = referrals.reduce((acc, curr) => acc + (curr.leads || curr.totalLeads || 0), 0);
  const approvedProjects = referrals.reduce((acc, curr) => acc + (curr.approvedProjects || 0), 0);
  const totalRevenue = referrals.reduce((acc, curr) => acc + (curr.commission || 0), 0);

  return {
    referrals,
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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["referrals-data"],
    queryFn: fetchReferralsData,
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "projects", id), { status: newStatus });
      refetch();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
                  <td className="px-6 py-4 font-medium">{sub.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div>{sub.email}</div>
                    <div>{sub.phone}</div>
                  </td>
                  <td className="px-6 py-4 capitalize">{sub.projectType}</td>
                  <td className="px-6 py-4">{sub.budget}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-secondary px-2 py-1 rounded text-xs">
                      {sub.referralCode || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{sub.referralPartnerId || "N/A"}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      className="bg-input border border-border text-sm rounded-md px-3 py-1"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
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
