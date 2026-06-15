import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
  quote: string;
  badge: string;
  featured: boolean;
};

const testimonialsList: Testimonial[] = [
  {
    id: "t-1",
    name: "Rahul Verma",
    position: "B.Tech Student",
    company: "Personal Portfolio",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    quote: "I needed a standout portfolio for my final year placements. The team built something so incredibly unique that it immediately caught the attention of recruiters.",
    badge: "Landed Dream Job",
    featured: false,
  },
  {
    id: "t-2",
    name: "Priya Sharma",
    position: "Boutique Owner",
    company: "Priya's Threads",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    quote: "Taking my small local shop online seemed scary, but they made it so simple. My online orders are now higher than my walk-in customers. It changed my business.",
    badge: "3x Online Sales",
    featured: true,
  },
  {
    id: "t-3",
    name: "Amit Desai",
    position: "Freelance Photographer",
    company: "Desai Captures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    quote: "They designed a gallery website for me that is lightning fast and showcases my photos perfectly without losing quality. My booking inquiries have doubled.",
    badge: "Fully Booked Season",
    featured: false,
  },
  {
    id: "t-4",
    name: "Anjali Gupta",
    position: "Home Baker",
    company: "Sweet Cravings",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    quote: "I just wanted a simple website to take cake orders through WhatsApp. They gave me a beautiful, easy-to-use site that my local customers absolutely love using.",
    badge: "150+ Monthly Orders",
    featured: false,
  },
];

function VoiceCard({ item }: { item: Testimonial }) {
  return (
    <div 
      className={`
        relative flex-shrink-0 flex flex-col justify-between
        bg-white/[0.05] backdrop-blur-[25px] border border-white/[0.08] rounded-[32px]
        p-8 md:p-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        group hover:scale-[1.03] hover:border-white/[0.2] hover:bg-white/[0.08] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]
        snap-center
        ${item.featured ? 'w-[85vw] md:w-[600px]' : 'w-[85vw] md:w-[420px]'}
        h-[380px] md:h-[360px]
      `}
    >
      {/* Top: Meta */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm md:text-base tracking-tight">{item.name}</span>
          <span className="text-white/50 text-xs md:text-sm font-mono tracking-wider">{item.position}, {item.company}</span>
        </div>
      </div>

      {/* Middle: Quote */}
      <div className="flex-1 flex items-center mt-6 mb-8">
        <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
          "{item.quote}"
        </p>
      </div>

      {/* Bottom: Badge */}
      <div className="inline-flex w-max items-center px-4 py-2 bg-white/[0.08] rounded-full border border-white/[0.05] group-hover:bg-white/[0.12] transition-colors">
        <span className="text-white text-xs md:text-sm font-mono tracking-widest uppercase">{item.badge}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section id="testimonials" className="relative bg-[#000] pt-40 pb-32 md:py-48 overflow-hidden z-10">
      
      {/* CSS Keyframes for infinite scroll */}
      <style>{`
        @keyframes scroll-voices-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); }
        }
        @keyframes scroll-voices-right {
          0% { transform: translateX(calc(-50% - 1.5rem)); }
          100% { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          .animate-voices-left {
            animation: scroll-voices-left 60s linear infinite;
          }
          .animate-voices-right {
            animation: scroll-voices-right 60s linear infinite;
          }
          .animate-voices-left:hover, .animate-voices-right:hover {
            animation-play-state: paused;
          }
        }
        /* Gradient mask to fade out the edges on desktop */
        @media (min-width: 768px) {
          .voices-mask {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        }
        
        /* Hide scrollbar for mobile snap scrolling */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header Section */}
      <div className="max-w-[1800px] mx-auto w-full px-6 md:px-12 mb-16 md:mb-24">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <p className="text-[11px] tracking-[0.35em] text-white/40 uppercase mb-6 font-mono">
            Social Proof
          </p>
          <h2 className="text-[clamp(3.5rem,8vw,7rem)] font-black tracking-[-0.04em] uppercase leading-none text-white">
            Client Voices
          </h2>
        </motion.div>
      </div>

      {/* Carousels Container */}
      <div className="voices-mask w-full flex flex-col gap-6 md:gap-8 pb-10">
        
        {/* Single Row */}
        {/* Desktop: Infinite Scroll. Mobile: Native Snap Scroll */}
        <div className="flex md:w-max w-full overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory px-6 md:px-0 gap-6">
          <div className="flex gap-6 md:animate-voices-left w-max">
            {testimonialsList.map((item, i) => (
              <VoiceCard key={`r1-a-${i}`} item={item} />
            ))}
            {/* Desktop Duplication for Seamless Loop */}
            <div className="hidden md:contents">
              {testimonialsList.map((item, i) => (
                <VoiceCard key={`r1-b-${i}`} item={item} />
              ))}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
