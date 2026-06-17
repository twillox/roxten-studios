import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Services from "../components/Services";
import Work from "../components/Work";
import Process from "../components/Process";
import Technology from "../components/Technology";
import WhyRoxten from "../components/WhyRoxten";
import Testimonials from "../components/Testimonials";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PartnershipModels from "../components/PartnershipModels";
import Referral from "../components/Referral";

// Hairline dividers between sections
function DarkLine() {
  return <div className="w-full h-[2px] bg-black" />;
}
function LightLine() {
  return <div className="w-full h-[2px] bg-white" />;
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* DARK: Hero — video background */}
        <Hero />

        {/* dark → white divider */}
        <DarkLine />

        {/* WHITE: Marquee ticker */}
        <Marquee />

        {/* WHITE: Services — black flood on hover */}
        <Services />

        {/* white → dark divider */}
        <LightLine />

        {/* DARK: Work */}
        <Work />

        {/* dark → white divider */}
        <DarkLine />

        {/* WHITE: Process */}
        <Process />

        {/* WHITE: Why Roxten */}
        <WhyRoxten />

        {/* white → dark divider */}
        <LightLine />

        {/* DARK: Technology */}
        <Technology />

        <LightLine />

        {/* DARK: Partnership Models */}
        <PartnershipModels />

        {/* DARK: Referral */}
        <Referral />

        {/* dark → white divider */}
        <DarkLine />

        {/* WHITE: About */}
        <About />

        {/* white → dark divider */}
        <LightLine />

        {/* DARK: Testimonials */}
        <Testimonials />

        {/* DARK: Contact */}
        <Contact />
      </main>

      {/* DARK: Footer */}
      <Footer />
    </>
  );
}
