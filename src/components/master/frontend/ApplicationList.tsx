"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/src/lib/axios";
import { Search, Loader2, ChevronLeft, ChevronRight, View } from "lucide-react";
import { Candidate, Job, Language, Skill } from "@/src/lib/apiInterface";
import CandidateViewModal from "./CandidateViewModal";
import SkillMultiSelect from "./SkillMultiSelect";

export default function ApplicationList({ jobId }: { jobId: number }) {
  const [job, setJob] = useState<Job>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectSkillSearch, setSelectSkillSearch] = useState<string[]>([]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reload, setReload] = useState(false);

  const itemsPerPage = 10;

  const fetchJobs = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get(`/job-applicant/${jobId}`, {
        params: {
          search: searchTerm,
          page: currentPage,
          searchSkill: selectSkillSearch,
          per_page: itemsPerPage,
        },
      });

      setCandidates(res.data.data || []);
      setTotalPages(res.data.meta?.last_page || 1);
      setTotalItems(res.data.meta?.total || 0);

      if (res.data.data?.length) {
        setJob(res.data.data[0].job_posting);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, selectSkillSearch, jobId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchJobs, reload]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const statusConfig: Record<string, string> = {
    applied: "bg-blue-50 text-blue-600 border-blue-100",
    shortlisted: "bg-purple-50 text-purple-600 border-purple-100",
    interviewing: "bg-yellow-50 text-yellow-600 border-yellow-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
    hired: "bg-green-50 text-green-600 border-green-100",
    withdrawn: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const viewCandidateProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-700">
      <CandidateViewModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateSuccess={() => {
          setReload((prev) => !prev);
          setIsModalOpen(false);
        }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            Applicant <span className="text-yellow-500">List</span>
          </h1>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Job Title: {job?.title} | Total Candidates {totalItems}
          </p>
        </div>

        {/* Search + Skill Filter */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <input
              type="text"
              placeholder="Search candidate..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-yellow-400/20 focus:bg-white transition-all w-48 md:w-64"
            />
          </div>

          {/* Skills Filter */}
          <SkillMultiSelect
            skills={job?.skills || []}
            onChange={(values) => {
              setSelectSkillSearch(values);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-500" size={30} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Candidate
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Skills
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Languages
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Applied
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Salary
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>

                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-5 font-bold text-sm">
                    {candidate?.candidate?.name}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {candidate?.candidate?.candidate_profile?.skills?.map(
                        (skill: Skill) => (
                          <span
                            key={skill.id}
                            className="bg-yellow-200 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded"
                          >
                            {skill.name}
                          </span>
                        ),
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {candidate?.candidate?.candidate_profile?.languages?.map(
                        (language: Language) => (
                          <span
                            key={language.id}
                            className="bg-yellow-200 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded"
                          >
                            {language.name}
                          </span>
                        ),
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                    {new Date(candidate.created_at).toDateString()}
                  </td>

                  <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                    {candidate?.candidate?.candidate_profile?.expected_salary}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded border capitalize font-extrabold ${
                        statusConfig[candidate.status] || ""
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => viewCandidateProfile(candidate)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <View size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {candidates.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              No data records found
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2"
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
