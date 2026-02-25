"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Software", count: "1.2k+" },
  { name: "Design", count: "800+" },
  { name: "Marketing", count: "500+" },
];

export default function HomePage() {
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!jobTitle.trim() && !location.trim()) return;

    setLoading(true);

    const params = new URLSearchParams();
    if (jobTitle.trim()) params.append("job_title", jobTitle.trim());
    if (location.trim()) params.append("location", location.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Find Your Next Career Opportunity
          </h1>
          <p className="text-slate-500 mt-4">
            Search thousands of jobs across multiple industries
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
          {/* Job Title */}
          <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100">
            <Search className="text-slate-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full outline-none text-slate-700"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Location */}
          <div className="flex-1 flex items-center px-4 py-3">
            <MapPin className="text-slate-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="City or remote"
              className="w-full outline-none text-slate-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-70 text-yellow-300 px-8 py-3 rounded-xl font-semibold transition-all"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
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
            className="group text-yellow-400 font-semibold flex items-center transition-colors duration-300"
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
              onClick={() =>
                router.push(`/jobs?category=${encodeURIComponent(cat.name)}`)
              }
              className="p-6 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-300 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-lg text-slate-800">
                {cat.name}
              </h3>

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