"use client";

import React from "react";
import { 
  MoreVertical, 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";

const jobs = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    category: "Engineering",
    applicants: 42,
    newApplicants: 12,
    status: "Active",
    postedDate: "Oct 24, 2025",
    salary: "$120k - $150k",
  },
  {
    id: "2",
    title: "UI/UX Product Designer",
    category: "Design",
    applicants: 28,
    newApplicants: 0,
    status: "Draft",
    postedDate: "Oct 22, 2025",
    salary: "$90k - $110k",
  },
  {
    id: "3",
    title: "DevOps Specialist",
    category: "Infrastructure",
    applicants: 15,
    newApplicants: 3,
    status: "Closed",
    postedDate: "Oct 15, 2025",
    salary: "$130k - $160k",
  },
];

export default function RecruitmentJobList() {
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-full max-w-md focus-within:border-yellow-400 transition-all">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your swarms..." 
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Details</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicants</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Salary Range</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* Title & Category */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                      {job.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {job.category} • Posted {job.postedDate}
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    job.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                    job.status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {job.status}
                  </span>
                </td>

                {/* Applicants Counter */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600">
                      <Users size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-none">{job.applicants}</p>
                      {job.newApplicants > 0 && (
                        <p className="text-[9px] font-bold text-green-500 mt-1">+{job.newApplicants} NEW</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Salary */}
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-600">{job.salary}</span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button title="View Applicants" className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all">
                      <Eye size={16} />
                    </button>
                    <button title="Edit" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button title="Delete" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Placeholder */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Showing 3 of {jobs.length} Swarms</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-[10px] font-black border border-slate-200 rounded-lg disabled:opacity-50" disabled>PREV</button>
            <button className="px-3 py-1 text-[10px] font-black border border-slate-200 rounded-lg">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
}