import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLocation } from "wouter";

export default function Referral() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [, setLocation] = useLocation();

  return (
    <section 
      id="referral" 
      data-theme="dark" 
      className="py-24 md:py-32 bg-[#050505] text-white relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ffcc]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/[0.02] border border-white/10 rounded-[32px] p-10 md:p-16 lg:p-20 backdrop-blur-md relative overflow-hidden group"
        >
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffcc]/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <p className="text-[11px] tracking-[0.35em] text-[#00ffcc]/80 uppercase mb-6 font-mono font-bold">
            Partner Program
          </p>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] mb-6">
            Refer & <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00ffcc]">Earn</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Know a business that needs a world-class digital product? Connect us and earn a generous percentage for every successful partnership.
          </p>
          
          <button 
            onClick={() => setLocation("/referral")} 
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-[#00ffcc] hover:text-black transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,255,204,0.1)] hover:shadow-[0_0_40px_rgba(0,255,204,0.3)]"
          >
            Start Earning Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
