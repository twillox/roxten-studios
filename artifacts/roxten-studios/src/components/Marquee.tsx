import { motion } from "framer-motion";

const items = [
  "Product Design",
  "Development",
  "AI Systems",
  "Mobile Apps",
  "SaaS Platforms",
  "Enterprise",
  "Branding",
  "Web Experiences",
  "Automation",
];

export default function Marquee() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="relative bg-white border-y-2 border-black overflow-hidden py-5">
      <motion.div
        animate={{ x: [0, "-33.333%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center text-[11px] font-mono tracking-[0.28em] uppercase text-black/40">
            <span className="mx-8">{item}</span>
            <span className="text-black/20">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
