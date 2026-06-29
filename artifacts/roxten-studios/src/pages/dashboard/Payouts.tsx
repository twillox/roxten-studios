import React, { useState, useEffect } from "react";
import { payoutService, commissionService } from "../../lib/firebase-services";
import { Payout, Commission } from "../../lib/mock-api/models";
import { useAuth } from "../../hooks/useAuth";
import { CreditCard, ArrowRight, Loader2, Info, IndianRupee } from "lucide-react";

export default function Payouts() {
  const { user, loading: authLoading } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [requestAmount, setRequestAmount] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    if (user) {
      const [ps, cs] = await Promise.all([
        payoutService.getPayouts(user.id),
        commissionService.getCommissions(user.id)
      ]);
      setPayouts(ps);
      setCommissions(cs);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading]);

  const availableAmount = commissions.filter(c => c.status === "Approved").reduce((s, c) => s + c.amount, 0);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const amt = parseFloat(requestAmount);
    
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amt > availableAmount) {
      setError("Amount exceeds available balance");
      return;
    }
    if (amt < 500) {
      setError("Minimum payout amount is ₹500");
      return;
    }

    setRequesting(true);
    try {
      await payoutService.requestPayout(user!.id, amt, user?.paymentPreferences?.method || "bank");
      setSuccess("Payout requested successfully!");
      setRequestAmount("");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to request payout");
    } finally {
      setRequesting(false);
    }
  };

  if (authLoading || dataLoading || !user) return <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tight">Payouts</h1>
        <p className="text-white/50 mt-2">Manage your bank details and request withdrawals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REQUEST PAYOUT CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-2">Available Balance</h2>
            <p className="text-5xl font-black font-mono text-[#00ffcc] mb-6">₹{availableAmount.toLocaleString()}</p>
            
            <form onSubmit={handleRequestPayout} className="space-y-4">
              {error && <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">{error}</div>}
              {success && <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm">{success}</div>}
              
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1 mb-2 block">Withdraw Amount (USD)</label>
                <input 
                  type="number" 
                  value={requestAmount}
                  onChange={e => setRequestAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={requesting || availableAmount < 500}
                className="w-full py-4 bg-[#00ffcc] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-colors flex justify-center items-center h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requesting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Payout"}
              </button>
            </form>
            
            {availableAmount < 500 && (
              <div className="mt-4 flex items-start gap-2 text-white/40 text-sm">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Minimum payout threshold is $500. You need ${(500 - availableAmount).toLocaleString()} more to withdraw.</p>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">Payment Details</h2>
            <button className="text-[#00ffcc] text-sm hover:underline">Edit</button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-black/30 border border-white/5 rounded-xl">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white/60" />
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-1">Primary Method</p>
                <p className="font-medium uppercase">{user.paymentPreferences?.method || "Not set"}</p>
                <p className="text-sm text-white/60 font-mono mt-1">{user.paymentPreferences?.details || "No details provided"}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-200 text-sm leading-relaxed">
              <strong>Note:</strong> Payouts are processed on the 1st and 15th of every month. Bank transfers may take 3-5 business days to reflect in your account.
            </div>
          </div>
        </div>
      </div>

      {/* PAYOUT HISTORY */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
            <History className="w-5 h-5 text-white/50" /> Payout History
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Method</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">No payouts requested yet.</td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-white/50">{payout.id}</td>
                    <td className="p-4 text-sm text-white/70">{new Date(payout.requestedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm uppercase tracking-widest font-bold">{payout.method}</td>
                    <td className="p-4 font-mono text-sm font-bold">₹{payout.amount.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        payout.status === "Completed" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                        payout.status === "Processing" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                        "text-red-400 bg-red-400/10 border-red-400/20"
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
