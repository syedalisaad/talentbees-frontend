import React from 'react';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Sample data - eventually this comes from your Laravel API
const categories = [
  { name: 'Software', count: '1.2k+', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Design', count: '800+', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Marketing', count: '500+', icon: <Briefcase className="w-5 h-5" /> },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION (SEO: H1 Heading) */}
      <section className="relative bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Find your next <span className="text-yellow-300">dream job</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Connecting the best talent with top companies. Explore thousands of
            job opportunities across the globe.
          </p>

          {/* 2. SEARCH BAR (UX: Easy Access) */}
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="text-slate-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full outline-none text-slate-700"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2">
              <MapPin className="text-slate-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="City or remote"
                className="w-full outline-none text-slate-700"
              />
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-yellow-300 px-8 py-4 rounded-xl font-semibold transition-all">
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Explore by Category
            </h2>
            <p className="text-slate-500 mt-2">
              Find the right role based on your interest
            </p>
          </div>
          <Link
            href="/jobs"
            className="group text-yellow-300 font-normal md:font-bold flex items-center transition-colors duration-300"
          >
            <span className="group-hover:text-slate-800">View all</span>
            <ArrowRight
              size={16}
              className="ml-1 transform group-hover:translate-x-1 group-hover:text-slate-800 transition-all"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="p-6 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-300 group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
              <p className="text-slate-500 text-sm mt-1">
                {cat.count} open positions
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}