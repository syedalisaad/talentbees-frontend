"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Briefcase, 
  Loader2,
  Clock
} from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function MyApplicationList() {
  const [candidate, setCandidate] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  const fetchMyApplications = async (query = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/my-applications`,{
        params:{
          search:search
        }
      });
      setCandidate(response.data.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);
  useEffect(() => {
    fetchMyApplications();
  }, [search]);

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
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My <span className="text-yellow-500">Applications</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tracking your career progress
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search by job title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="bg-white border-2 border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-yellow-400 transition-all w-full md:w-64"
            />
          </div>
        </div>

        {/* APPLICATIONS LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Loader2 className="animate-spin text-yellow-500 mb-4" size={32} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Hive Data...</p>
            </div>
          ) : candidate.length > 0 ? (
            candidate.map((app) => (
              <div 
                key={app.id} 
                className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-yellow-300 hover:shadow-xl hover:shadow-yellow-400/5 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                        {app.job_posting?.title || "Untitled Position"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <Clock size={14} /> Applied {new Date(app.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <MapPin size={14} /> {app.job_posting?.location || "Remote"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    {/* STATUS BADGE */}
                    <div className={`
                      px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest
                      ${statusConfig[app.status] || statusConfig.applied}
                    `}>
                      {app.status}
                    </div>
                    
                    <Link 
                      href={`/jobs/${app.job_posting?.slug}`}
                      className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No applications found.</p>
              <Link href="/jobs" className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mt-2 block hover:underline">
                Explore Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}