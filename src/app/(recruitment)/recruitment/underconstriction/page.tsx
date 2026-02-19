"use client";

import React from "react";
import { 
  Sparkles, 
  Hammer, 
  Construction, 
  ArrowLeft,
  Timer
} from "lucide-react";
import Link from "next/link";

export default function RecruitmentDashboardComingSoon() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse rounded-full"></div>
        <div className="relative bg-slate-900 p-6 rounded-[32px] border-2 border-slate-800 shadow-2xl rotate-3">
          <Construction className="text-yellow-400 animate-bounce" size={48} />
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-xl rotate-12 shadow-lg">
          <Sparkles size={20} className="text-slate-900" />
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 border border-yellow-200 rounded-full">
          <Timer size={14} className="text-yellow-700" />
          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700">Under Construction</span>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
          Expanding the <span className="text-yellow-500">Hive</span>
        </h1>
        
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          We're busy building the most powerful dashboard for <span className="font-bold text-slate-700">Builders</span>. Advanced analytics and candidate matching are currently in the works.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mt-10 w-full max-w-xs space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
          <span>Deployment Progress</span>
          <span>75%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div className="h-full bg-slate-900 w-3/4 animate-progress-stripes transition-all duration-1000"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link 
          href="/recruitment/job" 
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-400 hover:text-slate-900 transition-all shadow-lg shadow-slate-900/10"
        >
          <Hammer size={16} /> Post a Job Instead
        </Link>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-400 border border-slate-200 rounded-xl font-black text-[11px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all"
        >
          <ArrowLeft size={16} /> Back to Site
        </Link>
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full opacity-[0.03] pointer-events-none select-none overflow-hidden h-64">
        <p className="text-[15vw] font-black uppercase whitespace-nowrap leading-none">
          TECHBEES BUILDER HUB TECHBEES BUILDER HUB
        </p>
      </div>
    </div>
  );
}