import { Link, useLocation } from "wouter";
import { LayoutDashboard, Briefcase, Mail, Folders, LogOut, Users } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/works", label: "Works", icon: Briefcase },
  { href: "/contacts", label: "Contacts", icon: Mail },
  { href: "/projects", label: "Projects", icon: Folders },
  { href: "/referrals", label: "Referrals", icon: Users },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLocation("/login");
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tighter">Roxten Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-secondary/50"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
