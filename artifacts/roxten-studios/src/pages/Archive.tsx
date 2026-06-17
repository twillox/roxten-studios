import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { Link } from "wouter";
import ProjectPreviewModal from "../components/ProjectPreviewModal";
import SEO from "../components/SEO";
import { db } from "@workspace/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Archive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  // Track the scroll progress of the entire page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    async function fetchArchive() {
      const q = query(collection(db, "works"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const fetched = snap.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
        .filter((data: any) => data.isVisible)
        .map((data) => {
          return {
            id: data.id,
            name: data.title,
            category: data.category,
            link: data.link || "",
            img: data.imageUrl || "",
          };
        });
      setProjects(fetched);
    }
    fetchArchive();
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://roxtenstudios.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Archive",
        "item": "https://roxtenstudios.com/archive"
      }
    ]
  };

  return (
    <>
    <SEO 
      title="Our Work & Case Studies | Custom Software & Web Experiences"
      description="Explore our archive of high-performance websites, eCommerce platforms, and custom software built by Roxten Studios for our agency partners and clients."
      canonicalUrl="https://roxtenstudios.com/archive"
      schema={breadcrumbSchema}
    />
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#030303] font-sans text-white z-10">
      
      {/* Interactive Grid Background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Header (Relative & Centered to fix mobile overlaps) */}
      <div className="relative pt-32 md:pt-48 pb-8 px-6 flex flex-col items-center text-center z-20">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none text-white mix-blend-difference">
          The Archive
        </h1>
        <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-[0.3em] mt-6 md:mt-8">
          Scroll to explore the roadmap
        </p>
      </div>

      {/* Back Button (Moved to top right) */}
      <Link href="/">
        <button className="fixed top-6 right-6 md:top-12 md:right-12 z-50 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full font-mono text-[10px] md:text-xs uppercase tracking-widest text-white backdrop-blur-xl transition-all duration-300 flex items-center gap-3 group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hidden md:inline">Back to Studio</span>
          <span className="md:hidden">Back</span>
        </button>
      </Link>

      {/* Scroll Roadmap Timeline */}
      <div className="relative max-w-[1400px] mx-auto mt-12 md:mt-24 pb-[20vh] px-4 md:px-12">
        
        {/* Background Track Line */}
        <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
        
        {/* Glowing Animated Scroll Progress Line */}
        <motion.div 
          style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-[3px] bg-white -translate-x-1/2 shadow-[0_0_30px_rgba(255,255,255,0.8)] z-10"
        />

        {/* Project Nodes */}
        <div className="flex flex-col gap-12 md:gap-32 relative z-20">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={project.id} className="relative w-full py-8 md:py-16">
                
                {/* Connection Dot on the Line */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, margin: "-20%" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute top-1/2 left-[32px] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-white bg-[#030303] z-30 shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                />

                {/* Card Container */}
                <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'} pl-[64px] md:pl-0`}>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full md:w-[42%] group perspective-[1000px] cursor-pointer"
                    onClick={() => setPreviewUrl(project.link)}
                  >
                    <div 
                      className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-[24px] overflow-hidden bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-[1.03] hover:rotate-y-[-2deg] hover:border-white/30"
                    >
                      <iframe 
                        src={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        title={`${project.name} - White Label Web Development Case Study`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full border-none pointer-events-none opacity-60 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-110 blur-[2px] group-hover:blur-0"
                      />

                      {/* Hover Content / Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex flex-col justify-end p-6 md:p-10">
                        <span className="font-mono text-[10px] md:text-xs text-white/60 tracking-[0.2em] uppercase block mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          {project.category}
                        </span>
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                          {project.name}
                        </h3>
                      </div>
                      
                      {/* Click Hint */}
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 pointer-events-none">
                        <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase">Click for Live Preview</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Render the global preview modal */}
      <ProjectPreviewModal 
        isOpen={!!previewUrl} 
        url={previewUrl} 
        onClose={() => setPreviewUrl(null)} 
      />

    </div>
    </>
  );
}
