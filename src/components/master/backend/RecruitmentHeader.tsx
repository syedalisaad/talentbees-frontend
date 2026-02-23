"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecruitmentHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "Admin User", initials: "AU", user: null });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsed = (storedUser);
        const fullName = parsed.name || "Admin User";

        const initials = fullName
          .split(" ")
          .filter(Boolean)
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);

        setUser({
          name: fullName,
          initials: initials || "AA",
          user: parsed,
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login/recruitment");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-end sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 mr-4 border-r border-slate-100 pr-4">
          <Link href="/contact-us">
            <div className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
              <HelpCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
            </div>
          </Link>
          <Link href="/">
            <div className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
              <ExternalLink size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Public Site</span>
            </div>
          </Link>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 pl-4 cursor-pointer group select-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
                {user.name}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {user?.company?.company_name || "Company Name"}  
              </p>
            </div>

            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border-2 transition-all ${
                  isOpen
                    ? "bg-yellow-400 border-yellow-400 text-slate-900"
                    : "bg-slate-900 border-slate-100 text-yellow-400 group-hover:border-yellow-400"
                }`}
              >
                {user.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                <ChevronDown
                  size={10}
                  className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Settings</p>
              </div>

              <Link href="/recruitment/profile" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <User size={18} className="text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-wider">Edit Profile</span>
                </div>
              </Link>

              <Link href="/recruitment/settings" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <Settings size={18} className="text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-wider">Preferences</span>
                </div>
              </Link>

              <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}