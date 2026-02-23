"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle // Added for error icon
} from "lucide-react";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // New state for specific field errors (e.g., from Laravel/Express validation)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await api.post("/login", { email, password });      
      const data = response.data.data || response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
        setError("Please check your credentials.");
      } else {
        setError(err.response?.data?.message || "Authentication failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ field }: { field: string }) => (
    fieldErrors[field] ? (
      <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase animate-in fade-in slide-in-from-top-1">
        {fieldErrors[field][0]}
      </p>
    ) : null
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      {/* --- LEFT SIDE --- */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/10 rounded-full -ml-20 -mb-20 blur-2xl" />

        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Connecting the <br />
            <span className="text-yellow-300 underline decoration-slate-700 underline-offset-8">
              sharpest minds
            </span>{" "}
            <br />
            in the hive.
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium">
            Join a thriving ecosystem of digital builders crafting the future of
            technology.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-white">
          <div>
            <p className="text-2xl font-black">12k+</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Jobs</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <p className="text-2xl font-black">450+</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Companies</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500 font-bold text-sm">
              Don't have an account?{" "}
              <a href="/login/register" className="text-yellow-400 cursor-pointer hover:underline">
                Join the hive
              </a>
            </p>
          </div>

          {/* Global Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500" size={18} />
              <p className="text-red-600 text-xs font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    fieldErrors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-yellow-300"
                  }`}
                  size={18}
                />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium placeholder:text-slate-300 shadow-sm ${
                    fieldErrors.email 
                      ? "border-red-200 ring-4 ring-red-500/5" 
                      : "border-slate-100 focus:border-yellow-300 focus:ring-4 ring-yellow-300/5"
                  }`}
                />
              </div>
              <ErrorMessage field="email" />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <span className="text-[10px] font-black uppercase text-yellow-500 cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    fieldErrors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-yellow-300"
                  }`}
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium placeholder:text-slate-300 shadow-sm ${
                    fieldErrors.password 
                      ? "border-red-200 ring-4 ring-red-500/5" 
                      : "border-slate-100 focus:border-yellow-300 focus:ring-4 ring-yellow-300/5"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ErrorMessage field="password" />
            </div>

            {/* Login Button */}
            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "Authenticating..." : "Sign In to Account"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
          
          <p className="text-center mt-8 text-xs font-bold text-slate-500 tracking-tight">
            Don't have an account?{" "}
            <a href="/login/register" className="text-yellow-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}