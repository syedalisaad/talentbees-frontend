"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      
      {/* --- LEFT SIDE: BRAND/MARKETING --- */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background "Hexagon" or Bee pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/10 rounded-full -ml-20 -mb-20 blur-2xl" />

        <div className="relative z-10">
       

          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Connecting the <br /> 
            <span className="text-yellow-300 underline decoration-slate-700 underline-offset-8">sharpest minds</span> <br />
            in the hive.
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium">
            Join a thriving ecosystem of digital builders crafting the future of technology. Discover your next opportunity and let your career take flight with us.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-2xl font-black text-white">12k+</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Jobs</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <p className="text-2xl font-black text-white">450+</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Companies</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-bold text-sm">
              Don't have an account? <span className="text-yellow-300 cursor-pointer hover:underline">Join the hive</span>
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-300 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all focus:border-yellow-300 focus:ring-4 ring-yellow-300/5 font-medium placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <span className="text-[10px] font-black uppercase text-yellow-300 cursor-pointer hover:underline">Forgot?</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-300 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all focus:border-yellow-300 focus:ring-4 ring-yellow-300/5 font-medium placeholder:text-slate-300 shadow-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button className="w-full bg-slate-900 hover:bg-yellow-300 hover:text-slate-900 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group">
              Sign In to Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-[#F8FAFC] px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Or continue with</span>
          </div> */}

          {/* <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm shadow-sm">
              <Chrome size={18} className="text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm shadow-sm">
              <Github size={18} /> Github
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}