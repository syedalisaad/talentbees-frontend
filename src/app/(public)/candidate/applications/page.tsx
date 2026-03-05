"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Briefcase, 
  Loader2,
  Clock,
  Inbox
} from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function MyApplicationList() {
  const [candidate, setCandidate] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  // 1. Fetch function handling both Search and Pagination
  const fetchMyApplications = async (targetPage = 1, query = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/my-applications`, {
        params: {
          search: query,
          page: targetPage,
          per_page: 10
        }
      });
      
      // Matches your Laravel response: response.data.data
      setCandidate(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      fetchMyApplications(1, search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // 3. Page Change Handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchMyApplications(newPage, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusConfig: Record<string, string> = {
    applied: "bg-blue-50 text-blue-600 border-blue-100",
    shortlisted: "bg-purple-50 text-purple-600 border-purple-100",
    interviewing: "bg-yellow-50 text-yellow-600 border-yellow-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
    hired: "bg-green-50 text-green-600 border-green-100",
    withdrawn: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My <span className="text-yellow-500">Applications</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Biological Data Sync & Career Tracker
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search by job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-2 border-slate-100 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/5 transition-all w-full md:w-72 shadow-sm"
            />
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="space-y-4">
          <section className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <Loader2 className="animate-spin text-yellow-500 mb-4" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying the Hive...</p>
            </div>
          ) : candidate.length > 0 ? (
            <>
              {candidate.map((app) => (
                <div 
                  key={app.id} 
                  className="group mb-2 bg-white border border-slate-300 rounded-2xl p-5 hover:border-yellow-300 hover:shadow-xl hover:shadow-yellow-400/10 transition-all active:scale-[0.99]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all duration-300">
                        <Briefcase size={26} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">
                          {app.job_posting?.title || "Position Title Unavailable"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <Clock size={14} className="text-slate-300" /> Applied {new Date(app.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <MapPin size={14} className="text-slate-300" /> {app.job_posting?.location || "Remote / Global"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className={`
                        px-5 py-2 rounded-full border-2 text-[10px] font-black uppercase tracking-widest
                        ${statusConfig[app.status] || statusConfig.applied}
                      `}>
                        {app.status}
                      </div>
                      
                      <Link 
                        href={`/jobs/${app.job_posting?.slug}`}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-slate-400 transition-all"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* PAGINATION CONTROLS */}
              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-20 hover:border-yellow-400 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(meta.last_page)].map((_, i) => {
                      const pageNum = i + 1;
                      // Logic to show limited page numbers if you have many pages
                      if (meta.last_page > 7 && Math.abs(pageNum - page) > 2 && pageNum !== 1 && pageNum !== meta.last_page) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all border-2 
                            ${page === pageNum 
                              ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                              : "bg-white border-transparent text-slate-400 hover:border-slate-200"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === meta.last_page}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 disabled:opacity-20 hover:border-yellow-400 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                <Inbox size={32} />
              </div>
              <p className="text-sm font-bold text-slate-900">No applications found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">We couldn't find any job applications matching your criteria.</p>
              <Link href="/jobs" className="mt-6 px-6 py-2 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/20">
                Explore Jobs
              </Link>
            </div>
          )}
          </section>
        </div>
        
      </div>
      
    </div>
  );
}