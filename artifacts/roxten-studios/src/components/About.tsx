import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const stats = [
  { value: "10+", label: "Projects Delivered", sub: "High-end digital experiences" },
  { value: "28+", label: "Clients Reached", sub: "Across multiple industries" },
  { value: "98%", label: "Client Retention", sub: "They always come back" },
  { value: "2 mon", label: "In Operation", sub: "Scaling rapidly" },
];

function StatBlock({ stat, i }: { stat: typeof stats[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-none text-black">{stat.value}</p>
      <p className="text-xs font-bold text-black/50 mt-2 uppercase tracking-wide">{stat.label}</p>
      <p className="text-[11px] font-mono text-black/25 mt-0.5">{stat.sub}</p>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="about" data-theme="light" ref={sectionRef} className="relative bg-white pt-40 pb-32 px-6 md:px-12 overflow-hidden">
      {/* Ghost background text */}
      <motion.div
        style={{ y: ghostY }}
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <span className="text-[24vw] font-black tracking-tighter leading-none uppercase text-black/[0.025] whitespace-nowrap">
          ROXTEN
        </span>
      </motion.div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 md:gap-28 items-start">
          {/* Left */}
          <motion.div ref={headerRef}>
            <p className="text-[11px] tracking-[0.35em] text-black/35 uppercase mb-6 font-mono">About the Studio</p>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "105%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase leading-tight text-black"
              >
                We Don't Build<br />
                <span className="text-black/25">Websites.</span>
              </motion.h2>
            </div>
            <div className="overflow-hidden mt-1">
              <motion.h2
                initial={{ y: "105%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase leading-tight text-black"
              >
                We Build Digital<br />
                <span className="text-black/25">Businesses.</span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-14 pt-12 border-t-2 border-black/10">
              {stats.map((stat, i) => (
                <StatBlock key={stat.label} stat={stat} i={i} />
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-base md:text-lg leading-relaxed text-black/40 mt-4 md:mt-16"
          >
            <p>
              Roxten Studios is a small, elite team of engineers and designers who have worked on products used by tens of millions of people. We left large companies because we believed great software should be available to ambitious teams of any size.
            </p>
            <p>
              We don't pad teams. We don't assign junior developers to senior problems. Every engagement is led by a principal engineer and a senior designer who have shipped production products at scale.
            </p>
            <p>
              Our obsession is outcomes. Not deliverables. Not feature lists. We measure ourselves by what happens to your business after we ship.
            </p>
            <p className="text-black font-bold text-xl tracking-tight">
              Because our reputation depends on it.
            </p>

            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              whileHover={{ x: 8 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors duration-300 cursor-pointer border-b-2 border-black/15 pb-1.5 mt-4"
            >
              Start a Conversation →
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
