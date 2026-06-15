import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const track1 = [
  { name: "OpenAI", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.0192 19.82a5.9847 5.9847 0 0 0 3.9977-2.9 6.0462 6.0462 0 0 0-.735-7.0988zm-9.022 12.108a4.365 4.365 0 0 1-2.714-.932 4.38 4.38 0 0 1-1.654-2.818l-.133-.85h7.327a1.69 1.69 0 0 0 1.69-1.69V8.625l1.018.587a4.346 4.346 0 0 1 2.167 3.754 4.366 4.366 0 0 1-2.182 3.78l-5.519 3.186zM4.152 16.74A4.365 4.365 0 0 1 2.76 13.91a4.38 4.38 0 0 1 .455-3.235l.435-.745 3.663 6.345a1.69 1.69 0 0 0 1.464.845h2.036l-.509.882a4.346 4.346 0 0 1-3.253 2.152 4.366 4.366 0 0 1-3.856-1.42l-.043-.046v.052zM4.646 7.42A4.365 4.365 0 0 1 7.36 6.488a4.38 4.38 0 0 1 3.208 1.16l.654.557-3.663 6.345a1.69 1.69 0 0 0-.226 1.674l-1.018 1.764a4.346 4.346 0 0 1-4.335-.015 4.366 4.366 0 0 1-2.182-3.78l-.043-6.38zM19.848 7.26A4.365 4.365 0 0 1 21.24 10.09a4.38 4.38 0 0 1-.455 3.235l-.435.745-3.663-6.345a1.69 1.69 0 0 0-1.464-.845h-2.036l.509-.882A4.346 4.346 0 0 1 16.95 3.846a4.366 4.366 0 0 1 3.856 1.42l.043.046v-.052zM19.354 16.58A4.365 4.365 0 0 1 16.64 17.512a4.38 4.38 0 0 1-3.208-1.16l-.654-.557 3.663-6.345a1.69 1.69 0 0 0 .226-1.674l1.018-1.764a4.346 4.346 0 0 1 4.335.015 4.366 4.366 0 0 1 2.182 3.78l.043 6.38zM10.741 2.07A4.365 4.365 0 0 1 13.455 3.002a4.38 4.38 0 0 1 1.654 2.818l.133.85H7.915A1.69 1.69 0 0 0 6.225 8.36v7.014l-1.018-.587a4.346 4.346 0 0 1-2.167-3.754 4.366 4.366 0 0 1 2.182-3.78l5.519-3.186zM12 14.88a2.88 2.88 0 1 1 0-5.76 2.88 2.88 0 0 1 0 5.76z"/></svg> },
  { name: "Anthropic", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M18.8 2l-6.8 11.8L12 13.8V22h-2v-8.2l-.2-.3L3 2h2.3l5.7 9.8L16.5 2h2.3z"/></svg> },
  { name: "Google Cloud", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M19.4 12.2c0-.5-.1-1-.2-1.5H12v2.8h4.2c-.2 1-.7 1.8-1.5 2.4v2h2.4c1.4-1.3 2.3-3.2 2.3-5.7z" fill="#4285F4"/><path d="M12 19.8c2.1 0 3.8-.7 5.1-1.9l-2.4-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H5v2C6.3 18.2 8.9 19.8 12 19.8z" fill="#34A853"/><path d="M7.5 13.4c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9v-2H5C4.3 8.9 4 10.4 4 11.5s.3 2.6.9 3.8l2.6-1.9z" fill="#FBBC05"/><path d="M12 4.2c1.1 0 2.1.4 2.9 1.1l2.2-2.2C15.8 1.8 14 1 12 1 8.9 1 6.3 2.6 5 5l2.6 1.9c.7-1.9 2.4-3.3 4.4-3.3z" fill="#EA4335"/></svg> },
  { name: "AWS", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M14.54 12.92l-1.3-3.83-1.19 3.83h2.49zm4.23-6.66l-2.83 8.35h-1.63l-1.63-4.88-1.6 4.88H9.41l-2.75-8.35h1.72l1.62 5.56 1.58-4.85h1.66l1.64 4.88 1.65-5.59h1.74zM3 17.51c1.39 1.48 3.55 2.4 5.92 2.4 2.5 0 4.67-.98 6.01-2.52l-.99-1.02c-1.12 1.34-3 2.16-5.02 2.16-2.02 0-3.84-.74-5.11-1.93L3 17.51z"/></svg> },
  { name: "Azure", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M6.39 4.37L10.3 11 2.3 21.8h3.35L15 6.64l-4.14-5.83H6.39zM16.48 7.9L12.55 14l7.65 7.82h-3.3L9.67 12 14.15 6z" fill="#0078D4"/></svg> },
  { name: "Docker", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M2.5 12h-1C1.2 12 1 12.2 1 12.5v2C1 14.8 1.2 15 1.5 15h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zM5 12H4c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zM7.5 9h-1C6.2 9 6 9.2 6 9.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zM10 6H9c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zm2.5 0h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5h1c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5zM22.9 11.2c-.4-1.2-1.7-1.8-2.9-1.4l-.1.1v-1l-.4-.4h-1.9l-.4.4v2.7H17v4.1c0 1.2-1.1 2.2-2.3 2.2H2.3C1 17.9 0 16.9 0 15.6V15c0-1.2 1-2.2 2.3-2.2H17v1.8c.8.2 1.6-.2 1.9-.9l3.3-1c.7-.2 1-1 .7-1.5z"/></svg> },
  { name: "Kubernetes", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2L2 7.7v8.5L12 22l10-5.8V7.7L12 2zm0 18.2l-8.5-4.9v-7L12 3.4l8.5 4.9v7l-8.5 4.9z"/></svg> },
  { name: "PostgreSQL", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "MongoDB", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "Node.js", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18l-8-4V8l8-4 8 4v8l-8 4z"/></svg> },
];

const track2 = [
  { name: "React", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 110-16 8 8 0 010 16z"/></svg> },
  { name: "Next.js", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "TypeScript", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18l-8-4V8l8-4 8 4v8l-8 4z"/></svg> },
  { name: "Python", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "GitHub", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "Figma", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "Vercel", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2L2 22h20L12 2z"/></svg> },
  { name: "Supabase", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><circle cx="12" cy="12" r="10"/></svg> },
  { name: "Stripe", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> },
  { name: "Cloudflare", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/></svg> },
];

function LogoCard({ item }: { item: typeof track1[0] }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-4 md:gap-6 px-8 md:px-12 py-5 md:py-7 h-[80px] md:h-[110px] bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl group hover:scale-[1.03] hover:border-white/[0.2] hover:bg-white/[0.05] transition-all duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] cursor-default">
      <div className="text-white/40 group-hover:text-white transition-colors duration-500">
        {item.icon}
      </div>
      <span className="text-white text-xl md:text-3xl font-bold tracking-tight opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        {item.name}
      </span>
    </div>
  );
}

export default function Technology() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section id="tech" className="relative bg-[#050505] pt-40 pb-32 md:py-48 overflow-hidden z-10">
      
      {/* CSS Keyframes injected here for ease */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(calc(-50% - 1.5rem)); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto w-[92vw]">
        
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 md:mb-36 max-w-4xl"
        >
          <p className="text-[11px] tracking-[0.35em] text-white/30 uppercase mb-8 font-mono">
            Our Expertise
          </p>
          <h2 className="text-[clamp(4.5rem,12vw,10rem)] font-black tracking-[-0.04em] uppercase leading-[0.85] text-white mb-8">
            Stack
          </h2>
          <p className="text-white/50 text-xl md:text-3xl leading-relaxed font-light max-w-2xl">
            We build products using industry-leading technologies, frameworks, cloud platforms and AI systems.
          </p>
        </motion.div>

        {/* Marquee Tracks Container */}
        <div className="flex flex-col gap-6 md:gap-10 mask-gradient pb-10">
          
          {/* Track 1 - Moving Left */}
          <div className="flex gap-6 w-max animate-scroll-left">
            {/* Original Array */}
            {track1.map((item, i) => (
              <LogoCard key={`t1-a-${i}`} item={item} />
            ))}
            {/* Duplicated Array for seamless loop */}
            {track1.map((item, i) => (
              <LogoCard key={`t1-b-${i}`} item={item} />
            ))}
          </div>

          {/* Track 2 - Moving Right */}
          <div className="flex gap-6 w-max animate-scroll-right">
            {/* Original Array */}
            {track2.map((item, i) => (
              <LogoCard key={`t2-a-${i}`} item={item} />
            ))}
            {/* Duplicated Array for seamless loop */}
            {track2.map((item, i) => (
              <LogoCard key={`t2-b-${i}`} item={item} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
