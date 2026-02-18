"use client";

import React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Circle,
} from "lucide-react";

export default function RecruitmentHeader() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1 mr-4 border-r border-slate-100 pr-4">
          <a href="/contact-us">
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2">
              <HelpCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Support
              </span>
            </button>
          </a>
          <a href="/">
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2">
              <ExternalLink size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Public Site
              </span>
            </button>
          </a>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 cursor-pointer group">
          <div className="text-right">
            <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
              Ammar <span className="text-yellow-500">Ahmed</span>
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <Circle size={6} className="fill-green-500 text-green-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Online
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-yellow-400 font-black text-xs border-2 border-slate-100 group-hover:border-yellow-400 transition-all">
              AA
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
              <ChevronDown size={10} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
