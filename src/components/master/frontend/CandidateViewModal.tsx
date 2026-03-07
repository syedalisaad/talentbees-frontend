import React, { useState } from "react";
import {
  X,
  GraduationCap,
 
  Phone,
  MapPin,
  ExternalLink,
  FileText,

  Trophy,
  ArchiveIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Candidate } from "@/src/lib/apiInterface";
import Image from "next/image";
import api from "@/src/lib/axios";

interface Props {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess?: (newStatus: string) => void; // Callback to update parent UI
}

export default function CandidateViewModal({
  candidate,
  isOpen,
  onClose,
  onUpdateSuccess,
}: Props) {
  if (!candidate || !isOpen) return null;
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(candidate?.status);

  const profile = candidate?.candidate?.candidate_profile;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);

    try {
      await api.patch(`/candidates/${candidate.id}/status`, {
        status: newStatus,
      });

      setCurrentStatus(newStatus as any);
      if (onUpdateSuccess) onUpdateSuccess(newStatus);
      
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };
  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      hired: "bg-emerald-50 text-emerald-600 border-emerald-100",
      rejected: "bg-rose-50 text-rose-600 border-rose-100",
      interviewing: "bg-blue-50 text-blue-600 border-blue-100",
      shortlisted: "bg-purple-50 text-purple-600 border-purple-100",
      applied: "bg-amber-50 text-amber-600 border-amber-100",
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  const statusConfig = {
  applied: { color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  shortlisted: { color: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  interviewing: { color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  hired: { color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { color: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  withdrawn: { color: "bg-slate-500", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
};

// Inside your component:
const current = statusConfig[candidate.status as keyof typeof statusConfig] || statusConfig.applied;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center font-black text-slate-900 overflow-hidden border-2 border-white shadow-md shrink-0">
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl">
                  {candidate?.candidate?.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                {candidate?.candidate?.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Application
                </span>
              </div>
            </div>
          </div>

          {/* --- STATUS SELECTOR (Right Side) --- */}
          <div className="flex flex-col items-start gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] font-extrabold">
              Status
            </span>
            <div className="relative group ">
              {/* Overlay Loader */}
              {isUpdating && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 rounded-full">
                  <Loader2 size={14} className="animate-spin text-slate-900" />
                </div>
              )}

              <select
                disabled={isUpdating}
                onChange={handleStatusChange}
                defaultValue={currentStatus}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer appearance-none"
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>

              <div
                className={`
                relative z-10 flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all
                ${getStatusStyles(currentStatus || "applied")}
                group-hover:border-slate-300 group-hover:bg-white
              `}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {currentStatus}
                </span>
                <ChevronDown size={14} strokeWidth={3} className="opacity-50" />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-900 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Basic Info Grid */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} /> Contact
              </p>
              <p className="text-sm font-bold text-slate-700">
                {profile?.phone_number}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Location
              </p>
              <p className="text-sm font-bold text-slate-700">
                {profile?.country ? profile?.country?.name + "," : ""}{" "}
                {profile?.city?.name}
              </p>
            </div>
          </section>

          {/* Skills & Languages */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((s) => (
                <span
                  key={s.id}
                  className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase"
                >
                  {s.name}
                </span>
              ))}
            </div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.languages?.map((l) => (
                <span
                  key={l.id}
                  className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-3 py-1 rounded-md uppercase"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Work Experience
            </h3>
            {profile?.experiences?.length ? (
              profile?.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="relative pl-6 border-l border-slate-100 pb-6 last:pb-0"
                >
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-yellow-400" />
                  <p className="text-sm font-black text-slate-800 uppercase">
                    {exp.job_title}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                    {exp.company_name} •{" "}
                    {new Date(exp.start_date).toDateString()} -{" "}
                    {new Date(exp.end_date).toDateString() || "Present"}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                No experience added.
              </p>
            )}
          </section>

          {/* Education */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Education
            </h3>
            {profile?.educations?.length ? (
              profile?.educations.map((edu, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <GraduationCap size={18} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase">
                      {edu.degree}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      {edu.institution_name} •{" "}
                      {new Date(edu.start_date).toDateString()} -{" "}
                      {new Date(edu.end_date).toDateString() || "Present"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                No education added.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Certification
            </h3>
            {profile?.certifications?.length ? (
              profile.certifications.map((cert, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Trophy size={18} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase">
                      {cert?.title}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      {cert?.issuing_organization} •{" "}
                      {new Date(cert.issue_date).toDateString()}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      {cert?.certificate_id}
                    </p>
                    {cert?.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
      inline-flex items-center justify-center gap-2
      px-4 py-2 w-fit
      bg-slate-900 text-white 
      rounded-lg font-black text-[9px] uppercase tracking-widest 
      hover:bg-yellow-400 hover:text-slate-900 
      active:scale-95 transition-all duration-200
    "
                      >
                        <ExternalLink size={12} strokeWidth={3} />
                        <span>View Certification</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                No certification added.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
              Project
            </h3>
            {profile?.projects?.length ? (
              profile?.projects.map((project, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <ArchiveIcon size={18} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase">
                      {project?.title}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      {project?.description}
                    </p>

                    {project?.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
      inline-flex items-center justify-center gap-2
      px-4 py-2 w-fit
      bg-slate-900 text-white 
      rounded-lg font-black text-[9px] uppercase tracking-widest 
      hover:bg-yellow-400 hover:text-slate-900 
      active:scale-95 transition-all duration-200
    "
                      >
                        <ExternalLink size={12} strokeWidth={3} />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                No certification added.
              </p>
            )}
          </section>

          {/* Cover Letter / Bio */}
          {profile?.cover_letter && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-yellow-400 pl-3">
                Cover Letter
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-slate-600 text-sm leading-loose">
                "{profile?.cover_letter}"
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-slate-50 flex gap-3">
          <a
            href={profile?.active_resume?.resume_url}
            target="_blank"
            className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-400 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
          >
            <FileText size={16} /> View Resume
          </a>
        </div>
      </div>
    </div>
  );
}
