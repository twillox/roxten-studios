import { motion } from "framer-motion";
import { Link } from "wouter";

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

        {/* SEO Internal Links */}
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.06] pt-8 text-[11px] font-medium tracking-wide text-white/40">
          <Link href="/white-label-web-development"><a className="hover:text-white transition-colors">White Label Web Development</a></Link>
          <Link href="/agency-development-partner"><a className="hover:text-white transition-colors">Agency Development Partner</a></Link>
          <Link href="/website-development-for-marketing-agencies"><a className="hover:text-white transition-colors">Web Development for Marketing Agencies</a></Link>
          <Link href="/ai-automation-for-agencies"><a className="hover:text-white transition-colors">AI Automation for Agencies</a></Link>
          <Link href="/blog"><a className="hover:text-white transition-colors">Agency Growth Blog</a></Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[10px] font-mono text-white/30">© {year} Roxten Studios. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-[10px] font-mono text-white/30">
            <span>Email: roxtenstudios.help@gmail.com</span>
            <span>Based in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
