import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Works from "./pages/Works";
import Contacts from "./pages/Contacts";
import Projects from "./pages/Projects";
import Referrals from "./pages/Referrals";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./lib/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/works">
        <ProtectedRoute>
          <AdminLayout>
            <Works />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/contacts">
        <ProtectedRoute>
          <AdminLayout>
            <Contacts />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/projects">
        <ProtectedRoute>
          <AdminLayout>
            <Projects />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/referrals">
        <ProtectedRoute>
          <AdminLayout>
            <Referrals />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

export default App;
