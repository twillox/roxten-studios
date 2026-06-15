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
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const trigger = triggerRef.current;
    const card = cardRef.current;
    if (!trigger || !card) return;

    const beforeBlock = card.querySelector('.before-block');
    const beforeTextSpans = card.querySelectorAll('.before-item > span.text-content');
    const strikeLines = card.querySelectorAll('.strike-line');
    const afterBlock = card.querySelector('.after-block');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top 85%", // Start animating when the top of the wrapper is at 85% of viewport
        end: "center 55%", // Finish the animation when the wrapper reaches the center of the screen
        scrub: 1, // Smoothly link to scroll position
      }
    });

    // 1. First the box forms
    tl.from(card, {
      y: 100,
      opacity: 0,
      ease: "none" // Linear ease works best for scroll scrubbing
    });

    // 2. Before text comes in (without strike at first)
    tl.from(beforeTextSpans, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      ease: "none"
    });

    // 3. Strike out line draws across
    tl.to(strikeLines, {
      width: "100%",
      stagger: 0.1,
      ease: "none"
    });

    // 4. Slide and go placed in its position (dimming it slightly as it becomes background)
    tl.to(beforeBlock, {
      x: -20,
      opacity: 0.3,
      ease: "none"
    });

    // 5. Main text fades in and pops slightly
    tl.from(afterBlock, {
      scale: 0.9,
      opacity: 0,
      ease: "none"
    });

  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="w-full flex justify-center perspective-[1000px]">
      <div
        ref={cardRef}
        className="relative w-[95vw] md:w-[85vw] mx-auto min-h-[50vh] md:min-h-[60vh] bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md p-8 md:p-16 flex flex-col md:flex-row gap-12 md:gap-8 items-center will-change-transform"
      >
        {/* Decorative ID */}
        <div className="absolute top-6 left-8 md:top-10 md:left-12 font-mono text-white/20 text-sm tracking-widest">
          /{data.id}
        </div>

        {/* BEFORE SECTION */}
        <div className="before-block flex-1 w-full mt-8 md:mt-0 flex flex-col justify-center border-b border-white/10 md:border-b-0 md:border-r pb-12 md:pb-0 md:pr-12 will-change-transform">
          <h3 className="text-white/40 font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-8">Before</h3>
          <ul className="flex flex-col gap-6">
            {data.before.map((item, i) => (
              <li key={i} className="before-item relative w-fit text-white/80 text-xl md:text-4xl font-light tracking-tight break-words flex items-center">
                <span className="text-content block will-change-transform">{item}</span>
                <span className="strike-line absolute left-0 top-1/2 -translate-y-1/2 w-0 h-[2px] bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.3)] origin-left" />
              </li>
            ))}
          </ul>
        </div>

        {/* AFTER SECTION */}
        <div className="after-block flex-1 w-full flex flex-col justify-center md:pl-12 origin-left md:origin-center will-change-transform">
          <h3 className="text-[#00ffcc] font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-8 flex items-center gap-4">
            <span className="w-8 h-px bg-[#00ffcc]"></span>
            After
          </h3>
          <ul className="flex flex-col gap-6">
            {data.after.map((item, i) => (
              <li key={i} className="text-white text-2xl md:text-6xl font-black tracking-[-0.03em] leading-[1.1] break-words">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const headerLines = headerRef.current?.querySelectorAll('span.block');
    
    if (headerLines) {
      gsap.from(headerLines, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="process" ref={sectionRef} className="relative bg-[#030303] pt-40 pb-32 md:py-48 overflow-hidden z-10">
      <div className="max-w-[1800px] mx-auto w-full flex flex-col items-center">
        
        {/* Massive Header */}
        <div ref={headerRef} className="w-[95vw] md:w-[85vw] mb-24 md:mb-40">
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-black tracking-[-0.04em] uppercase leading-[0.9] text-white">
            <span className="block text-white/40 will-change-transform">We don't build websites.</span>
            <span className="block mt-2 will-change-transform">We transform businesses.</span>
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
