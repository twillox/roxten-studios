import { useLocation } from "wouter";

export default function ReferralNavbar() {
  const [, setLocation] = useLocation();

  return (
    <header className="fixed top-6 left-4 right-4 md:left-12 md:right-12 z-[50] flex justify-center pointer-events-none">
      <div className="relative w-full max-w-[1200px] h-[80px] px-8 md:px-12 flex items-center justify-between rounded-full backdrop-blur-[25px] text-white bg-black/50 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.03)] pointer-events-auto">
        
        {/* LOGO */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); setLocation("/"); }}
          className="font-black text-[18px] md:text-[20px] tracking-[-0.04em] uppercase hover:opacity-80 transition-opacity flex items-center gap-1.5"
        >
          ROXTEN <span className="font-medium opacity-60 text-[14px] md:text-[16px] tracking-widest hidden sm:inline-block">PARTNERS</span>
        </a>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          <a
            href="/referral/login"
            onClick={(e) => { e.preventDefault(); setLocation("/referral/login"); }}
            className="hidden sm:block text-sm font-medium tracking-wide uppercase hover:opacity-80 transition-opacity"
          >
            Log In
          </a>
          <a
            href="/referral/signup"
            onClick={(e) => { e.preventDefault(); setLocation("/referral/signup"); }}
            className="px-6 py-2.5 bg-white text-black text-xs md:text-sm font-bold tracking-widest uppercase rounded-full hover:bg-[#00ffcc] hover:text-black transition-colors duration-300"
          >
            Join Now
          </a>
        </div>
      </div>
    </header>
  );
}
