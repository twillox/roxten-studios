import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { authService } from "../../lib/firebase-services";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    referralCode: "" // Optional if referred by another partner
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await authService.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
      }, formData.password);
      setLocation("/dashboard/referral");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-6 py-12 selection:bg-[#00ffcc] selection:text-black">
      <button 
        onClick={() => setLocation("/referral")}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Become a Partner</h1>
          <p className="text-white/50 font-light">Join the Roxten Studios network and earn recurring commissions.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="United States"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
              placeholder="e.g. ROX-12345"
            />
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-1">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/50 text-[#00ffcc] focus:ring-[#00ffcc] focus:ring-offset-black" required />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                I agree to the <a href="#" className="text-white hover:text-[#00ffcc]">Terms & Conditions</a> and <a href="#" className="text-white hover:text-[#00ffcc]">Privacy Policy</a> of the Roxten Partner Network.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-[#00ffcc] transition-colors flex justify-center items-center h-[52px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          Already a partner? <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/referral/login"); }} className="text-white hover:text-[#00ffcc] transition-colors underline underline-offset-4">Log in here</a>
        </p>
      </motion.div>
    </div>
  );
}
