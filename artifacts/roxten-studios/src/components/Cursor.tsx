import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 120, damping: 18, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 18, mass: 0.5 });

  const isHovering = useRef(false);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const enter = () => {
      isHovering.current = true;
      if (scaleRef.current) scaleRef.current.style.transform = "translate(-50%,-50%) scale(2.5)";
    };
    const leave = () => {
      isHovering.current = false;
      if (scaleRef.current) scaleRef.current.style.transform = "translate(-50%,-50%) scale(1)";
    };

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    const obs = new MutationObserver(() => {
      document.querySelectorAll("a,button,[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Ring — lagged */}
      <motion.div
        ref={scaleRef}
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="hidden md:block fixed pointer-events-none z-[99998] w-10 h-10 rounded-full border border-white mix-blend-difference transition-transform duration-300"
      />
      {/* Dot — instant */}
      <motion.div
        style={{
          left: dotX,
          top: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="hidden md:block fixed pointer-events-none z-[99999] w-1.5 h-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
