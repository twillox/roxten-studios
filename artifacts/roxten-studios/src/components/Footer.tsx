import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Top line accent */}
      <div className="h-[2px] bg-white w-full" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <button onClick={() => scrollTo("hero")} className="text-2xl font-black tracking-tighter text-white hover:text-white/50 transition-colors uppercase">
            ROXTEN
          </button>

          <div className="flex flex-wrap gap-7 text-[11px] font-bold tracking-[0.18em] uppercase">
            {[["Services", "services"], ["Work", "work"], ["Process", "process"], ["About", "about"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-white/35 hover:text-white transition-colors duration-300">
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {[["X", "#"], ["LinkedIn", "#"], ["GitHub", "#"]].map(([label, href]) => (
              <motion.a key={label} href={href} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                className="text-[10px] font-mono tracking-widest text-white/25 hover:text-white uppercase transition-colors">
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[10px] font-mono text-white/18">© {year} Roxten Studios. All rights reserved.</p>
          <p className="text-[10px] font-mono text-white/10">Built to define markets.</p>
        </div>
      </div>
    </footer>
  );
}
