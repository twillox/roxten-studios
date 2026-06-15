import { Switch, Route } from "wouter";
import Dashboard from "./pages/Dashboard";
import Works from "./pages/Works";
import Contacts from "./pages/Contacts";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";

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
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/works">
        <AdminLayout>
          <Works />
        </AdminLayout>
      </Route>
      <Route path="/contacts">
        <AdminLayout>
          <Contacts />
        </AdminLayout>
      </Route>
      <Route path="/projects">
        <AdminLayout>
          <Projects />
        </AdminLayout>
      </Route>
    </Switch>
  );
}

export default App;
