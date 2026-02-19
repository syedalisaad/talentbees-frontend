"use client";

import React from "react";
import { CheckCircle, ArrowRight, LayoutDashboard, PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans antialiased text-slate-900">
      <div className="w-full max-w-xl text-center">
        
        {/* Success Icon Animation */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-3xl shadow-xl border border-slate-50">
             <div className="bg-yellow-400 p-5 rounded-2xl">
               <CheckCircle className="text-slate-900" size={48} strokeWidth={2.5} />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Welcome to the <br /> <span className="text-yellow-500">Builder Hive!</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto leading-relaxed">
            Your business account is verified. You're now ready to source the top 1% of digital builders.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1  gap-4">
          <Link 
            href="/login/recuitment"
            className="group flex flex-col items-center gap-4 p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/5 transition-all"
          >
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-yellow-50 transition-colors">
              <LayoutDashboard className="text-slate-400 group-hover:text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">Go to Login</h3>
              <p className="text-slate-400 text-xs mt-1">Manage your team and stats</p>
            </div>
          </Link>

        </div>

        <div className="mt-12">
            <button className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-slate-600">
               <PartyPopper size={14} />
               Share your hiring link
            </button>
        </div>
      </div>
    </div>
  );
}