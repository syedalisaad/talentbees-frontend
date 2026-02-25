"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  RotateCcw,
  Mail,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [otpCode, setOtpCode] = useState(""); // Using single string state
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(59);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      try {
        const user = (storedUser);
        setUserEmail(user.email || "");
      } catch (e) {
        console.error("Local storage parse error:", e);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted)
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-200" size={40} />
      </div>
    );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError(""); 
    try {
      await api.post("/verify-email", { email: userEmail, token_code: otpCode });
      router.push("/verify-email/verification-success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setError("");
    try {
      await api.post("/email/verification-notification", { email: userEmail });
      setTimer(59);
    } catch (err) {
      setError("Failed to resend. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans antialiased text-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-2xl mb-6 shadow-lg shadow-yellow-200">
            <ShieldCheck className="text-slate-900" size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Final Step</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">
            Verify your hive credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Work Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm font-bold transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          {/* Single Code Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Verification Code
            </label>
            <div className="relative">
              <ShieldCheck
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow numbers
                  if (val === "" || /^[0-9]+$/.test(val)) {
                    setOtpCode(val);
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm font-black tracking-[0.5em] transition-all placeholder:tracking-normal placeholder:font-bold"
                placeholder="000000"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Verify & Launch"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="group flex flex-col items-center gap-2 mx-auto disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 group-disabled:text-slate-300 transition-colors">
              <RotateCcw
                size={14}
                className={resending ? "animate-spin" : ""}
              />
              {resending ? "Sending..." : "Resend Code"}
            </div>
            {timer > 0 && (
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                Request again in {timer}s
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}