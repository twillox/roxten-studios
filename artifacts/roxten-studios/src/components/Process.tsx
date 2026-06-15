import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const transformations = [
  {
    id: "01",
    before: ["Slow Website", "Poor Conversions", "Outdated Design", "No Growth"],
    after: ["Premium Experience", "Higher Conversions", "Modern Brand", "Scalable Growth"],
  },
  {
    id: "02",
    before: ["Manual Processes", "Lost Leads", "Poor User Experience"],
    after: ["Automated Systems", "Lead Generation", "Frictionless Experience"],
  },
  {
    id: "03",
    before: ["Basic Idea"],
    after: ["Launch-Ready Product"],
  },
];

function TransformationCard({ data }: { data: typeof transformations[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const beforeBlock = card.querySelector('.before-block');
    const afterBlock = card.querySelector('.after-block');

    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      }
    })
    .to(beforeBlock, {
      x: -50,
      opacity: 0,
      ease: "power1.inOut"
    }, 0)
    .fromTo(afterBlock, {
      scale: 0.85,
      opacity: 0.3,
    }, {
      scale: 1,
      opacity: 1,
      ease: "power2.out"
    }, 0);

  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="relative w-[95vw] md:w-[85vw] mx-auto min-h-[50vh] md:min-h-[60vh] bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md p-8 md:p-16 flex flex-col md:flex-row gap-12 md:gap-8 items-center"
    >
      {/* Decorative ID */}
      <div className="absolute top-6 left-8 md:top-10 md:left-12 font-mono text-white/20 text-sm tracking-widest">
        /{data.id}
      </div>

      {/* BEFORE SECTION */}
      <div className="before-block flex-1 w-full mt-8 md:mt-0 flex flex-col justify-center border-b border-white/10 md:border-b-0 md:border-r pb-12 md:pb-0 md:pr-12">
        <h3 className="text-white/40 font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-8">Before</h3>
        <ul className="flex flex-col gap-6">
          {data.before.map((item, i) => (
            <li key={i} className="text-white/50 text-2xl md:text-4xl font-light tracking-tight line-through decoration-white/20">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* AFTER SECTION */}
      <div className="after-block flex-1 w-full flex flex-col justify-center md:pl-12 origin-left md:origin-center">
        <h3 className="text-[#00ffcc] font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-8 flex items-center gap-4">
          <span className="w-8 h-px bg-[#00ffcc]"></span>
          After
        </h3>
        <ul className="flex flex-col gap-6">
          {data.after.map((item, i) => (
            <li key={i} className="text-white text-3xl md:text-6xl font-black tracking-[-0.03em] leading-[1.1]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="relative bg-[#030303] pt-40 pb-32 md:py-48 overflow-hidden z-10">
      <div className="max-w-[1800px] mx-auto w-full flex flex-col items-center">
        
        {/* Massive Header */}
        <div className="w-[95vw] md:w-[85vw] mb-24 md:mb-40">
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-black tracking-[-0.04em] uppercase leading-[0.9] text-white">
            <span className="block text-white/40">We don't build websites.</span>
            <span className="block mt-2">We transform businesses.</span>
          </h2>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col gap-12 md:gap-32 w-full items-center">
          {transformations.map((data) => (
            <TransformationCard key={data.id} data={data} />
          ))}
        </div>

      </div>
    </section>
  );
}
