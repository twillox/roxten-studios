import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  // Form State
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  // GSAP Initial Reveal
  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.reveal-elem');
    
    gsap.fromTo(elements, 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );

    gsap.to('.glowing-divider', {
      boxShadow: "0 0 30px 2px rgba(255,255,255,0.2)",
      backgroundColor: "rgba(255,255,255,0.4)",
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setErrorMsg(null);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.query.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (!formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    
    setStatus("submitting");

    try {
      const { db } = await import("@workspace/firebase");
      const { collection, addDoc } = await import("firebase/firestore");
      
      await addDoc(collection(db, "projects"), {
        name: formData.name,
        email: formData.email,
        details: formData.query,
        status: "new",
        createdAt: Date.now()
      });

      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send message.");
      setStatus("error");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="contact" ref={containerRef} className="relative bg-[#000] pt-40 pb-32 md:py-48 min-h-screen z-10 font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      <div className="max-w-[1800px] mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row relative">
          
          {/* ==========================================
              LEFT COLUMN: SIMPLE CONTACT FORM
              ========================================== */}
          <div className="flex-1 md:pr-24 pb-24 md:pb-0 relative min-h-[500px]">
            <p className="reveal-elem text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">Let's Talk</p>
            <h2 className="reveal-elem text-4xl md:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6">Reach Out</h2>
            <p className="reveal-elem text-white/50 text-lg md:text-xl font-light mb-12 max-w-md">Send us a message and we'll get back to you shortly.</p>
            
            <div className="reveal-elem relative w-full">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center justify-center text-center py-20 bg-white/[0.02] border border-white/10 rounded-[24px]">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-8 border border-green-500/30">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Message Sent</h3>
                    <p className="text-white/50 max-w-sm">We've received your query and will be in touch soon.</p>
                    <button onClick={() => { setStatus("idle"); setFormData({ name: "", email: "", query: "" }); }} className="mt-8 text-white/50 hover:text-white underline text-sm">Send another message</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 backdrop-blur-[20px] focus-within:border-white/30 focus-within:bg-white/[0.05] transition-colors">
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Your Name" 
                          className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" 
                        />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 backdrop-blur-[20px] focus-within:border-white/30 focus-within:bg-white/[0.05] transition-colors">
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="Email Address" 
                          className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" 
                        />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 backdrop-blur-[20px] focus-within:border-white/30 focus-within:bg-white/[0.05] transition-colors">
                      <textarea 
                        rows={5} 
                        value={formData.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Your Query..." 
                        className="w-full bg-transparent text-white p-4 outline-none resize-none placeholder-white/30"
                      />
                    </div>

                    {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

                    <button 
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-5 mt-4 bg-white text-black font-bold tracking-widest uppercase rounded-[16px] hover:bg-white/90 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ==========================================
              DIVIDER
              ========================================== */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.08]">
            <div className="glowing-divider absolute top-[20%] -left-[1px] w-[3px] h-[100px] bg-white/20 rounded-full" />
          </div>
          <div className="md:hidden w-full h-px bg-white/[0.08] my-12 relative">
             <div className="glowing-divider absolute left-[20%] -top-[1px] h-[3px] w-[100px] bg-white/20 rounded-full" />
          </div>

          {/* ==========================================
              RIGHT COLUMN: CONTACT DETAILS
              ========================================== */}
          <div className="flex-1 md:pl-24 pt-12 md:pt-0">
            <p className="reveal-elem text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">Contact Details</p>
            <h2 className="reveal-elem text-4xl md:text-6xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-6">Get In Touch</h2>
            <p className="reveal-elem text-white/50 text-lg md:text-xl font-light mb-16 max-w-md">Prefer reaching out directly? We're always available to discuss ideas, partnerships and opportunities.</p>
            
            <div className="reveal-elem mb-12 p-8 bg-white/[0.05] backdrop-blur-[30px] border border-white/10 rounded-[24px] shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white font-mono text-sm tracking-widest uppercase">Currently Accepting Projects</span>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Availability</p>
                  <p className="text-white font-medium">Available</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Response Time</p>
                  <p className="text-white font-medium">Under 24 Hours</p>
                </div>
              </div>
            </div>

            <div className="reveal-elem space-y-4 mb-16">
              {[
                { label: 'Email', value: 'roxtenstudios.help@gmail.com', href: 'mailto:roxtenstudios.help@gmail.com' },
                { label: 'Business', value: 'roxtenstudios.help@gmail.com', href: 'mailto:roxtenstudios.help@gmail.com' },
                { label: 'Location', value: 'India', href: '#' },
              ].map((contact, i) => (
                <a 
                  key={i} 
                  href={contact.href}
                  onClick={(e) => {
                    if (contact.href === '#') e.preventDefault();
                    if (contact.href.startsWith('mailto')) handleCopy(contact.value);
                  }}
                  className="group flex justify-between items-center p-6 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 rounded-[20px] transition-all duration-300"
                >
                  <span className="text-white/50 font-mono text-sm uppercase tracking-widest">{contact.label}</span>
                  <span className="text-white font-medium group-hover:text-[#00ffcc] transition-colors">{contact.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
