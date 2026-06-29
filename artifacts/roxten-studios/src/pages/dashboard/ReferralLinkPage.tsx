import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Copy, QrCode, Mail, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralLinkPage() {
  const { user, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  if (loading || !user) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl"></div>;

  const referralUrl = `https://roxtenstudios.in/ref/${user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = "Looking for a premium development partner? Check out Roxten Studios!";

  return (
    <div className="space-y-10 max-w-4xl">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight">Referral Link</h1>
        <p className="text-white/50 mt-2">Share your unique link or code to start earning commissions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Your Unique Link</h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-white/10">
              <LinkIcon className="text-[#00ffcc] w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                value={referralUrl} 
                readOnly 
                className="bg-transparent border-none outline-none text-white font-mono text-sm w-full"
              />
            </div>
            
            <button 
              onClick={handleCopy}
              className={`w-full py-4 font-bold uppercase tracking-widest text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                copied ? "bg-green-500 text-white" : "bg-[#00ffcc] text-black hover:bg-white"
              }`}
            >
              {copied ? <CheckIcon className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied to Clipboard" : "Copy Link"}
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Your Referral Code</h2>
          <div className="flex flex-col gap-4 items-center justify-center h-full pb-8">
            <p className="text-white/50 text-center text-sm">Clients can enter this code manually during checkout or in their project brief.</p>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00ffcc] tracking-widest font-mono p-6 border-2 border-dashed border-white/20 rounded-2xl w-full text-center">
              {user.referralCode}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Share Quickly</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + referralUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#0A66C2] hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:?subject=Recommended: Roxten Studios&body=${encodeURIComponent(shareText + "\n\n" + referralUrl)}`}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            <Mail className="w-4 h-4" /> Email
          </a>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white/50 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider hover:text-white hover:border-white/30 transition-colors">
            <QrCode className="w-4 h-4" /> Download QR
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
