import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

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
  }, { scope: containerRef });

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
      const { collection, addDoc, doc, updateDoc, increment } = await import("firebase/firestore");
      const { getStoredReferralCode } = await import("../hooks/useReferralTracking");
      
      const referralCode = getStoredReferralCode();
      const leadData: any = {
        type: "contact",
        name: contactData.name,
        email: contactData.email,
        message: contactData.query,
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

      setContactStatus("success");
    } catch (err: any) {
      setContactError(err.message || "Failed to send message.");
      setContactStatus("error");
    }
  };

  return (
    <section id="contact" ref={containerRef} className="relative bg-[#000] pt-40 pb-32 md:py-48 min-h-[80vh] flex items-center justify-center z-10 font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      <div className="max-w-2xl mx-auto w-full px-6 md:px-12 text-center relative z-10">
        <p className="reveal-elem text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">Quick Query</p>
        <h2 className="reveal-elem text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6">Contact Now</h2>
        <p className="reveal-elem text-white/50 text-lg md:text-xl font-light mb-12 max-w-md mx-auto">Just have a quick question? Drop us a message here.</p>
        
        <div className="reveal-elem relative w-full text-left">
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

                {contactError && <p className="text-red-400 text-sm text-center">{contactError}</p>}

                <button type="submit" disabled={contactStatus === "submitting"} className="w-full py-5 mt-4 border border-white/20 bg-white/[0.03] backdrop-blur-xl text-white font-bold tracking-widest uppercase rounded-[16px] hover:bg-white hover:text-black hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {contactStatus === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
