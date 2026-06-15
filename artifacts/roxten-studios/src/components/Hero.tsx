import { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4";

function SplitReveal({ text, delay = 0, dim = false }: { text: string; delay?: number; dim?: boolean }) {
  return (
    <span className="inline-flex" aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 0.92 }}>
          <motion.span
            className="inline-block"
            style={{ color: dim ? "rgba(255,255,255,0.22)" : "#fff" }}
            initial={{ y: "108%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.05, delay: delay + i * 0.036, ease: [0.16, 1, 0.3, 1] }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 800], ["0%", "20%"]);
  const contentY = useTransform(scrollY, [0, 700], [0, 160]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black flex flex-col">
      {/* Image background */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-[-10%] pointer-events-none"
      >
        <img
          src="https://i.ibb.co/LDdgnTzM/Chat-GPT-Image-Jun-15-2026-05-06-54-PM.png"
          alt="Homepage Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* Layered overlays (reduced for visibility) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1] pointer-events-none" />


      {/* Main content — bottom anchored */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-end pb-8 md:pb-12 px-6 md:px-12 max-w-[1700px] mx-auto w-full"
      >
        {/* Metadata Strip (Moved from top) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.4 }}
          className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8"
        >
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase">Est. 2026</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 md:w-16 h-px bg-white/25 origin-left"
          />
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase">Digital Product Studio</span>
        </motion.div>

        <div className="text-[clamp(2.6rem,7.2vw,8.5rem)] leading-[0.9] font-black tracking-[-0.025em] uppercase select-none mb-7">
          <div><SplitReveal text="BUILDING" delay={0.15} /></div>
          <div><SplitReveal text="THE FUTURE" delay={0.48} dim /></div>
          <div><SplitReveal text="OF DIGITAL" delay={0.82} /></div>
          <div><SplitReveal text="PRODUCTS" delay={1.16} dim /></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/15 pt-7"
        >
          <p className="text-white/45 text-sm md:text-base max-w-xs leading-relaxed">
            An elite studio building the software companies run on.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              data-testid="button-start-project"
              className="px-7 py-3.5 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-white/85 transition-colors duration-300"
            >
              Start a Project
            </a>
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}
              data-testid="button-view-work"
              className="text-sm font-medium uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-300"
            >
              See Work ↓
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom-left corner label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute right-8 bottom-14 z-10 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-mono tracking-[0.4em] text-white/25 uppercase" style={{ writingMode: "vertical-rl" }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}
