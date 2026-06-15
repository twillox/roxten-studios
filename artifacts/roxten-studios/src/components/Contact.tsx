import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const projectTypes = [
  {
    id: "website",
    label: "Website",
    desc: "Marketing websites & landing pages",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  },
  {
    id: "mobile",
    label: "Mobile App",
    desc: "iOS & Android native experiences",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
  },
  {
    id: "ai",
    label: "AI Product",
    desc: "Agents, automation & AI tools",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
  },
  {
    id: "saas",
    label: "SaaS Platform",
    desc: "Scalable cloud applications",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  }
];

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  // === WIZARD STATE (Start a Project) ===
  const [step, setStep] = useState(1);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState({
    projectType: "", budget: "", timeline: "", description: "", name: "", email: "", mobile: "",
  });

  // === SIMPLE FORM STATE (Contact Now) ===
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactData, setContactData] = useState({ name: "", email: "", query: "" });

  // GSAP Initial Reveal
  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.reveal-elem');
    
    gsap.fromTo(elements, 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } }
    );
    gsap.to('.glowing-divider', { boxShadow: "0 0 30px 2px rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.4)", duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }, { scope: containerRef });

  // === WIZARD HANDLERS ===
  const handleWizardChange = (field: keyof typeof wizardData, value: string) => {
    setWizardError(null);
    if (field === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectTypeSelect = (id: string) => {
    setWizardError(null);
    setWizardData(prev => ({ ...prev, projectType: id }));
    setStep(2);
  };

  const handleWizardNext = async () => {
    setWizardError(null);

    if (step === 2) {
      if (!wizardData.budget || !wizardData.timeline || !wizardData.description.trim()) {
        setWizardError("Please fill out all fields before continuing.");
        return;
      }
      setStep(3);
    }
    
    if (step === 3) {
      if (!wizardData.name.trim() || !wizardData.email.trim() || !wizardData.mobile.trim()) {
        setWizardError("Please fill out all fields.");
        return;
      }
      if (wizardData.mobile.length !== 10) {
        setWizardError("Mobile number must be 10 digits.");
        return;
      }
      if (!wizardData.email.includes("@")) {
        setWizardError("Valid email required.");
        return;
      }
      
      try {
        const { db } = await import("@workspace/firebase");
        const { collection, addDoc } = await import("firebase/firestore");
        
        await addDoc(collection(db, "projects"), {
          ...wizardData,
          details: wizardData.description + `\n\nTimeline: ${wizardData.timeline}\nType: ${wizardData.projectType}\nMobile: ${wizardData.mobile}`,
          status: "new",
          createdAt: Date.now()
        });

        setStep(4);
      } catch (err: any) {
        setWizardError(err.message || "Failed to submit request.");
      }
    }
  };

  // === CONTACT FORM HANDLERS ===
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.query.trim()) {
      setContactError("Please fill out all fields.");
      return;
    }
    if (!contactData.email.includes("@")) {
      setContactError("Please enter a valid email address.");
      return;
    }
    
    setContactStatus("submitting");

    try {
      const { db } = await import("@workspace/firebase");
      const { collection, addDoc } = await import("firebase/firestore");
      
      await addDoc(collection(db, "projects"), {
        name: contactData.name,
        email: contactData.email,
        details: contactData.query,
        status: "new",
        type: "contact_query",
        createdAt: Date.now()
      });

      setContactStatus("success");
    } catch (err: any) {
      setContactError(err.message || "Failed to send message.");
      setContactStatus("error");
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: 30, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <section id="contact" ref={containerRef} className="relative bg-[#000] pt-40 pb-32 md:py-48 min-h-screen z-10 font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      <div className="max-w-[1800px] mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col lg:flex-row relative gap-12 lg:gap-0">
          
          {/* ==========================================
              LEFT COLUMN: START A PROJECT (WIZARD)
              ========================================== */}
          <div className="flex-1 lg:pr-24 relative min-h-[500px]">
            <p className="reveal-elem text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">Let's Build</p>
            <h2 className="reveal-elem text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6">Start a Project</h2>
            <p className="reveal-elem text-white/50 text-lg md:text-xl font-light mb-12 max-w-md">Tell us what you're building and we'll help bring it to life.</p>
            
            <div className="reveal-elem relative w-full">
              <AnimatePresence mode="wait">
                {/* WIZARD STEP 1 */}
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                    <label className="block text-white/40 text-xs tracking-widest uppercase font-mono mb-6">1. Select Project Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projectTypes.map((pt) => {
                        const isSelected = wizardData.projectType === pt.id;
                        return (
                          <button
                            key={pt.id}
                            onClick={() => handleProjectTypeSelect(pt.id)}
                            className={`text-left p-6 rounded-[24px] transition-all duration-400 ease-out backdrop-blur-[20px] ${isSelected ? 'bg-white/[0.08] border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/20'}`}
                          >
                            <div className={`mb-4 transition-colors duration-400 ${isSelected ? 'text-white' : 'text-white/40'}`}>{pt.icon}</div>
                            <h4 className="text-white font-bold text-lg tracking-tight mb-2">{pt.label}</h4>
                            <p className="text-white/40 text-xs leading-relaxed">{pt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* WIZARD STEP 2 */}
                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => setStep(1)} className="text-white/40 hover:text-white p-2 -ml-2 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                      </button>
                      <label className="text-white/40 text-xs tracking-widest uppercase font-mono">2. Details</label>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                          <select value={wizardData.budget} onChange={(e) => handleWizardChange('budget', e.target.value)} className={`w-full bg-transparent p-4 outline-none cursor-pointer ${wizardData.budget ? 'text-white' : 'text-white/30'}`}>
                            <option value="" disabled>Select Budget</option>
                            <option value="25k" className="bg-black text-white">$25k - $50k</option>
                            <option value="50k" className="bg-black text-white">$50k - $100k</option>
                            <option value="100k" className="bg-black text-white">$100k+</option>
                          </select>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                          <select value={wizardData.timeline} onChange={(e) => handleWizardChange('timeline', e.target.value)} className={`w-full bg-transparent p-4 outline-none cursor-pointer ${wizardData.timeline ? 'text-white' : 'text-white/30'}`}>
                            <option value="" disabled>Select Timeline</option>
                            <option value="1m" className="bg-black text-white">1-2 Months</option>
                            <option value="3m" className="bg-black text-white">3-6 Months</option>
                            <option value="6m" className="bg-black text-white">6+ Months</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <textarea rows={4} value={wizardData.description} onChange={(e) => handleWizardChange('description', e.target.value)} placeholder="Project Description" className="w-full bg-transparent text-white p-4 outline-none resize-none placeholder-white/30" />
                      </div>
                      {wizardError && <p className="text-red-400 text-sm">{wizardError}</p>}
                      <button onClick={handleWizardNext} className="w-full py-5 mt-4 bg-white text-black font-bold tracking-widest uppercase rounded-[16px] hover:bg-white/90 transition-all duration-300">
                        Continue →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* WIZARD STEP 3 */}
                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => setStep(2)} className="text-white/40 hover:text-white p-2 -ml-2 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                      </button>
                      <label className="text-white/40 text-xs tracking-widest uppercase font-mono">3. Your Info</label>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <input type="text" value={wizardData.name} onChange={(e) => handleWizardChange('name', e.target.value)} placeholder="Full Name" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <input type="email" value={wizardData.email} onChange={(e) => handleWizardChange('email', e.target.value)} placeholder="Email Address" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <input type="text" value={wizardData.mobile} onChange={(e) => handleWizardChange('mobile', e.target.value)} placeholder="Mobile Number (10 digits)" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
                      </div>
                      {wizardError && <p className="text-red-400 text-sm">{wizardError}</p>}
                      <button onClick={handleWizardNext} className="w-full py-5 mt-4 bg-white text-black font-bold tracking-widest uppercase rounded-[16px] hover:bg-white/90 transition-all duration-300">
                        Submit Project
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* WIZARD STEP 4 (Success) */}
                {step === 4 && (
                  <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" className="w-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-8 border border-green-500/30">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Request Received</h3>
                    <p className="text-white/50 max-w-sm">We'll review your project details and get back to you within 24 hours.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ==========================================
              DIVIDER
              ========================================== */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.08]">
            <div className="glowing-divider absolute top-[20%] -left-[1px] w-[3px] h-[100px] bg-white/20 rounded-full" />
          </div>
          <div className="lg:hidden w-full h-px bg-white/[0.08] relative">
             <div className="glowing-divider absolute left-[20%] -top-[1px] h-[3px] w-[100px] bg-white/20 rounded-full" />
          </div>

          {/* ==========================================
              RIGHT COLUMN: CONTACT NOW (SIMPLE FORM)
              ========================================== */}
          <div className="flex-1 lg:pl-24 relative min-h-[500px]">
            <p className="reveal-elem text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">Quick Query</p>
            <h2 className="reveal-elem text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6">Contact Now</h2>
            <p className="reveal-elem text-white/50 text-lg md:text-xl font-light mb-12 max-w-md">Just have a quick question? Drop us a message here.</p>
            
            <div className="reveal-elem relative w-full">
              <AnimatePresence mode="wait">
                {contactStatus === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center justify-center text-center py-20 bg-white/[0.02] border border-white/10 rounded-[24px]">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-8 border border-green-500/30">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Message Sent</h3>
                    <p className="text-white/50 max-w-sm">We've received your query and will be in touch soon.</p>
                    <button onClick={() => { setContactStatus("idle"); setContactData({ name: "", email: "", query: "" }); }} className="mt-8 text-white/50 hover:text-white underline text-sm">Send another message</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <input type="text" value={contactData.name} onChange={(e) => { setContactError(null); setContactData(p => ({...p, name: e.target.value})) }} placeholder="Your Name" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                        <input type="email" value={contactData.email} onChange={(e) => { setContactError(null); setContactData(p => ({...p, email: e.target.value})) }} placeholder="Email Address" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                      <textarea rows={5} value={contactData.query} onChange={(e) => { setContactError(null); setContactData(p => ({...p, query: e.target.value})) }} placeholder="Your Query..." className="w-full bg-transparent text-white p-4 outline-none resize-none placeholder-white/30" />
                    </div>

                    {contactError && <p className="text-red-400 text-sm">{contactError}</p>}

                    <button type="submit" disabled={contactStatus === "submitting"} className="w-full py-5 mt-4 border border-white/20 bg-white/[0.03] backdrop-blur-xl text-white font-bold tracking-widest uppercase rounded-[16px] hover:bg-white hover:text-black hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      {contactStatus === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
