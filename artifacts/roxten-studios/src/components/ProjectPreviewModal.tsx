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
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl p-4 md:p-8"
        >
          {/* Header / Controls */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Live Preview</span>
              <span className="text-white text-sm font-medium tracking-wide">{url.replace("https://", "").replace("http://", "")}</span>
            </div>

            <div className="flex gap-4 pointer-events-auto">
              <button
                onClick={() => window.open(url, "_blank")}
                className="px-6 py-2 rounded-full border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Open in new tab
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-[1600px] h-full mt-12 md:mt-16 bg-[#0a0a0a] rounded-[24px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 relative"
          >
            {/* Loading Indicator (shows behind the iframe until it loads) */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
            </div>

            <iframe
              src={url}
              className="relative z-10 w-full h-full border-none"
              title="Project Live Preview"
              allow="fullscreen"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
