import { Link } from "wouter";

export default function SEOCTA() {
  return (
    <section className="relative py-32 px-6 md:px-12 w-full bg-[#080808] border-t border-white/5 flex flex-col items-center text-center">
      <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent mx-auto mb-10" />
      <h2 className="text-4xl md:text-5xl font-black tracking-[-0.02em] text-white mb-6">
        Ready to Scale Your Agency?
      </h2>
      <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
        Stop turning away clients because of technical bottlenecks. Partner with Roxten Studios and deliver premium digital experiences under your own brand.
      </p>
      <Link href="/partnership/agency">
        <a className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-full hover:scale-105 hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          Become a Partner
        </a>
      </Link>
    </section>
  );
}
