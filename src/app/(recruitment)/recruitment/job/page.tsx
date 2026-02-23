"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/src/lib/axios";
import { 
  Edit3, Trash2, MapPin, Search, Loader2, 
  Briefcase, Plus, AlertTriangle, MoreVertical, 
  User2
} from "lucide-react";
import Link from "next/link";

export default function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/my-job-postings");
      setJobs(res.data.data);
    } catch (err) {
      console.error("Hive sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/company-job-postings/${deleteId}`);
      setJobs(prev => prev.filter(j => j.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Extraction failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-yellow-500" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Terminal...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-700">
      
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-8 shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase">Delete Posting?</h2>
              <div className="flex gap-3 mt-8 w-full">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all">
                  {isDeleting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Job <span className="text-yellow-500">Postings</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Listing {filteredJobs.length} active recruitment signals</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              placeholder="Filter list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-yellow-400/20 focus:bg-white transition-all w-48 md:w-64"
            />
          </div>
          <Link 
            href="/recruitment/job/create" 
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-slate-900 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New Post
          </Link>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm tracking-tight leading-none mb-1">{job.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{job.employment_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                      <MapPin size={12} className="text-slate-300" />
                      {job.city?.name || "Remote"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black">
                      <User2 size={12} className="inline mr-1 mb-1" /> {job.applications?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/recruitment/job/edit/${job.id}`}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit Posting"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button 
                        onClick={() => setDeleteId(job.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Posting"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No data records found</p>
          </div>
        )}
      </div>
    </div>
  );
}