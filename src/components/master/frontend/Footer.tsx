import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className=""><Image src="/theme/logo.png" alt="Talentbees Logo" width={320} height={122} /></Link>
            <p className="mt-4 text-slate-500 max-w-xs">
              The world's leading job portal connecting top talent with innovative companies worldwide.
            </p>
            <div className="mt-6 flex gap-4 text-slate-400">
              <Facebook size={20} className="hover:text-yellow-300 cursor-pointer" />
              <Twitter size={20} className="hover:text-yellow-300 cursor-pointer" />
              <Linkedin size={20} className="hover:text-yellow-300 cursor-pointer" />
              <Github size={20} className="hover:text-yellow-300 cursor-pointer" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/jobs" className="hover:text-yellow-300">Browse Jobs</Link></li>
              <li><Link href="/dashboard/profile" className="hover:text-yellow-300">Candidate Dashboard</Link></li>
              <li><Link href="/jobs/remote" className="hover:text-yellow-300">Remote Jobs</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="login/recruitment" className="hover:text-yellow-300">Post a Job</Link></li>
              <li><Link href="/recruitment/job" className="hover:text-yellow-300">Job Post</Link></li>
              <li><Link href="/recruitment/job/form" className="hover:text-yellow-300">Job Post form</Link></li>
              <li><Link href="/hiring-solutions" className="hover:text-yellow-300">Hiring Solutions</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/help" className="hover:text-yellow-300">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-300">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-yellow-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Talentbees. All rights reserved.
        </div>
      </div>
    </footer>
  );
}