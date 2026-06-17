import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

type ModelType = {
  title: string;
  tag: string;
  description: string;
  featuresLabel: string;
  features: string[];
  bottomMeta?: string;
  cta: string;
  accent: string;
  featured: boolean;
  badge?: string;
};

const MODELS: ModelType[] = [
  {
    title: "Agency Partner",
    tag: "White-Label Development",
    description: "For marketing agencies that want to offer websites, applications, and digital solutions without building an internal technical team.",
    featuresLabel: "Features",
    features: [
      "Website Development",
      "Web Applications",
      "Mobile Applications",
      "UI/UX Design",
      "Technical Consulting",
      "Ongoing Support",
      "Dedicated Delivery Team"
    ],
    cta: "Become a Partner",
    accent: "blue",
    featured: false,
  },
  {
    title: "Venture Partner",
    tag: "Startup Incubation Program",
    description: "Have a startup idea but lack the resources to build it? Roxten Studios provides technical execution, product development, and launch support in exchange for a share in future success.",
    featuresLabel: "Features",
    features: [
      "MVP Development",
      "Product Strategy",
      "UI/UX Design",
      "Technical Architecture",
      "Launch Support",
      "Growth Consultation",
      "Long-Term Partnership"
    ],
    bottomMeta: "Model: Equity Share • Revenue Share • Profit Share",
    cta: "Pitch Your Startup",
    accent: "purple",
    featured: false,
  },
  {
    title: "Growth Partner",
    tag: "Revenue Share Development",
    description: "Reduce upfront investment and convert part of your project cost into a mutually beneficial revenue-sharing agreement.",
    featuresLabel: "Features",
    features: [
      "Full Product Development",
      "Flexible Payment Structure",
      "Revenue-Based Partnership",
      "Long-Term Collaboration",
      "Strategic Support"
    ],
    bottomMeta: "Example: ₹2L Project\nPay ₹1L Today\nConvert Remaining Cost Into Revenue Share",
    cta: "Discuss Partnership",
    accent: "green",
    featured: false,
  }
];

const accentColors = {
  blue: {
    text: "text-blue-400",
    borderHover: "hover:border-blue-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
    bgHover: "hover:bg-blue-500/[0.02]",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    btnBg: "bg-blue-500 hover:bg-blue-600",
    btnText: "text-white",
    featuredBorder: "",
  },
  purple: {
    text: "text-purple-400",
    borderHover: "hover:border-purple-500/50",
    shadowHover: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    bgHover: "hover:bg-purple-500/[0.03]",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    btnBg: "bg-purple-500 hover:bg-purple-600",
    btnText: "text-white",
    featuredBorder: "border-purple-500/30",
  },
  green: {
    text: "text-emerald-400",
    borderHover: "hover:border-emerald-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    bgHover: "hover:bg-emerald-500/[0.02]",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    btnBg: "bg-emerald-500 hover:bg-emerald-600",
    btnText: "text-white",
    featuredBorder: "",
  },
  orange: {
    text: "text-orange-400",
    borderHover: "hover:border-orange-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]",
    bgHover: "hover:bg-orange-500/[0.02]",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-400",
    btnBg: "bg-orange-500 hover:bg-orange-600",
    btnText: "text-white",
    featuredBorder: "",
  },
};

export default function PartnershipModels() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section 
      id="partnership-models" 
      data-theme="dark" 
      className="py-32 md:py-40 bg-[#050505] text-white relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em] mb-6">
            Choose Your <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              Growth Model
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium">
            Flexible ways to build, launch, and scale with Roxten Studios.
          </p>
        </motion.div>

        {/* Grid Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {MODELS.map((model, idx) => {
            const styles = accentColors[model.accent as keyof typeof accentColors];
            
            return (
              <motion.div
                key={model.title}
                variants={itemVariants}
                className={`
                  relative flex flex-col h-full rounded-2xl p-8 lg:p-10 transition-all duration-500 ease-out
                  bg-white/[0.02] backdrop-blur-md 
                  border border-white/[0.05]
                  ${styles.borderHover} ${styles.shadowHover} ${styles.bgHover}
                  ${model.featured ? 'lg:-translate-y-4 lg:scale-[1.02] bg-white/[0.04] ' + styles.featuredBorder : ''}
                `}
              >
                {/* Badge if featured */}
                {model.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${styles.badgeBg} ${styles.badgeText} border border-${model.accent}-500/20 shadow-lg shadow-${model.accent}-500/10`}>
                      {model.badge}
                    </span>
                  </div>
                )}

                {/* Header info */}
                <div className="mb-8">
                  <div className={`text-sm font-semibold tracking-wide uppercase mb-3 ${styles.text}`}>
                    {model.tag}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-4">
                    {model.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed min-h-[80px]">
                    {model.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/[0.08] mb-8" />

                {/* Features */}
                <div className="flex-grow mb-10">
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
                    {model.featuresLabel}
                  </div>
                  <ul className="space-y-4">
                    {model.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${styles.badgeBg} ${styles.badgeText}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Meta (Optional) */}
                {model.bottomMeta && (
                  <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/[0.05]">
                    <p className="text-xs text-white/70 whitespace-pre-line font-medium leading-relaxed">
                      {model.bottomMeta}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <button 
                  onClick={() => setLocation('/partnership/' + model.title.split(' ')[0].toLowerCase())}
                  className={`
                    w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
                    ${model.featured ? styles.btnBg + ' ' + styles.btnText : 'bg-white/10 hover:bg-white/15 text-white'}
                  `}
                >
                  {model.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Premium Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-32 text-center max-w-2xl mx-auto"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-8" />
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/80">
            Not every business needs a website.<br/>
            Some need a technical partner.
          </p>
          <p className="mt-6 text-sm uppercase tracking-widest text-white/40 font-bold">
            Roxten Studios adapts to the way you want to grow.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
