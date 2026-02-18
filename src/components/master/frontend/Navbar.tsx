import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
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

        {/* <div className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Companies
          </Link>
          <Link href="/salaries" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Salaries
          </Link>
        </div> */}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Sign In
          </Link>
          <Link
            href="/recruitment/login"
            className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all golden-bee"
          >
            Post Jobs
          </Link>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}