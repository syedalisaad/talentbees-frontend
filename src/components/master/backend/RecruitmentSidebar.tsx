"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users2, 
  BarChart3, 
  ChevronLeft,
  LogOut
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function RecruitmentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", url: "/recruitment/dashboard" },
    { icon: <Briefcase size={20} />, label: "Manage Job Posts", url: "/recruitment/job" },
    { icon: <Users2 size={20} />, label: "Specialists", url: "/recruitment/specialists" },
    { icon: <BarChart3 size={20} />, label: "Analytics", url: "/recruitment/analytics" },
  ];

  return (
    <aside
      className={`h-screen bg-slate-900 flex flex-col transition-all duration-300 border-r border-slate-800 sticky top-0 ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed && (
            <div className="relative w-[160px] h-[30px]">
              <Image
                src="/theme/white-logo.png"
                alt="TalentBees Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-500 hover:text-white transition-colors lg:flex hidden"
        >
          <ChevronLeft
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto no-scrollbar">
        <p className={`text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2 ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? "•••" : "Management"}
        </p>

        {menuItems.map((item, idx) => {
          // Check if this item is the currently active route
          const isActive = pathname === item.url;

          return (
            <Link href={item.url} key={idx} className="block">
              <button
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/10"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className={`${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className={`text-[9px] font-bold ${isActive ? "text-slate-700" : "text-slate-500"}`}>
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                )}

                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-black uppercase tracking-widest">
                    {item.label}
                  </div>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 mb-4 p-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 border-2 border-slate-900 shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-white truncate uppercase">Bee Corp HR</p>
              <p className="text-[9px] font-bold text-slate-500 truncate">Pro Plan Admin</p>
            </div>
          )}
        </div>

        <button className={`w-full flex items-center gap-4 px-3 py-2 text-slate-500 hover:text-red-400 transition-colors ${isCollapsed ? "justify-center" : ""}`}>
          <LogOut size={18} />
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-widest">Exit Portal</span>
          )}
        </button>
      </div>
    </aside>
  );
}