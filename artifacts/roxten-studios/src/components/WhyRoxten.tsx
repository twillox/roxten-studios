import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  { index: "01", title: "Faster Delivery", desc: "AI-augmented workflows mean we ship 2–3× faster than traditional agencies — without sacrificing quality." },
  { index: "02", title: "Premium Design", desc: "Our design team has shipped products used by millions. Originals only — never templates." },
  { index: "03", title: "Scalable Architecture", desc: "Every system designed for the 10 million users you'll have, not the 1,000 you have today." },
  { index: "04", title: "Dedicated Support", desc: "A named team member. A direct line. Real responsiveness — not a ticketing system." },
  { index: "05", title: "AI-Powered", desc: "AI integrated at every layer as an engineering force multiplier, not a gimmick." },
  { index: "06", title: "Enterprise Security", desc: "SOC 2 patterns. Zero-trust architecture. Bank-level data care." },
];

function FeatureCard({ feature, i }: { feature: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-8 md:p-10 border border-black/10 hover:border-black/30 overflow-hidden cursor-default bg-white transition-colors duration-400"
      style={{ boxShadow: hovered ? "0 4px 24px rgba(0,0,0,0.07)" : "none", transition: "box-shadow 0.4s" }}
    >
      <div className="flex items-start justify-between mb-7">
        <span className="text-[10px] font-mono tracking-widest text-black/20">{feature.index}</span>
        <motion.span
          animate={{ rotate: hovered ? 45 : 0, opacity: hovered ? 1 : 0.25 }}
          transition={{ duration: 0.35 }}
          className="text-black/40 text-base leading-none"
        >
          +
        </motion.span>
      </div>

      <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] uppercase mb-3 leading-tight text-black">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: hovered ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.38)" }}>
        {feature.desc}
      </p>

      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 h-0.5 bg-black/20 w-full origin-left"
      />
    </motion.div>
  );
}

export default function WhyRoxten() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section id="why" data-theme="light" className="bg-white pt-40 pb-32 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] tracking-[0.35em] text-black/35 uppercase mb-4 font-mono">The Difference</p>
            <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-black tracking-[-0.03em] uppercase leading-none text-black">
              Why Roxten
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-black/30 text-[11px] font-mono max-w-[200px] text-right leading-relaxed hidden md:block"
          >
            Six reasons clients choose us and never leave
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.index} feature={feature} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
