"use client";

import Link from "next/link";
import { Menu, X, LogOut, User, Briefcase } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const router = useRouter();

  // 1. Logic to sync user state with localStorage
  const syncUser = useCallback(() => {
    const userStorage = localStorage.getItem("user");
    
    if (userStorage && userStorage !== "null" && userStorage !== "undefined") {
      try {
        const parsedUser = JSON.parse(userStorage);
        setUser(parsedUser);
        
        const isEmp = !!parsedUser.roles?.some(
          (role: any) => role.name === "employer"
        );
        setIsEmployee(isEmp);
      } catch (e) {
        console.error("Failed to parse user:", e);
        setUser(null);
      }
    } else {
      setUser(null);
      setIsEmployee(false);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Initial check
    syncUser();

    // Listen for storage changes (works across tabs)
    window.addEventListener("storage", syncUser);
    
    // Listen for custom login event (works in same tab)
    window.addEventListener("local-auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("local-auth-change", syncUser);
    };
  }, [syncUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Trigger update for this component and others
    window.dispatchEvent(new Event("local-auth-change"));
    
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Image
            src="/theme/logo.png"
            alt="Talentbees Logo"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-4">
          {isLoaded && (
            <>
              {/* CASE 1: EMPLOYER DASHBOARD */}
              {user && isEmployee ? (
                <Link
                  href="/recruitment/dashboard"
                  className="rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-slate-700 transition-all hover:shadow-yellow-400/20"
                >
                  Dashboard
                </Link>
              ) : 
              
              /* CASE 2: CANDIDATE LINKS */
              user && !isEmployee ? (
                <div className="flex items-center gap-6">
                  <Link
                    href="/candidate/profile"
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-yellow-500 transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <Link
                    href="/candidate/applications"
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-yellow-500 transition-colors"
                  >
                    <Briefcase size={16} /> My Applications
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 text-sm font-black text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-tighter"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : 
              
              /* CASE 3: GUEST / LOGGED OUT */
              (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="hidden md:block text-sm font-bold text-slate-900 hover:text-yellow-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login/recruitment"
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Post Jobs
                  </Link>
                </div>
              )}
            </>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}