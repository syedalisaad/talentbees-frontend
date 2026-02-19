"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // To prevent UI flickering

  useEffect(() => {
    const userStorage = localStorage.getItem("user"); 
    if (userStorage) {
      try {   
        const parsedUser = JSON.parse(userStorage);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      } 
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
          {/* Wait until isLoaded is true to show either state. 
            Use 'user' (state) instead of 'userStorage' (local variable)
          */}
          {isLoaded && (
            user ? (
              <Link
                href="/recruitment/dashboard"
                  className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all golden-bee"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-medium text-slate-600 hover:text-yellow-300"
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
            )
          )}
          
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}