import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Unmount the component entirely after the animation finishes
    const timer = setTimeout(() => setIsVisible(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const slices = 60;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none flex" style={{ perspective: "2000px" }}>
      {/* 3D Flipping Vertical Slices */}
      {Array.from({ length: slices }).map((_, i) => (
        <motion.div
          key={i}
          className="h-full bg-[#050505]"
          style={{ 
            width: `${100 / slices}%`,
            transformOrigin: "center",
            backfaceVisibility: "hidden"
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -180 }}
          transition={{ 
            duration: 1.2, 
            delay: 2.2 + (i * 0.015), 
            ease: [0.64, 0.04, 0.35, 1] 
          }}
        />
      ))}

      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ 
              duration: 2.0, 
              times: [0, 0.4, 0.8, 1], 
              ease: [0.76, 0, 0.24, 1]
            }}
            className="text-white text-5xl md:text-7xl font-black tracking-[-0.04em] uppercase"
          >
            ROXTEN <span className="text-white/40">STUDIOS</span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
