import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Briefcase, Mail, Folders } from "lucide-react";
import { db } from "@workspace/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

async function fetchStats() {
  const worksSnap = await getDocs(collection(db, "works"));
  
  const contactsQuery = query(collection(db, "contacts"), where("status", "==", "new"));
  const contactsSnap = await getDocs(contactsQuery);
  
  const projectsQuery = query(collection(db, "projects"), where("status", "==", "new"));
  const projectsSnap = await getDocs(projectsQuery);

  return {
    works: worksSnap.size,
    contacts: contactsSnap.size,
    projects: projectsSnap.size,
  };
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your Roxten admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Portfolio Works"
          value={isLoading ? "..." : data?.works}
          icon={Briefcase}
          href="/works"
          description="Total works in portfolio"
        />
        <StatCard
          title="New Messages"
          value={isLoading ? "..." : data?.contacts}
          icon={Mail}
          href="/contacts"
          description="Unread contact messages"
        />
        <StatCard
          title="New Projects"
          value={isLoading ? "..." : data?.projects}
          icon={Folders}
          href="/projects"
          description="Pending project requests"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, href, description }: any) {
  return (
    <Link href={href}>
      <a className="block p-6 bg-card border border-border rounded-xl hover:border-ring transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <Icon className="text-muted-foreground" size={20} />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </a>
    </Link>
  );
}
