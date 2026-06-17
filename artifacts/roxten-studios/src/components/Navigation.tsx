import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Partnership Models", href: "#partnership-models" },
  { label: "Start Project", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Adaptive Height Compression on Scroll
  useGSAP(() => {
    if (!headerRef.current || !containerRef.current) return;

    // Height Compression
    ScrollTrigger.create({
      start: "top -100px",
      end: 99999,
      toggleClass: { targets: containerRef.current, className: "scrolled-nav" },
    });
  });

  // 2. Robust Adaptive Color Theme based on active section
  useEffect(() => {
    let ticking = false;

    const checkTheme = () => {
      const sections = document.querySelectorAll("section");
      let currentTheme = "dark";
      const navOffset = 100; // Offset for nav height
      const scrollY = window.scrollY + navOffset;
      
      sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY <= bottom) {
          currentTheme = section.dataset.theme || "dark";
        }
      });
      
      setTheme(currentTheme as "dark" | "light");
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkTheme);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check after a slight delay to allow rendering
    setTimeout(checkTheme, 100);
    setTimeout(checkTheme, 1000); // Check again after async data might have loaded
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isLightText = theme === "dark"; // Dark theme means the section is dark, so text should be white (light)

  return (
    <>
      <style>{`
        .scrolled-nav {
          height: 60px !important;
        }
        .magnetic-link {
          position: relative;
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), letter-spacing 0.3s ease;
        }
        .magnetic-link:hover {
          transform: translateY(-2px);
          letter-spacing: 0.05em;
        }
        .magnetic-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
        }
        .magnetic-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>

      {/* Floating Header */}
      <header 
        ref={headerRef} 
        className="fixed top-6 left-4 right-4 md:left-12 md:right-12 z-[9999] pointer-events-none flex justify-center"
      >
        <div 
          ref={containerRef}
          className={`
            relative w-full max-w-[1200px] h-[80px] px-8 md:px-12 flex items-center justify-between
            rounded-full backdrop-blur-[25px]
            transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto
            ${isLightText 
              ? "text-white bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.03)]" 
              : "text-black bg-black/5 border border-black/10 shadow-[0_0_40px_rgba(0,0,0,0.05)]"}
          `}
        >
          {/* LOGO */}
          <a 
            href="#" 
            onClick={(e) => handleLinkClick(e, "body")}
            className="font-black text-[18px] md:text-[20px] tracking-[-0.04em] uppercase hover:opacity-80 transition-opacity flex items-center gap-1.5"
          >
            ROXTEN <span className="font-medium opacity-60 text-[14px] md:text-[16px] tracking-widest hidden sm:inline-block">STUDIOS</span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="magnetic-link text-sm font-medium tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 z-[10000] relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`w-6 h-px bg-current transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-[1px] bg-white' : '-translate-y-1'}`} />
            <span className={`w-6 h-px bg-current transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-[1px] bg-white' : 'translate-y-1'}`} />
          </button>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9998] bg-[#050505] flex flex-col justify-center items-center px-6"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                  className="text-4xl font-black tracking-[-0.02em] uppercase text-white hover:text-[#00ffcc] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 text-white/30 font-mono text-xs uppercase tracking-widest"
            >
              Roxten Studios © 2026
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
