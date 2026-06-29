import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import SEOHero from "../../components/seo/SEOHero";
import SEOContent, { SEOSection } from "../../components/seo/SEOContent";
import SEOFAQ from "../../components/seo/SEOFAQ";
import SEOCTA from "../../components/seo/SEOCTA";

export default function WhiteLabelWebDevelopment() {
  const faqs = [
    {
      question: "What exactly is white-label web development?",
      answer: "White-label web development is a B2B partnership where Roxten Studios operates as your invisible, behind-the-scenes technical team. We build the websites, applications, and custom software, but you sell them to your clients under your own agency's brand. Your clients never know we exist."
    },
    {
      question: "Do you communicate directly with my clients?",
      answer: "No. We communicate exclusively with you or your project managers via Slack, email, or your preferred project management tool. We remain 100% invisible to your end clients unless you explicitly request us to join a technical discovery call as 'your internal technical team'."
    },
    {
      question: "What technologies do you use for white-label projects?",
      answer: "We specialize in modern, high-performance tech stacks including React, Next.js, Framer Motion, and Tailwind CSS for front-end, along with Node.js and Firebase for back-end infrastructure. We can also handle Shopify, Webflow, and custom API integrations."
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
        title="White Label Web Development Services for Agencies"
        description="Scale your agency with premium white label web development services. We build high-performance websites and applications entirely under your brand."
        canonicalUrl="https://roxtenstudios.in/white-label-web-development"
        schema={schema}
      />
      <Navigation />
      <main className="pt-20">
        <SEOHero 
          badge="Agency Partnership Program"
          title="The Ultimate White Label Web Development Partner"
          subtitle="Stop turning down complex technical projects. Roxten Studios acts as your invisible development arm, delivering premium, high-performance websites under your own brand."
        />
        
        <SEOContent>
          <SEOSection title="What is White Label Web Development?">
            <p>
              In today's highly competitive digital landscape, marketing, SEO, and design agencies are constantly asked to deliver more than just their core services. Clients want full-service solutions. They want branding, marketing, and the high-performance technical infrastructure to support it. But hiring, training, and retaining an elite in-house development team is incredibly expensive and risky.
            </p>
            <p>
              That is where white-label web development comes in. By partnering with Roxten Studios, you gain instant access to a dedicated team of senior engineers and UI/UX specialists. We handle the complex coding, architecture, animations, and deployment. You handle the client relationship, the strategy, and the markup. 
            </p>
            <p>
              When the project is complete, you deliver it to your client as your own. Our name is never on the code, never on the staging links, and never in the conversation.
            </p>
          </SEOSection>

          <SEOSection title="Why Ambitious Agencies Need a Technical Partner">
            <p>
              Many agencies try to get by using unreliable freelancers or cheap offshore talent, only to realize that poor communication, missed deadlines, and spaghetti code end up costing them their reputation. A true white-label development partner is not just an outsourced coder; we are a strategic extension of your business.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 opacity-80">
              <li><strong>Zero Overhead:</strong> No salaries, benefits, or software licenses to pay for idle developers. You only pay when you have a project.</li>
              <li><strong>Infinite Scalability:</strong> Whether you sell one website a month or ten, our infrastructure scales to meet your delivery requirements.</li>
              <li><strong>Premium Quality:</strong> We don't build generic WordPress templates. We build custom, highly-animated, enterprise-grade React applications that command premium pricing.</li>
            </ul>
          </SEOSection>

          <SEOSection title="Our Seamless White-Label Delivery Process">
            <p>
              We integrate directly into your agency's existing workflow. Whether you use Slack, Asana, ClickUp, or Jira, our project managers adapt to your systems. 
              We provide unbranded staging environments for client reviews, sign ironclad Non-Disclosure Agreements (NDAs), and offer ongoing maintenance retainers so you can generate recurring revenue long after the website launches.
            </p>
            {/* EXPANSION POINT: Add detailed process steps and case studies in Phase 2 */}
            <div className="p-6 mt-8 border border-white/10 rounded-xl bg-white/5 italic text-sm text-white/50">
              [Note: Expansion point for detailed case studies and technical architecture breakdowns.]
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
