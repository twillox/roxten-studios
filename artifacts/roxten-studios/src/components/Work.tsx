import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLocation } from "wouter";
import ProjectPreviewModal from "./ProjectPreviewModal";
import { db } from "@workspace/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWorks() {
      const q = query(
        collection(db, "works"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      const fetched = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(data => data.showOnLandingPage)
        .slice(0, 3)
        .map((data, index) => {
          return {
            id: data.id,
            num: `/0${index + 1}`,
            name: data.title,
            client: data.category,
            category: data.category,
            year: new Date(data.createdAt || Date.now()).getFullYear().toString(),
            desc: data.description,
            tags: ["Dynamic", "Portfolio", "Roxten"],
            image: data.imageUrl,
            href: data.link
          };
        });
      
      // Add the final archive link
      fetched.push({
        num: "/0X",
        name: "View Archive",
        client: "Explore",
        category: "Archive",
        year: "2026",
        desc: "Discover more of our digital experiences, experiments, and case studies.",
        tags: [],
        image: "", 
        isLink: true,
        href: "/archive"
      });

      setProjects(fetched);
    }
    fetchWorks();
  }, []);

  useGSAP(() => {
    if (projects.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    
    // Initial setup:
    // Card 0 is already at y: 0.
    // Cards 1, 2, 3 are pushed completely off-screen below.
    gsap.set(cards.slice(1), { y: "100vh" });

    // Master Timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        // The pinning duration depends on the number of cards.
        end: `+=${cards.length * 100}%`, 
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Update the progress indicator based on scroll percentage
          const progress = self.progress;
          const currentCard = Math.min(
            Math.floor(progress * cards.length) + 1,
            cards.length
          );
          setCurrentProgress(currentCard);
        }
      }
    });

    // Build the sequential animation
    cards.forEach((card, index) => {
      if (index === 0) return; // First card is already in place
      
      const prevCard = cards[index - 1];
      const prevOverlay = prevCard.querySelector('.dim-overlay');

      // Add a dynamic top gap so previous cards peak out
      const yOffset = index * 32; 

      const tl = masterTl.addLabel(`card${index}`)
        .to(card, {
          yPercent: 0,
          y: yOffset, // Stacking gap
          ease: "none"
        }, `card${index}`);
        
      if (prevOverlay) {
        tl.to(prevOverlay, {
          opacity: 0.7,
          ease: "none"
        }, `card${index}`);
      }
    });

  }, { scope: sectionRef, dependencies: [projects] });

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="bg-[#050505] relative z-10 w-full h-screen overflow-hidden flex flex-col justify-center"
    >
      <div className="w-full flex flex-col items-center justify-center h-full pt-[120px] pb-12">
        
        {/* Minimal Section Header */}
        <div className="w-[92vw] max-w-[1400px] flex justify-between items-end mb-8 md:mb-12">
          <h2 className="text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
            Selected Works
          </h2>
          <p className="text-white/40 font-mono tracking-widest text-xs md:text-sm uppercase transition-all duration-300">
            <span className="text-white">0{currentProgress}</span> / 0{projects.length}
          </p>
        </div>

        {/* Full-width Centered Card Stack */}
        <div 
          ref={containerRef}
          className="w-[92vw] max-w-[1400px] relative h-[45vh] md:h-[80vh]"
        >
          {projects.map((project, i) => (
            <div 
              key={i}
              className="project-card absolute top-0 left-0 w-full h-full flex flex-col"
              style={{ 
                borderRadius: '40px',
                transformOrigin: 'center top',
                zIndex: i + 1,
                willChange: 'transform, opacity',
              }}
            >
              {/* Card Surface with Gradient Border */}
              <div className="relative w-full h-full p-[1px] rounded-[40px] bg-gradient-to-b from-white/20 via-white/5 to-transparent group shadow-2xl shadow-black/50">
                <div className="relative w-full h-full bg-[#0a0a0a] rounded-[39px] overflow-hidden">
                  <div className="dim-overlay absolute inset-0 bg-black opacity-0 z-[100] pointer-events-none" />
                
                {project.isLink ? (
                  /* LINK CARD LAYOUT */
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#050505] group-hover:bg-[#0a0a0a] transition-colors duration-500">
                    <button 
                      onClick={() => setLocation(project.href!)}
                      className="flex flex-col items-center gap-8 group/link cursor-pointer border-none bg-transparent outline-none"
                    >
                      <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-white group-hover/link:border-white transition-all duration-500">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover/link:text-black group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all duration-500">
                          <line x1="5" y1="19" x2="19" y2="5"></line>
                          <polyline points="10 5 19 5 19 14"></polyline>
                        </svg>
                      </div>
                      <h3 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase">
                        View All Works
                      </h3>
                    </button>
                  </div>
                ) : (
                  /* NORMAL CARD LAYOUT */
                  <>
                    {/* Background Area */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[40px] bg-[#080808]">
                      {project.image && (
                        <img 
                          src={project.image} 
                          alt={project.name}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none" />
                    </div>

                    {/* Card Content - Clickable area */}
                    <div 
                      className="relative z-20 flex flex-col h-full p-6 md:p-14 cursor-pointer pointer-events-auto"
                      onClick={() => setPreviewUrl(project.href)}
                    >
                      
                      {/* Top Area */}
                      <div className="flex justify-between items-start pointer-events-auto relative z-10">
                        {/* Number */}
                        <div className="flex flex-col gap-8">
                          <span className="text-white font-light font-mono text-3xl md:text-5xl tracking-tighter shadow-black drop-shadow-md">
                            {project.num}
                          </span>
                        </div>

                        {/* Live Preview Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(project.href);
                          }}
                          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-white text-[10px] md:text-[11px] uppercase tracking-widest font-semibold hover:bg-white hover:text-black hover:border-white transition-all duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group/btn hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] bg-black/20 backdrop-blur-md"
                        >
                          <span className="hidden md:inline">Live Project</span>
                          <span className="md:hidden">View</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-45 transition-transform duration-300">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>

                      {/* Bottom Area */}
                      <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-auto relative z-10">
                        <div>
                          <h3 className="text-white text-4xl md:text-[clamp(4rem,8vw,8rem)] font-black tracking-[-0.04em] uppercase leading-none mb-2 md:mb-4 shadow-black drop-shadow-lg">
                            {project.name}
                          </h3>
                        </div>
                      </div>

                    </div>
                  </>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render the global preview modal */}
      <ProjectPreviewModal 
        isOpen={!!previewUrl} 
        url={previewUrl} 
        onClose={() => setPreviewUrl(null)} 
      />
    </section>
  );
}
