import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import SEOHero from "../../components/seo/SEOHero";
import SEOContent, { SEOSection } from "../../components/seo/SEOContent";
import SEOFAQ from "../../components/seo/SEOFAQ";
import SEOCTA from "../../components/seo/SEOCTA";

export default function MarketingAgencies() {
  const faqs = [
    {
      question: "Do you build SEO-optimized websites?",
      answer: "Yes. As a partner to marketing agencies, we know that a website is useless if it doesn't rank. We build blazingly fast, semantic, and technically flawless websites that give your SEO team the perfect foundation."
    },
    {
      question: "Can you implement custom tracking and analytics?",
      answer: "Absolutely. We routinely implement complex GTM (Google Tag Manager) data layers, Facebook Conversions API, and custom event tracking tailored exactly to your marketing team's requirements."
    },
    {
      question: "Will the website be easy for our clients to edit?",
      answer: "Yes, we integrate modern headless CMS solutions like Sanity or specialized visual editors so your clients can easily change text and images without breaking the design."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  return (
    <>
      <SEO 
        title="Website Development for Marketing Agencies"
        description="Custom website development for marketing agencies. We solve technical challenges so you can focus on strategy, SEO, and scaling your clients' growth."
        canonicalUrl="https://roxtenstudios.com/website-development-for-marketing-agencies"
        schema={schema}
      />
      <Navigation />
      <main className="pt-20">
        <SEOHero 
          badge="For Marketing Teams"
          title="High-Performance Website Development for Marketing Agencies"
          subtitle="Stop letting slow, poorly-coded websites ruin your ad campaigns. We build conversion-optimized web experiences that make your marketing metrics shine."
        />
        
        <SEOContent>
          <SEOSection title="The Challenge Marketing Agencies Face">
            <p>
              You've crafted the perfect ad campaign. The copy is dialed in, the creatives are beautiful, and the targeting is precise. The clicks are rolling in—but the conversions aren't. Why? Because the client's website takes 8 seconds to load, the mobile experience is broken, and the checkout flow is confusing.
            </p>
            <p>
              As a marketing agency, your results are heavily dependent on the quality of the technical infrastructure your traffic lands on. But building enterprise-grade, high-converting websites is a completely different skill set than running paid media or SEO. That is exactly why top-tier marketing agencies partner with Roxten Studios for website development.
            </p>
          </SEOSection>

          <SEOSection title="How Roxten Solves the Technical Bottleneck">
            <p>
              We understand that to a marketing agency, a website is a conversion vehicle. We build with Core Web Vitals, technical SEO, and conversion rate optimization (CRO) in mind from day one. 
            </p>
            <p>
              By partnering with us, you can confidently audit a prospect's terrible website, pitch them a complete rebuild alongside your marketing retainer, and hand the entire technical execution over to us. We build it, you mark it up, and your client gets a digital experience that actually converts your hard-earned traffic into revenue.
            </p>
          </SEOSection>

          <SEOSection title="Our Website Services for Marketers">
            <p>
              We handle everything from headless eCommerce builds capable of handling massive BFCM traffic spikes, to high-converting SaaS landing pages with complex web animations. Furthermore, we implement all the technical tracking infrastructure your media buyers need—from Server-Side Tracking to complex Data Layers.
            </p>
            {/* EXPANSION POINT */}
            <div className="p-6 mt-8 border border-white/10 rounded-xl bg-white/5 italic text-sm text-white/50">
              [Note: Expansion point for deep dive into headless commerce, Core Web Vitals impact on ROAS, and specific marketing case studies in Phase 2.]
            </div>
          </SEOSection>
        </SEOContent>

        <SEOFAQ items={faqs} />
        <SEOCTA />
      </main>
      <Footer />
    </>
  );
}
