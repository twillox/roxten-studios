import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  { index: "01", name: "Websites", desc: "Cinematic digital experiences that convert visitors into believers." },
  { index: "02", name: "Mobile Apps", desc: "Native iOS and Android applications built for scale and delight." },
  { index: "03", name: "SaaS Platforms", desc: "Enterprise-grade software that powers entire industries." },
  { index: "04", name: "AI Products", desc: "Intelligent systems that think, learn, and evolve with your business." },
  { index: "05", name: "Branding & Design", desc: "Visual identities that define market categories, not just companies." },
  { index: "06", name: "Business Automation", desc: "Eliminate friction. Automate operations. Focus on what matters." },
  { index: "07", name: "Enterprise Solutions", desc: "Mission-critical software engineered for the Fortune 500." },
];

function ServiceRow({ service, i }: { service: typeof services[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border-b border-black/10 overflow-hidden cursor-default group"
    >
      {/* Black flood fill on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-black origin-left pointer-events-none z-0"
      />

      <div className="relative z-10 flex items-center gap-6 md:gap-12 py-7 md:py-9">
        <span
          className="text-[11px] font-mono tracking-widest min-w-[2.5rem] transition-colors duration-300"
          style={{ color: hovered ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
        >
          {service.index}
        </span>

        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-10">
          <motion.h3
            animate={{ x: hovered ? 14 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-[clamp(2.5rem,5vw,5rem)] font-black tracking-[-0.03em] uppercase leading-none transition-colors duration-300"
            style={{ color: hovered ? "#fff" : "#000" }}
          >
            {service.name}
          </motion.h3>
          <p
            className="text-sm max-w-[280px] leading-relaxed transition-colors duration-300"
            style={{ color: hovered ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)" }}
          >
            {service.desc}
          </p>
        </div>

        <motion.span
          animate={{ x: hovered ? 0 : -10, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="text-white text-xl pr-2 hidden md:block"
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="services" data-theme="light" className="bg-white pt-40 pb-32 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] tracking-[0.35em] text-black/35 uppercase mb-4 font-mono">What We Build</p>
            <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-black tracking-[-0.03em] uppercase leading-none text-black">
              Services
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-black/30 text-[11px] font-mono max-w-[180px] text-right hidden md:block"
          >
            Hover each row to explore
          </motion.p>
        </div>

        <div className="border-t-2 border-black/10">
          {services.map((service, i) => (
            <ServiceRow key={service.index} service={service} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
