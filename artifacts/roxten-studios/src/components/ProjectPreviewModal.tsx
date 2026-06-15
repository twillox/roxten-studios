import { motion, AnimatePresence } from "framer-motion";

interface ProjectPreviewModalProps {
  isOpen: boolean;
  url: string | null;
  onClose: () => void;
}

export default function ProjectPreviewModal({ isOpen, url, onClose }: ProjectPreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl p-4 md:p-10"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-[1400px] h-[85vh] flex flex-col bg-[#050505] border border-white/10 rounded-[20px] overflow-hidden shadow-2xl"
          >
            {/* Top Bar / Header */}
            <div className="w-full h-16 bg-[#0a0a0a] border-b border-white/10 flex justify-between items-center px-4 md:px-6 shrink-0 relative z-20">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">Live Preview</span>
                <span className="text-white text-xs font-medium tracking-wide truncate max-w-[150px] md:max-w-md">{url.replace("https://", "").replace("http://", "")}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(url, "_blank")}
                  className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors hidden md:block"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => window.open(url, "_blank")}
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors md:hidden"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="relative flex-1 w-full bg-[#050505]">
              {/* Loading Indicator */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
              </div>

              <iframe
                src={url}
                className="relative z-10 w-full h-full border-none bg-white"
                title="Project Live Preview"
                allow="fullscreen"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
