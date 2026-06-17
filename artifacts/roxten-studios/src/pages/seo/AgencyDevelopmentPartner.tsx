import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import SEOHero from "../../components/seo/SEOHero";
import SEOContent, { SEOSection } from "../../components/seo/SEOContent";
import SEOFAQ from "../../components/seo/SEOFAQ";
import SEOCTA from "../../components/seo/SEOCTA";

export default function AgencyDevelopmentPartner() {
  const faqs = [
    {
      question: "Why should we use an agency development partner instead of hiring in-house?",
      answer: "Hiring in-house requires salaries, benefits, training, and software licenses, which eats into your margins during slow months. An agency development partner gives you elite talent on-demand, transforming fixed costs into variable costs."
    },
    {
      question: "Do you sign NDAs to protect our agency?",
      answer: "Absolutely. We sign comprehensive Non-Disclosure Agreements with all our agency partners before any work begins, ensuring your client relationships and proprietary strategies are fully protected."
    },
    {
      question: "Can you take over projects that another developer abandoned?",
      answer: "Yes. As a technical partner, we frequently audit, rescue, and rebuild projects that were abandoned by unreliable freelancers or unscalable agencies."
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
        title="Your Dedicated Agency Development Partner"
        description="Looking for a reliable agency development partner? Roxten Studios provides dedicated technical teams for marketing and design agencies to scale flawlessly."
        canonicalUrl="https://roxtenstudios.com/agency-development-partner"
        schema={schema}
      />
      <Navigation />
      <main className="pt-20">
        <SEOHero 
          badge="Technical Partnership"
          title="Your Dedicated Agency Development Partner"
          subtitle="Transform your agency into a full-service powerhouse without writing a single line of code. We provide the technical backbone for your creative vision."
        />
        
        <SEOContent>
          <SEOSection title="Why Agencies Need a Reliable Development Partner">
            <p>
              Growing an agency is difficult. Balancing lead generation, client management, and creative strategy is a full-time job. When you add technical execution to that list—managing servers, fixing bugs, deploying code, and keeping up with the latest frameworks—it becomes overwhelming.
            </p>
            <p>
              This is why the most profitable agencies in the world do not do everything themselves. They focus on their core competencies (strategy, design, marketing) and partner with a specialized agency development partner for the heavy technical lifting. Roxten Studios exists to be that partner. We are the engineering department you always wanted, without the exorbitant overhead.
            </p>
          </SEOSection>

          <SEOSection title="Scale Without Hiring">
            <p>
              The traditional agency model is broken. You win a big client, you scramble to hire developers, the project ends, and suddenly you have a massive payroll to meet without enough incoming work to justify it.
            </p>
            <p>
              By utilizing Roxten Studios as your agency development partner, you convert your fixed payroll costs into variable project costs. If you have ten projects this month, we scale up to deliver them. If you have zero projects next month, you pay nothing. This creates a highly profitable, low-risk business model for your agency.
            </p>
          </SEOSection>

          <SEOSection title="Our Dedicated Development Teams">
            <p>
              When you partner with us, you aren't just throwing tickets into a void. You get a dedicated technical lead who understands your agency's unique workflows, quality standards, and communication style. We integrate seamlessly into your Slack workspace and project management tools, ensuring that your account managers always have accurate technical updates for your clients.
            </p>
            {/* EXPANSION POINT */}
            <div className="p-6 mt-8 border border-white/10 rounded-xl bg-white/5 italic text-sm text-white/50">
              [Note: Expansion point for team structure, technology stack deep-dives, and partner success stories in Phase 2.]
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
