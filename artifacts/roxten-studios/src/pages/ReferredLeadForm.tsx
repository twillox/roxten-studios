import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import SEO from "../components/SEO";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@workspace/firebase";

export default function ReferredLeadForm({ params }: { params: { code: string } }) {
  const referralCode = params.code;
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    description: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setErrorMsg("");
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.projectType) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      // We add to the "referrals" collection directly.
      const leadData = {
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || null,
        projectType: formData.projectType,
        description: formData.description || null,
        referralCode: referralCode, // CRITICAL: Links lead to partner
        status: "Pending", // Default status for referrals
        amount: 0, // Admin will set this later
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "referrals"), leadData);

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Query Received | Roxten Studios" description="Your query has been successfully submitted." />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="w-24 h-24 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] mb-4">Request Received</h1>
          <p className="text-xl text-white/50 max-w-lg mx-auto mb-10">
            Thank you for your interest! We will review your requirements and reach out to you shortly.
          </p>
          <button onClick={() => setLocation("/")} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Start a Project | Roxten Studios" description="Submit your project inquiry." />
      <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden py-24">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl mx-auto w-full px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-[-0.03em] uppercase leading-none text-white mb-4">Start a Project</h1>
            <p className="text-white/50 text-lg max-w-md mx-auto">Fill out the form below to initiate your inquiry. Your referral code is securely applied.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name (Optional)" className="w-full bg-transparent text-white p-4 outline-none placeholder-white/30" />
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors flex flex-col">
              <select required name="projectType" value={formData.projectType} onChange={handleChange} className={`w-full bg-transparent p-4 outline-none cursor-pointer ${formData.projectType ? 'text-white' : 'text-white/30'}`}>
                <option value="" disabled>Select Service Type *</option>
                <option value="Website" className="bg-black text-white">Website / Landing Page</option>
                <option value="Mobile App" className="bg-black text-white">Mobile Application</option>
                <option value="AI Product" className="bg-black text-white">AI Automation / Product</option>
                <option value="SaaS Platform" className="bg-black text-white">SaaS Platform / Web App</option>
                <option value="Other" className="bg-black text-white">Other</option>
              </select>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-2 focus-within:border-white/30 transition-colors">
              <textarea rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Project Description (Optional)" className="w-full bg-transparent text-white p-4 outline-none resize-none placeholder-white/30" />
            </div>

            {errorMsg && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
                {errorMsg}
              </motion.p>
            )}

            <button disabled={status === "submitting"} type="submit" className="w-full py-5 mt-4 bg-white text-black font-bold tracking-widest uppercase rounded-[16px] hover:bg-white/90 transition-all duration-300 disabled:opacity-70 flex justify-center items-center">
              {status === "submitting" ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
