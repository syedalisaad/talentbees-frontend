"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users2, 
  BarChart3, 
  ChevronLeft,
  LogOut,
  CalendarCheck,
  Clock,
  Wallet
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 

export default function RecruitmentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const isEmployer = !!(user).roles?.some(
        (role: any) => role.name === "employer",
      );

      if (isEmployer===false) {
        router.push("/login/recruitment");
      }
    } else {
      router.push("/login/recruitment");
    }
    
  }, [localStorage, router]);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", url: "/recruitment/dashboard" },
    { icon: <Briefcase size={20} />, label: "Manage Jobs", url: "/recruitment/job" },
    { icon: <Users2 size={20} />, label: "AI Sorting", url: "/recruitment/underconstriction" },
    { icon: <CalendarCheck size={20} />, label: "Attendance", url: "/recruitment/underconstriction" },
    { icon: <Clock size={20} />, label: "Leave Request", url: "/recruitment/underconstriction" },
    { icon: <Wallet size={20} />, label: "Payroll", url: "/recruitment/underconstriction" },
  ];

  if (!mounted) return <aside className="h-screen bg-slate-900 w-64 border-r border-slate-800" />;

  return (
    <aside
      className={`h-screen bg-slate-900 flex flex-col transition-all duration-300 border-r border-slate-800 sticky top-0 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden min-h-[30px]">
          {!isCollapsed && (
            <div className="relative w-[140px] h-[30px] animate-in fade-in duration-500">
              <Image
                src="/theme/white-logo.png"
                alt="TalentBees Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          {isCollapsed && (
             <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-slate-900">
                T
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
          const isActive = pathname === item.url && item.url !== "/recruitment/underconstriction";

          return (
            <Link href={item.url} key={idx} className="block">
              <button
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className={`${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <span className="text-xs font-black uppercase tracking-wider">
                    {item.label}
                  </span>
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-black uppercase tracking-widest shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}