import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import ReferralNavbar from "../../components/referral/ReferralNavbar";
import Footer from "../../components/Footer";
import { ChevronRight, DollarSign, Users, Briefcase, Zap, ShieldCheck } from "lucide-react";

export default function ReferralLanding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#00ffcc] selection:text-black font-sans">
      <ReferralNavbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-[200px] pb-24 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffcc]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
            <span className="text-xs font-bold tracking-widest uppercase text-[#00ffcc]">Roxten Partner Network</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[1.05] font-black tracking-tight mb-8">
            REFER & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">EARN RECURRING</span> <br />
            COMMISSIONS
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light mb-12">
            Recommend businesses, agencies, or startups to Roxten Studios and earn a percentage for every successful project closed. Premium web, software, and AI solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => setLocation("/referral/signup")}
              className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#00ffcc] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Become a Partner <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => setLocation("/referral/login")}
              className="px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-sm rounded-full transition-colors"
            >
              Log In
            </button>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 md:px-12 bg-white/5 border-y border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none uppercase tracking-tight">
              How It Works
            </h2>
            <p className="text-white/60 max-w-md font-light">
              A transparent, hassle-free referral process designed for maximum earning potential with zero sales pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Refer a Client", desc: "Submit their details through your partner dashboard." },
              { num: "02", title: "We Contact Them", desc: "Our expert team handles all the pitching and negotiation." },
              { num: "03", title: "Project Closed", desc: "The client signs with Roxten Studios." },
              { num: "04", title: "You Earn", desc: "Get paid a hefty commission, automatically." }
            ].map((step, i) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-8 border border-white/10 bg-black/20 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="text-4xl font-black text-[#00ffcc]/30 group-hover:text-[#00ffcc] transition-colors mb-6">{step.num}</div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{step.title}</h3>
                <p className="text-white/50 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMISSION CARDS */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
         <div className="text-center mb-20">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none uppercase tracking-tight mb-6">
            Commission Structure
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto font-light">
            We build high-ticket digital products. This means your commissions are substantial. 
            Earn up to 15% on every closed deal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Website Projects", icon: <Briefcase />, desc: "Corporate sites, e-commerce, and high-end landing pages." },
            { title: "Software Projects", icon: <Zap />, desc: "SaaS platforms, web apps, and custom internal tools." },
            { title: "AI Solutions", icon: <Zap />, desc: "AI integrations, automation workflows, and custom LLMs." },
            { title: "Automation", icon: <DollarSign />, desc: "Business process automation and CRM setups." },
            { title: "Agency Partnerships", icon: <Users />, desc: "White-label collaborations and ongoing dev support." }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-2xl flex flex-col justify-between min-h-[250px]"
            >
              <div>
                <div className="w-12 h-12 bg-[#00ffcc]/10 rounded-full flex items-center justify-center text-[#00ffcc] mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm">{card.desc}</p>
              </div>
              <div className="mt-8 font-mono text-[#00ffcc] tracking-widest text-sm font-bold uppercase">
                High-Ticket
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 px-6 md:px-12 bg-white text-black">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none uppercase tracking-tight mb-8">
              Why Partner With Us?
            </h2>
            <div className="space-y-6">
              {[
                { title: "No Sales Pressure", desc: "You just make the intro. We close the deal." },
                { title: "Dedicated Dashboard", desc: "Track every lead, proposal, and payout in real-time." },
                { title: "Monthly Payouts", desc: "Reliable, transparent, and on-time payments via Bank, UPI, or PayPal." },
                { title: "Premium Portfolio", desc: "You're recommending a studio that delivers world-class quality." }
              ].map(benefit => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="mt-1">
                    <ShieldCheck className="w-6 h-6 text-black/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg uppercase tracking-wide">{benefit.title}</h3>
                    <p className="text-black/60">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[600px] rounded-3xl overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
            {/* Abstract visual or placeholder for dashboard mockup */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#333] p-12 flex flex-col justify-center">
              <div className="w-full bg-white/10 backdrop-blur-md h-full rounded-2xl border border-white/20 p-6 flex flex-col gap-4 shadow-2xl">
                <div className="w-1/3 h-4 bg-white/20 rounded"></div>
                <div className="w-1/2 h-8 bg-white/30 rounded mt-4"></div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="h-24 bg-white/10 rounded-xl"></div>
                  <div className="h-24 bg-white/10 rounded-xl"></div>
                  <div className="h-24 bg-[#00ffcc]/20 rounded-xl border border-[#00ffcc]/30"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase tracking-tight mb-8">
          Ready to Start Earning?
        </h2>
        <button
          onClick={() => setLocation("/referral/signup")}
          className="px-12 py-5 bg-[#00ffcc] text-black font-black uppercase tracking-widest text-lg rounded-full hover:scale-105 transition-transform"
        >
          Join the Partner Network
        </button>
      </section>

      <Footer />
    </div>
  );
}
