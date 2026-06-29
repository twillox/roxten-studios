import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import SEO from "../components/SEO";

const formVariants = {
  enter: { opacity: 0, y: 50, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function PartnershipQuery({ params }: { params?: { type: string } }) {
  const [, setLocation] = useLocation();
  const type = params?.type || "unknown";

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const ventureQuestions = [
    { id: "name", title: "What's your full name?", placeholder: "John Doe", type: "text" },
    { id: "email", title: "What's your email address?", placeholder: "john@example.com", type: "email" },
    { id: "mobile", title: "What's your mobile number?", placeholder: "e.g. 9876543210", type: "tel" },
    { id: "category", title: "What industry or category is your startup in?", placeholder: "e.g. FinTech, AI, SaaS", type: "text" },
    { id: "expectations", title: "What is your current stage and what do you expect from us?", placeholder: "e.g. Pre-revenue, looking for MVP development...", type: "textarea", note: "Please do NOT share your proprietary idea." },
    { id: "goals", title: "What are your high-level goals for the next 6 months?", placeholder: "e.g. Launch MVP, get 100 users", type: "text" }
  ];

  const standardQuestions = [
    { id: "name", title: "What's your full name?", placeholder: "John Doe", type: "text" },
    { id: "email", title: "What's your email address?", placeholder: "john@example.com", type: "email" },
    { id: "mobile", title: "What's your mobile number?", placeholder: "e.g. 9876543210", type: "tel" },
    { id: "query", title: "How can we partner together?", placeholder: "Briefly describe what you're looking for...", type: "textarea" }
  ];

  const questions = type === "venture" ? ventureQuestions : standardQuestions;

  useEffect(() => {
    if (!["venture", "agency", "growth"].includes(type)) {
      setLocation("/");
    }
  }, [type, setLocation]);

  if (!["venture", "agency", "growth"].includes(type)) return null;

  const handleNext = async () => {
    const currentQ = questions[step];
    const val = formData[currentQ.id]?.trim() || "";

    if (!val) {
      setErrorMsg("Please provide an answer to continue.");
      return;
    }

    if (currentQ.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setErrorMsg("Please enter a valid email address (e.g. name@domain.com).");
        return;
      }
    }

    if (currentQ.type === "tel") {
      const digits = val.replace(/\D/g, "");
      if (digits.length < 10) {
        setErrorMsg("Please enter a valid mobile number with at least 10 digits.");
        return;
      }
    }

    setErrorMsg("");

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitStatus("submitting");
      try {
        const { db } = await import("@workspace/firebase");
        const { collection, addDoc, doc, updateDoc, increment } = await import("firebase/firestore");
        const { getStoredReferralCode } = await import("../hooks/useReferralTracking");
        const referralCode = getStoredReferralCode();

        const leadData: any = {
          type: "partnership",
          model: type,
          ...formData,
          status: "new",
          createdAt: Date.now()
        };

        if (referralCode) {
          leadData.referralCode = referralCode;
        }

        await addDoc(collection(db, "leads"), leadData);

        if (referralCode) {
          try {
            const docRef = doc(db, "referrals", referralCode);
            await updateDoc(docRef, { leads: increment(1) });
          } catch (e) {
            console.error("Failed to update referral leads count", e);
          }
        }
        
        setSubmitStatus("success");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to submit. Please try again.");
        setSubmitStatus("error");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="w-24 h-24 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] mb-6">Your query is in our orbit.</h1>
          <p className="text-xl text-white/50 max-w-lg mx-auto mb-12">
            {type === "venture" 
              ? "Our venture team will review your details and reach out shortly regarding next steps."
              : "Our partnership team will review your query and reach out shortly."}
          </p>
          <button onClick={() => setLocation("/")} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[step];

  let seoTitle = "Partner With Roxten Studios";
  let seoDesc = "Become a Roxten Studios partner.";

  if (type === "agency") {
    seoTitle = "White Label Program | Agency Development Partner | Roxten";
    seoDesc = "Join our White Label Program. Roxten Studios serves as your invisible, dedicated development team, delivering premium websites and software under your brand.";
  } else if (type === "venture") {
    seoTitle = "Strategic Growth Program | Startup Incubation | Roxten";
    seoDesc = "Our Strategic Growth Program partners with visionaries. We provide technical execution, UI/UX, and development for startups in exchange for equity or profit sharing.";
  } else if (type === "growth") {
    seoTitle = "Technology Partner Program | Revenue Share | Roxten";
    seoDesc = "Scale with our Technology Partner Program. Offset upfront costs through a mutually beneficial revenue-share and long-term development collaboration.";
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://roxtenstudios.in/" },
      { "@type": "ListItem", "position": 2, "name": "Partnership Models", "item": `https://roxtenstudios.in/#partnership-models` },
      { "@type": "ListItem", "position": 3, "name": seoTitle.split(' |')[0], "item": `https://roxtenstudios.in/partnership/${type}` }
    ]
  };

  return (
    <>
    <SEO 
      title={seoTitle} 
      description={seoDesc} 
      canonicalUrl={`https://roxtenstudios.in/partnership/${type}`}
      schema={breadcrumbSchema} 
    />
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Progress */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-20">
        <button onClick={() => setLocation("/")} className="text-white/40 hover:text-white transition-colors font-mono uppercase tracking-widest text-xs flex items-center gap-2">
          <span>←</span> Cancel
        </button>
        <div className="text-white/40 font-mono tracking-widest text-xs">
          0{step + 1} / 0{questions.length}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-12 relative z-10 w-full max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            variants={formVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {(currentQ as any).note && (
              <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl inline-block backdrop-blur-md">
                <p className="text-sm text-purple-200/80 font-medium">
                  <span className="text-purple-400 font-bold">Important:</span> {(currentQ as any).note}
                </p>
              </div>
            )}
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-10 md:mb-14 leading-tight text-white/90">
              {currentQ.title}
            </h2>
            
            <div className="relative">
              {currentQ.type === "textarea" ? (
                <textarea
                  autoFocus
                  value={formData[currentQ.id] || ""}
                  onChange={(e) => setFormData({ ...formData, [currentQ.id]: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder={currentQ.placeholder}
                  className="w-full bg-transparent text-xl md:text-3xl outline-none placeholder-white/20 border-b-2 border-white/10 focus:border-white pb-4 transition-colors resize-none min-h-[140px]"
                />
              ) : (
                <input
                  autoFocus
                  type={currentQ.type}
                  value={formData[currentQ.id] || ""}
                  onChange={(e) => setFormData({ ...formData, [currentQ.id]: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder={currentQ.placeholder}
                  className="w-full bg-transparent text-2xl md:text-4xl outline-none placeholder-white/20 border-b-2 border-white/10 focus:border-white pb-4 transition-colors"
                />
              )}
            </div>

            {errorMsg && <p className="text-red-400 mt-6 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-lg inline-block border border-red-500/20">{errorMsg}</p>}

            <div className="mt-12 flex items-center gap-6">
              <button
                onClick={handleNext}
                disabled={submitStatus === "submitting"}
                className="px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-white/90 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {submitStatus === "submitting" ? "Submitting..." : step === questions.length - 1 ? "Submit Query" : "Next →"}
              </button>
              <span className="text-white/30 text-xs tracking-widest font-mono uppercase hidden md:inline-block">
                Press Enter ↵
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
        <motion.div 
          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          initial={{ width: `${(step / questions.length) * 100}%` }}
          animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
    </>
  );
}
