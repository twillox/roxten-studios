import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOFAQProps {
  items: FAQItem[];
}

export default function SEOFAQ({ items }: SEOFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 px-6 md:px-12 w-full bg-[#050505]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-lg text-white/90 pr-8">
                  {item.question}
                </span>
                <span className="text-white/40 font-mono text-xl">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-white/60 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
