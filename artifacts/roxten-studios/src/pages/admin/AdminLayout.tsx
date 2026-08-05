import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { authService } from "../../lib/firebase-services";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Menu, X, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        setLocation("/referral/login");
      }
    }
  }, [user, loading, location, setLocation]);

  const handleLogout = async () => {
    await authService.logout();
    setLocation("/referral/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/referrals", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Partners", href: "/admin/partners", icon: <Users className="w-5 h-5" /> },
    { label: "Payouts", href: "/admin/payouts", icon: <CreditCard className="w-5 h-5" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  if (loading || !user) return <div className="min-h-screen bg-[#050505]" />; // Loading state

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="font-black text-lg uppercase tracking-tight text-white flex items-center gap-1.5">
          ROXTEN <span className="font-medium opacity-60 text-xs tracking-widest text-red-500">ADMIN</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="hidden md:flex h-20 items-center px-8 border-b border-white/5">
          <div className="font-black text-xl uppercase tracking-tight text-white flex items-center gap-1.5">
            ROXTEN <span className="font-medium opacity-60 text-xs tracking-widest text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> ADMIN</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-6 px-4">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Admin Menu</p>
            {navItems.map(item => {
              const isActive = location === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); setLocation(item.href); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-red-500" : ""}>{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#050505] pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-10 pb-24">
          {children}
        </div>
      </main>
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
