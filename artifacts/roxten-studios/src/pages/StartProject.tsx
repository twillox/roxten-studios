import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import SEO from "../components/SEO";

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

export default function StartProject() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState({
    projectType: "", budget: "", customBudget: "", timeline: "", customTimeline: "", description: "", name: "", email: "", mobile: "",
  });

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
      if (wizardData.budget === "custom" && !wizardData.customBudget.trim()) {
        setWizardError("Please enter your custom budget.");
        return;
      }
      if (wizardData.timeline === "custom" && !wizardData.customTimeline.trim()) {
        setWizardError("Please enter your custom timeline.");
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
      
      if (sessionStorage.getItem(`submitted_lead_${wizardData.email}`)) {
        setWizardError("You have already submitted a request. We will get back to you soon!");
        return;
      }
      
      try {
        const { db } = await import("@workspace/firebase");
        const { collection, addDoc, doc, updateDoc, increment } = await import("firebase/firestore");
        const { getStoredReferralCode } = await import("../hooks/useReferralTracking");
        
        const finalBudget = wizardData.budget === "custom" ? wizardData.customBudget : wizardData.budget;
        const finalTimeline = wizardData.timeline === "custom" ? wizardData.customTimeline : wizardData.timeline;
        const referralCode = getStoredReferralCode();

        const leadData: any = {
          name: wizardData.name,
          email: wizardData.email,
          phone: wizardData.mobile,
          projectType: wizardData.projectType,
          budget: finalBudget,
          timeline: finalTimeline,
          details: wizardData.description + `\n\nTimeline: ${finalTimeline}\nType: ${wizardData.projectType}\nMobile: ${wizardData.mobile}`,
          status: "new",
          createdAt: Date.now()
        };

        if (referralCode) {
          leadData.referralCode = referralCode;
          leadData.referred = true;
        }

        const projectDocRef = await addDoc(collection(db, "projects"), leadData);

        if (referralCode) {
          try {
            // We just record the submission in a referral_leads collection for admin to process
            // (or admin can just use the referralCode on the project document directly).
            // We will just keep it simple and rely on the referralCode field added to the project.
            // If the portal expects a document in 'referrals' collection, we should add it there:
            const leadDataRef = {
              leadId: projectDocRef.id,
              referralCode: referralCode,
              clientName: wizardData.name,
              email: wizardData.email,
              phone: wizardData.mobile,
              projectType: wizardData.projectType,
              budget: finalBudget,
              status: "Pending",
              createdAt: new Date().toISOString(),
            };
            // Note: Since users cannot query partners directly, the admin will need to link the partnerId 
            // when they process the lead. Or a Firebase Cloud Function would do this securely.
            // For now, we save it to 'referrals' so it exists in the system.
            await addDoc(collection(db, "referrals"), leadDataRef);
          } catch (e) {
            console.error("Failed to update referral portal", e);
          }
        }

        sessionStorage.setItem(`submitted_lead_${wizardData.email}`, "true");
        setStep(4);
      } catch (err: any) {
        setWizardError(err.message || "Failed to submit request.");
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: 30, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <>
      <SEO title="Start a Project | Roxten Studios" description="Tell us what you're building and we'll help bring it to life." />
      <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden pt-20 pb-20">
        <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-20">
          <button onClick={() => setLocation("/")} className="text-white/40 hover:text-white transition-colors font-mono uppercase tracking-widest text-xs flex items-center gap-2">
            <span>←</span> Cancel
          </button>
          <div className="text-white/40 font-mono tracking-widest text-xs">
            0{step} / 04
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 relative z-10 w-full max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6 text-center">Start a Project</h1>
          <p className="text-white/50 text-lg md:text-xl font-light mb-12 max-w-md text-center">Tell us what you're building and we'll help bring it to life.</p>
          
          <div className="relative w-full max-w-2xl mx-auto">
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
                      {/* BUDGET DROPDOWN */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors flex flex-col">
                        <select value={wizardData.budget} onChange={(e) => handleWizardChange('budget', e.target.value)} className={`w-full bg-transparent p-4 outline-none cursor-pointer ${wizardData.budget ? 'text-white' : 'text-white/30'}`}>
                          <option value="" disabled>Select Budget (INR)</option>
                          <option value="<50k" className="bg-black text-white">Under ₹50,000</option>
                          <option value="50k-2L" className="bg-black text-white">₹50,000 - ₹2,00,000</option>
                          <option value="2L-5L" className="bg-black text-white">₹2,00,000 - ₹5,00,000</option>
                          <option value="5L-10L" className="bg-black text-white">₹5,00,000 - ₹10,00,000</option>
                          <option value="10L+" className="bg-black text-white">₹10,00,000+</option>
                          <option value="custom" className="bg-black text-white">Other (Custom)</option>
                        </select>
                        {wizardData.budget === "custom" && (
                          <input 
                            type="text" 
                            value={wizardData.customBudget} 
                            onChange={(e) => handleWizardChange('customBudget', e.target.value)} 
                            placeholder="Type your budget..." 
                            className="w-full bg-transparent text-white px-4 pb-2 pt-2 border-t border-white/10 outline-none placeholder-white/30 text-sm mt-2" 
                          />
                        )}
                      </div>

                      {/* TIMELINE DROPDOWN */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors flex flex-col">
                        <select value={wizardData.timeline} onChange={(e) => handleWizardChange('timeline', e.target.value)} className={`w-full bg-transparent p-4 outline-none cursor-pointer ${wizardData.timeline ? 'text-white' : 'text-white/30'}`}>
                          <option value="" disabled>Select Timeline</option>
                          <option value="1m" className="bg-black text-white">1-2 Months</option>
                          <option value="3m" className="bg-black text-white">3-6 Months</option>
                          <option value="6m" className="bg-black text-white">6+ Months</option>
                          <option value="custom" className="bg-black text-white">Other (Custom)</option>
                        </select>
                        {wizardData.timeline === "custom" && (
                          <input 
                            type="text" 
                            value={wizardData.customTimeline} 
                            onChange={(e) => handleWizardChange('customTimeline', e.target.value)} 
                            placeholder="Type your timeline..." 
                            className="w-full bg-transparent text-white px-4 pb-2 pt-2 border-t border-white/10 outline-none placeholder-white/30 text-sm mt-2" 
                          />
                        )}
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
                  <p className="text-white/50 max-w-sm mb-8">We'll review your project details and get back to you within 24 hours.</p>
                  <button onClick={() => setLocation("/")} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    Return Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
