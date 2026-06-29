import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";

import Cursor from "./components/Cursor";
import GrainOverlay from "./components/GrainOverlay";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import PartnershipQuery from "./pages/PartnershipQuery";
import StartProject from "./pages/StartProject";
import Loader from "./components/Loader";
import useReferralTracking from "./hooks/useReferralTracking";

// SEO Pages
import WhiteLabelWebDevelopment from "./pages/seo/WhiteLabelWebDevelopment";
import AgencyDevelopmentPartner from "./pages/seo/AgencyDevelopmentPartner";
import MarketingAgencies from "./pages/seo/MarketingAgencies";
import AIAutomation from "./pages/seo/AIAutomation";
import BlogIndex from "./pages/seo/BlogIndex";
import BlogPost from "./pages/seo/BlogPost";

// Referral Portal
import ReferralLanding from "./pages/referral/ReferralLanding";
import Login from "./pages/referral/Login";
import Signup from "./pages/referral/Signup";
import ReferredLeadForm from "./pages/ReferredLeadForm";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ReferralDashboardHome from "./pages/dashboard/ReferralDashboardHome";
import ReferralLinkPage from "./pages/dashboard/ReferralLinkPage";
import MyReferrals from "./pages/dashboard/MyReferrals";
import Commissions from "./pages/dashboard/Commissions";
import Payouts from "./pages/dashboard/Payouts";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Resources from "./pages/dashboard/Resources";
import ProfileSettings from "./pages/dashboard/ProfileSettings";

// Admin Portal
import AdminLayout from "./pages/admin/AdminLayout";
import AdminReferralsHome from "./pages/admin/AdminReferralsHome";

const queryClient = new QueryClient();

// Scroll reset component that fires on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

import { AuthProvider } from "./hooks/useAuth";

function App() {
  useReferralTracking();

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Loader />
          <TooltipProvider>
        <GrainOverlay />
        <Cursor />
        <ScrollToTop />
        <div className="min-h-screen w-full overflow-hidden">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/archive" component={Archive} />
            <Route path="/partnership/:type" component={PartnershipQuery} />
            <Route path="/start-project" component={StartProject} />
            
            {/* SEO Landing Pages */}
            <Route path="/white-label-web-development" component={WhiteLabelWebDevelopment} />
            <Route path="/agency-development-partner" component={AgencyDevelopmentPartner} />
            <Route path="/website-development-for-marketing-agencies" component={MarketingAgencies} />
            <Route path="/ai-automation-for-agencies" component={AIAutomation} />
            
            {/* Blog */}
            <Route path="/blog" component={BlogIndex} />
            <Route path="/blog/:id" component={BlogPost} />

            {/* Referral Portal */}
            <Route path="/referral" component={ReferralLanding} />
            <Route path="/referral/login" component={Login} />
            <Route path="/referral/signup" component={Signup} />
            <Route path="/ref/:code" component={ReferredLeadForm} />
            
            <Route path="/dashboard/referral" component={() => <DashboardLayout><ReferralDashboardHome /></DashboardLayout>} />
            <Route path="/dashboard/referral/link" component={() => <DashboardLayout><ReferralLinkPage /></DashboardLayout>} />
            <Route path="/dashboard/referral/list" component={() => <DashboardLayout><MyReferrals /></DashboardLayout>} />
            <Route path="/dashboard/referral/commissions" component={() => <DashboardLayout><Commissions /></DashboardLayout>} />
            <Route path="/dashboard/referral/payouts" component={() => <DashboardLayout><Payouts /></DashboardLayout>} />
            <Route path="/dashboard/referral/leaderboard" component={() => <DashboardLayout><Leaderboard /></DashboardLayout>} />
            <Route path="/dashboard/referral/resources" component={() => <DashboardLayout><Resources /></DashboardLayout>} />
            <Route path="/dashboard/referral/profile" component={() => <DashboardLayout><ProfileSettings /></DashboardLayout>} />
            <Route path="/dashboard/referral/settings" component={() => <DashboardLayout><ProfileSettings /></DashboardLayout>} />

            {/* Admin Portal */}
            <Route path="/admin/referrals" component={() => <AdminLayout><AdminReferralsHome /></AdminLayout>} />
            <Route path="/admin/:page" component={() => <AdminLayout><AdminReferralsHome /></AdminLayout>} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
