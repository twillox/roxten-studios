import { ReactNode } from "react";

export default function SEOContent({ children }: { children: ReactNode }) {
  return (
    <section className="relative py-20 px-6 md:px-12 w-full bg-[#030303] text-white/80">
      <div className="max-w-3xl mx-auto space-y-12">
        {children}
      </div>
    </section>
  );
}

export function SEOSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
        {title}
      </h2>
      <div className="space-y-6 text-base md:text-lg leading-relaxed">
        {children}
      </div>
    </div>
  );
}
