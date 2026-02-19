"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Eye, Edit3, Trash2, Search, Filter, 
  ChevronLeft, ChevronRight, PlusCircle, Briefcase 
} from "lucide-react";
import Link from "next/link";
import api from "@/src/lib/axios";
export default function RecruitmentJobList() {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // --- Axios Fetch Logic ---
  const fetchJobs = async (pageNumber: number) => {
    setLoading(true);
    try {
      // Axios makes the URL cleaner. Note: we don't need the full URL or manual headers anymore.
      const response = await api.get("/my-job-postings", {
        params: {
          page: pageNumber,
          per_page: 5,
          search: search,
        },
      });

      // Axios returns the actual data in 'response.data'
      const result = response.data;
      
      if (result.success) {
        setJobs(result.data);
        setMeta(result.meta);
      }
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  // Optional: Trigger fetch when user stops typing (Search)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page === 1) fetchJobs(1);
      else setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-full max-w-md focus-within:border-yellow-400 transition-all">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your swarms..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full"
          />
        </div>
        <Link href="/recruitment/job/create-job">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-yellow-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
             <PlusCircle size={14} /> Create New Job
           </button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Details</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicants</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Hive...</span>
                  </div>
                </td>
              </tr>
            ) : jobs.length > 0 ? (
              jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 group-hover:text-yellow-600 transition-colors">{job.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {job.category || 'General'} • Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      job.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <p className="text-xs font-black text-slate-900">{job.applicants_count || 0}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-yellow-600 rounded-lg transition-all"><Eye size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Edit3 size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center max-w-xs mx-auto">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                      <Briefcase size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">No job postings found</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1 mb-6">
                      Your hive is empty. Start recruiting specialists by creating your first job posting.
                    </p>
                    <Link href="/recruitment/job/create-job">
                      <button className="px-6 py-3 bg-yellow-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 shadow-lg shadow-yellow-400/20 transition-all flex items-center gap-2">
                        <PlusCircle size={14} /> Create Your First Swarm
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {jobs.length > 0 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Showing Page {meta.current_page} of {meta.last_page} ({meta.total} Total)
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={meta.current_page === 1}
                className="p-2 text-slate-400 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, meta.last_page))}
                disabled={meta.current_page === meta.last_page}
                className="p-2 text-slate-400 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}