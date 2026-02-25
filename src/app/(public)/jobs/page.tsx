"use client";

import React, { useEffect, useState } from "react";
import {
  Filter,
  MapPin,
  Search,
  XCircle,
  Bookmark,
  Send,
  ExternalLink,
  Share2,
  Briefcase,
  Building2,
  Wallet,
  Calendar,
} from "lucide-react";
import FlexibleMultiSelect from "@/src/components/common/MultiSelectFilter";
import { useRouter, useSearchParams  } from "next/navigation";
import api from "@/src/lib/axios";
import { Job } from "@/src/lib/apiInterface";

const OPTIONS = [
  { id: 1, name: "Full-time" },
  { id: "remote-01", name: "Remote" },
  { id: 3, name: "Contract" },
];

const SALARY_OPTIONS = [
  { id: "s1", name: "$1k - $3k" },
  { id: "s2", name: "$3k - $6k" },
  { id: "s3", name: "$6k - $10k" },
  { id: "s4", name: "$10k+" },
];

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedJobTypes, setSelectedJobTypes] = useState<any[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobTitle, setJobTitle] = useState(searchParams.get("job_title")??'');
  const [location, setLocation] = useState(searchParams.get("location")??"");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedSalaries([]);
  };

  const handleSearch = () => {
    if (!jobTitle.trim() && !location.trim()) return;

    setLoading(true);

    const params = new URLSearchParams();
    if (jobTitle.trim()) params.append("job_title", jobTitle.trim());
    if (location.trim()) params.append("location", location.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs", {
        params: {
          job_title: searchParams.get("job_title") || undefined,
          location: searchParams.get("location") || undefined,
          page: searchParams.get("page") || 1,
        },
      });

      console.log("Fetched Jobs:", response.data);

      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    searchParams.get("job_title"),
    searchParams.get("location"),
    searchParams.get("page"),
  ]);
      


  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans antialiased text-slate-600">
      <div className="top-0 z-50 bg-slate-900 py-4 ">
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="flex flex-col gap-5 md:flex-col md:items-center md:justify-between">
            <div className="bg-white p-0.2 rounded-2xl border-2 border-yellow-300 flex  flex-col md:flex-row gap-2 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <div className="flex-1 flex items-center px-1 py-1 border-b md:border-b-0 md:border-r border-slate-100 group">
                <Search
                  className="text-slate-400 group-focus-within:text-yellow-300 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Job title, keywords..."
                  className="w-full bg-transparent border-none outline-none px-3 text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-2 group">
                <MapPin
                  className="text-slate-400 group-focus-within:text-yellow-300 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Location or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-transparent border-none outline-none px-3 text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>
              <button
                className="bg-yellow-300 hover:bg-yellow-300 text-slate-900 px-10 py-3 rounded-xl font-black transition-all transform active:scale-95 shadow-md"
                onClick={handleSearch}
                disabled={loading}
              >
                Find Jobs
              </button>
            </div>

            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-2 text-yellow-300 text-[10px] font-black uppercase tracking-widest border-r border-slate-700 pr-4">
                <Filter size={14} /> Refine By
              </div>
              <div className="flex gap-3  pb-1">
                <div className="w-44">
                  <FlexibleMultiSelect
                    label=""
                    options={OPTIONS}
                    selectedValues={selectedJobTypes}
                    onChange={setSelectedJobTypes}
                    placeholder="Employment"
                  />
                </div>
                <div className="w-44">
                  <FlexibleMultiSelect
                    label=""
                    options={SALARY_OPTIONS}
                    selectedValues={selectedSalaries}
                    onChange={setSelectedSalaries}
                    placeholder="Salary Range"
                  />
                </div>
                {(selectedJobTypes.length > 0 ||
                  selectedSalaries.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-yellow-300 hover:text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <XCircle size={14} /> Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 flex-1 overflow-hidden">
        <div className="flex gap-8 h-[calc(100vh-250px)]">
          <div className="w-full md:w-[440px] overflow-y-auto pr-3 space-y-4 custom-scrollbar">
            <div className="flex justify-between items-end mb-2 px-1">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Live Openings ({jobs.length})
              </h2>
            </div>

            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`group p-6 rounded-[24px] border-2 cursor-pointer transition-all duration-300 relative ${
                  selectedJob?.id === job.id
                    ? "border-yellow-300 bg-white shadow-xl ring-1 ring-yellow-100"
                    : "border-transparent bg-white hover:border-slate-200 shadow-sm"
                }`}
              >
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all duration-500 ${selectedJob?.id === job.id ? "bg-yellow-300 scale-100" : "bg-transparent scale-0"}`}
                />

                <div className="flex justify-between items-start mb-3">
                  <h3
                    className={`text-lg font-black transition-colors ${selectedJob?.id === job.id ? "text-slate-900" : "text-slate-600 group-hover:text-yellow-600"}`}
                  >
                    {job.title}
                  </h3>
                  <button className="text-slate-300 hover:text-yellow-300 transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-4">
                  <Building2 size={14} className="text-yellow-300" />{" "}
                  {job?.company?.company_name}
                  <span className="text-slate-200">•</span>
                  <MapPin size={14} /> {job.country?.name}, {job.city?.name}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-900 text-yellow-300 rounded-md text-[10px] font-black uppercase tracking-tight">
                     {job.job_type}
                    </span>
                 
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-900 text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    View{" "}
                    <Send
                      size={12}
                      className="text-yellow-300 fill-yellow-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: JOB DETAIL */}
          <div className="hidden md:block flex-1 overflow-y-auto border border-slate-200 rounded-[32px] bg-white shadow-2xl relative custom-scrollbar">
            {selectedJob && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b-4 border-yellow-300 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                          {selectedJob.title}
                        </h1>
                      </div>
                      <div className="flex flex-wrap items-center gap-5 text-slate-500 font-bold text-sm">
                        <span className="flex items-center gap-1 hover:text-yellow-600 transition-colors cursor-pointer">
                          <Building2 size={16} className="text-yellow-300" />{" "}
                          {selectedJob?.company?.company_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} /> {selectedJob.country?.name}, {selectedJob.city?.name}
                        </span>
                        <span className="flex items-center gap-1 text-slate-900 font-black underline decoration-yellow-300 decoration-2 underline-offset-4">
                          <Wallet size={16} /> {selectedJob.salary_min && selectedJob.salary_max ? `${selectedJob.salary_min} - ${selectedJob.salary_max} ${selectedJob.currency}`: "Salary not disclosed"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <button className="bg-slate-900 hover:bg-yellow-300 hover:text-slate-900 text-yellow-300 px-10 py-4 rounded-2xl font-black text-sm transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-100 hover:shadow-yellow-50">
                        APPLY NOW
                      </button>
                      <div className="flex gap-2">
                        <button className="p-3 border border-slate-200 hover:border-yellow-300 hover:bg-yellow-50 rounded-xl text-slate-600 transition-all">
                          <Bookmark size={20} />
                        </button>
                        <button className="p-3 border border-slate-200 hover:border-yellow-300 hover:bg-yellow-50 rounded-xl text-slate-600 transition-all">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-12">
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      {
                        icon: <Calendar size={18} />,
                        label: "Posted",
                        val: selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : "N/A",
                        color: "text-yellow-600",
                      },
                      {
                        icon: <Briefcase size={18} />,
                        label: "Job Type",
                        val: selectedJob.job_type,
                        color: "text-slate-800",
                      },
                      {
                        icon: <Building2 size={18} />,
                        label: "Category",
                        val: selectedJob?.category?.name || "N/A",
                        color: "text-yellow-600",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-5 bg-slate-50 rounded-2xl border-b-2 border-slate-200 hover:border-yellow-300 transition-colors"
                      >
                        <div className={`${item.color} mb-2`}>{item.icon}</div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </p>
                        <p className="text-slate-900 font-bold">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <section>
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-yellow-300 rounded-full" />{" "}
                      Job Description
                    </h2>
                    <p className="text-slate-600 leading-[1.8] text-lg font-medium">
                      {selectedJob.description}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-yellow-300 rounded-full" />{" "}
                      Skills Required
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob?.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-5 py-2.5 bg-slate-900 text-yellow-300 rounded-xl text-xs font-black hover:bg-yellow-300 hover:text-slate-900 transition-all cursor-default"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
