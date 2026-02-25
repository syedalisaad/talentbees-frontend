"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; 

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    router.push("/login");
    
    router.refresh();
  };

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "null");

    if (userStorage) {
      try {
        const parsedUser =(userStorage);
        setUser(parsedUser);

        const isEmp = !!parsedUser.roles?.some(
          (role: any) => role.name === "employer",
        );

        setIsEmployee(isEmp);

      } catch (e) {
        console.error("Error parsing user from localStorage:", e);}
    }

    setIsLoaded(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/theme/logo.png"
            alt="Talentbees Logo"
            width={200}
            height={122}
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {isLoaded &&
            (user && isEmployee ? (
              <Link
                href="/recruitment/dashboard"
                className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all golden-bee"
              >
                Dashboard
              </Link>
            ) : user && !isEmployee ? (
              <div className="flex flex-1 items-center justify-center gap-8">
                <Link
                  href="/candidate/profile"
                  className="hidden md:block text-sm font-medium text-slate-900 hover:text-yellow-500 transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/candidate/resume"
                  className="hidden md:block text-sm font-medium text-slate-900 hover:text-yellow-500 transition-colors"
                >
                  My Resume
                </Link>
                <Link
                  href="/candidate/applications"
                  className="hidden md:block text-sm font-medium text-slate-900 hover:text-yellow-500 transition-colors"
                >
                  My Applications
                </Link>
               <button
        onClick={handleLogout}
        className="hidden md:block text-sm font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
      >
        Logout
      </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-medium text-slate-900 hover:text-yellow-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/login/recruitment"
                  className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all golden-bee"
                >
                  Post Jobs
                </Link>
              </>
            ))}

          <button className="md:hidden p-2 text-slate-900">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
