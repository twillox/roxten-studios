import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import SEOHero from "../../components/seo/SEOHero";
import SEOContent, { SEOSection } from "../../components/seo/SEOContent";
import SEOFAQ from "../../components/seo/SEOFAQ";
import SEOCTA from "../../components/seo/SEOCTA";

export default function AIAutomation() {
  const faqs = [
    {
      question: "What kind of AI automation can you build for our clients?",
      answer: "We build everything from intelligent customer service chatbots trained on the client's proprietary data, to automated lead qualification systems that integrate directly with their CRM, to AI-driven voice calling systems."
    },
    {
      question: "Do we need to know how to code AI to sell these services?",
      answer: "Not at all. You sell the business outcome (e.g., 'Save 40 hours a week on customer support', or 'Qualify leads instantly 24/7'). We handle 100% of the complex API integrations, vector databases, and machine learning models behind the scenes."
    },
    {
      question: "Are these AI solutions secure for enterprise clients?",
      answer: "Yes. We implement enterprise-grade security and ensure that client data is not used to train public models. We utilize secure private APIs from providers like OpenAI, Anthropic, and Google."
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
        title="White-Label AI Automation Services for Agencies"
        description="Offer AI automation to your clients without hiring engineers. We build custom AI chatbots, lead qualification systems, and automated workflows under your brand."
        canonicalUrl="https://roxtenstudios.in/ai-automation-for-agencies"
        schema={schema}
      />
      <Navigation />
      <main className="pt-20">
        <SEOHero 
          badge="AI & Machine Learning"
          title="White-Label AI Automation for Ambitious Agencies"
          subtitle="Every business in the world is looking for AI solutions. Capitalize on the demand by offering custom AI chatbots, workflow automation, and machine learning integrations—built entirely by us, branded entirely as you."
        />
        
        <SEOContent>
          <SEOSection title="The AI Opportunity for Agencies">
            <p>
              Your clients are asking about AI. They know it can save them money, increase their operational efficiency, and drive more revenue. But right now, if you only offer traditional marketing or web design services, you are leaving massive amounts of money on the table.
            </p>
            <p>
              The problem is, building real AI solutions requires specialized engineering knowledge—understanding LLMs (Large Language Models), RAG (Retrieval-Augmented Generation), vector databases, and complex API orchestration. You don't have the time to learn this, and hiring an AI engineer is incredibly expensive. That is why agencies partner with Roxten Studios.
            </p>
          </SEOSection>

          <SEOSection title="Intelligent AI Chatbots & Customer Service">
            <p>
              Forget the frustrating rule-based chatbots of the past. We build intelligent, conversational AI agents that are trained specifically on your client's business data (their website, PDFs, internal wikis). These agents can handle customer support queries, book appointments, and answer complex technical questions 24/7 with near-human accuracy.
            </p>
          </SEOSection>

          <SEOSection title="Lead Qualification & Workflow Automation">
            <p>
              We help you automate your clients' sales pipelines. Imagine an AI system that instantly responds to inbound leads, asks qualifying questions, grades the lead, and then automatically injects the data into Salesforce or HubSpot—alerting the sales team only when a lead is highly qualified.
            </p>
            <p>
              By offering these AI automation services to your clients, you instantly position your agency as a high-value technical consultancy, allowing you to charge significantly higher retainers while delivering ROI that is easily measurable.
            </p>
            {/* EXPANSION POINT */}
            <div className="p-6 mt-8 border border-white/10 rounded-xl bg-white/5 italic text-sm text-white/50">
              [Note: Expansion point for AI Call Handling Systems, technical stack breakdowns, and specific AI case studies in Phase 2.]
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
