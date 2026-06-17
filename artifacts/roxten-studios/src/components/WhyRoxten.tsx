import { useRef, useState, useEffect } from "react";
import { motion, PanInfo, useInView } from "framer-motion";

const features = [
  { index: "01", title: "Faster Delivery", desc: "AI-augmented workflows mean we ship 2–3× faster than traditional agencies — without sacrificing quality." },
  { index: "02", title: "Premium Design", desc: "Our design team has shipped products used by millions. Originals only — never templates." },
  { index: "03", title: "Scalable Architecture", desc: "Every system designed for the 10 million users you'll have, not the 1,000 you have today." },
  { index: "04", title: "Dedicated Support", desc: "A named team member. A direct line. Real responsiveness — not a ticketing system." },
  { index: "05", title: "AI-Powered", desc: "AI integrated at every layer as an engineering force multiplier, not a gimmick." },
  { index: "06", title: "Enterprise Security", desc: "SOC 2 patterns. Zero-trust architecture. Bank-level data care." },
];

export default function WhyRoxten() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, [isDragging]);

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50; // minimum drag distance
    if (info.offset.x < -threshold) {
      // Swiped left -> next card
      setActiveIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold) {
      // Swiped right -> prev card
      setActiveIndex((prev) => prev - 1);
    }
  };

  const variants = {
    center: {
      x: "0%",
      scale: 1,
      zIndex: 10,
      opacity: 1,
      filter: "blur(0px)",
    },
    left: {
      x: "-65%",
      scale: 0.85,
      zIndex: 5,
      opacity: 0.35,
      filter: "blur(2px)",
    },
    right: {
      x: "65%",
      scale: 0.85,
      zIndex: 5,
      opacity: 0.35,
      filter: "blur(2px)",
    },
    hiddenLeft: {
      x: "-130%",
      scale: 0.6,
      zIndex: 0,
      opacity: 0,
      filter: "blur(4px)",
    },
    hiddenRight: {
      x: "130%",
      scale: 0.6,
      zIndex: 0,
      opacity: 0,
      filter: "blur(4px)",
    }
  };

  return (
    <section id="why" data-theme="light" className="bg-white pt-40 pb-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-24 relative z-20">
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
            Six reasons clients choose us and never leave. Drag to explore.
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative w-full max-w-[320px] md:max-w-md mx-auto h-[450px] md:h-[400px] flex items-center justify-center">
          {features.map((feature, i) => {
            // Calculate circular offset
            let offset = ((i - activeIndex) % features.length + features.length) % features.length;
            if (offset > features.length / 2) {
              offset -= features.length;
            }

            let position = "hiddenRight";
            if (offset === 0) position = "center";
            else if (offset === -1) position = "left";
            else if (offset === 1) position = "right";
            else if (offset < -1) position = "hiddenLeft";
            else if (offset > 1) position = "hiddenRight";

            return (
              <motion.div
                key={feature.index}
                initial={false}
                animate={position}
                variants={variants}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={`
                  absolute w-full h-full bg-white border border-black/10 p-8 md:p-10 shadow-xl 
                  flex flex-col justify-between
                  cursor-grab active:cursor-grabbing select-none
                `}
                style={{
                  boxShadow: position === "center" ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 10px rgba(0,0,0,0.02)"
                }}
              >
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-[10px] font-mono tracking-widest text-black/20">{feature.index}</span>
                    <span className="text-black/20 text-xl leading-none font-light">+</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] uppercase mb-4 leading-tight text-black">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-black/60 font-medium">
                    {feature.desc}
                  </p>
                </div>
                
                <div className="w-full h-1 bg-black/5 mt-8 overflow-hidden">
                  <motion.div 
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: position === "center" ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full bg-black/20"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile helper text */}
        <p className="text-center text-black/30 text-[10px] uppercase tracking-widest font-mono mt-12 md:hidden">
          ← Swipe to explore →
        </p>
      </div>
    </section>
  );
}
