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
import SEO from "../components/SEO";

// Hairline dividers between sections
function DarkLine() {
  return <div className="w-full h-[2px] bg-black" />;
}
function LightLine() {
  return <div className="w-full h-[2px] bg-white" />;
}

export default function Home() {
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Roxten Studios",
      "url": "https://roxtenstudios.in",
      "logo": "https://roxtenstudios.in/favicon.svg"
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Roxten Studios",
      "image": "https://roxtenstudios.in/og-image.jpg",
      "url": "https://roxtenstudios.in",
      "telephone": "+1234567890",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Roxten Studios",
      "url": "https://roxtenstudios.in"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "White Label Software Development",
      "provider": {
        "@type": "Organization",
        "name": "Roxten Studios"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is white label web development?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "White label web development is a partnership where we build websites and applications under your agency's brand. You sell the service to your clients, and we handle the technical execution invisibly."
          }
        },
        {
          "@type": "Question",
          "name": "Do you act as an agency development partner?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we act as a dedicated technical partner for marketing and design agencies looking to scale without hiring internal developers."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="White Label Web & Software Development for Agencies"
        description="Scale your agency without the overhead. Roxten Studios provides premium white-label web development, eCommerce, and AI automation for marketing & design agencies."
        schema={homeSchema}
      />
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
