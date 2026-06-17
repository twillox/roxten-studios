import { motion } from "framer-motion";

interface SEOHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export default function SEOHero({ title, subtitle, badge }: SEOHeroProps) {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 w-full overflow-hidden flex flex-col items-center text-center bg-[#050505]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {badge && (
          <div className="mb-6 inline-block">
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono uppercase tracking-widest text-white/60">
              {badge}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-balance">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
