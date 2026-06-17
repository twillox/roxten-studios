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
import Loader from "./components/Loader";

// SEO Pages
import WhiteLabelWebDevelopment from "./pages/seo/WhiteLabelWebDevelopment";
import AgencyDevelopmentPartner from "./pages/seo/AgencyDevelopmentPartner";
import MarketingAgencies from "./pages/seo/MarketingAgencies";
import AIAutomation from "./pages/seo/AIAutomation";
import BlogIndex from "./pages/seo/BlogIndex";
import BlogPost from "./pages/seo/BlogPost";

const queryClient = new QueryClient();

// Scroll reset component that fires on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function App() {
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
            
            {/* SEO Landing Pages */}
            <Route path="/white-label-web-development" component={WhiteLabelWebDevelopment} />
            <Route path="/agency-development-partner" component={AgencyDevelopmentPartner} />
            <Route path="/website-development-for-marketing-agencies" component={MarketingAgencies} />
            <Route path="/ai-automation-for-agencies" component={AIAutomation} />
            
            {/* Blog */}
            <Route path="/blog" component={BlogIndex} />
            <Route path="/blog/:id" component={BlogPost} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
