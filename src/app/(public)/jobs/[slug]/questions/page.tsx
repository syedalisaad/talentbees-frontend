"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Save,
  Loader2,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Phone,
  Camera,
} from "lucide-react";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";
import { Job, LocationItem } from "@/src/lib/apiInterface";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

export default function jobQuestions({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);

  const [hasMounted, setHasMounted] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: "",
    cover_letter: "",
    address: "",
    country_id: "",
    city_id: "",
    open_to_work: true,
    expected_salary: "",
    current_salary: "",
    skills: [] as number[],
    experiences: [] as any[],
    educations: [] as any[],
    projects: [] as any[],
    certifications: [] as any[],
  });

  // --- UI State ---
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [questionAnswers, setQuestionAnswers] = useState<Record<number, any>>({});

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchJob = async (jobSlug: String) => {
    try {
      setLoading(true);

      const response = await api.get(`/job-by-slug/${jobSlug}`);
      console.log(response);

      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob(resolvedParams.slug);
  }, [resolvedParams.slug]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const initData = async () => {
      if (!hasMounted) return;
      setLoadingInitial(true);
      try {
        const countryRes = await api.get("/countries");
        setCountries(countryRes.data.data);

        const CandidateProfileRes = await api.get("/candidate-profile-me");
        if (CandidateProfileRes.data.data) {
          const CandidateProfile = CandidateProfileRes.data.data;
          setProfilePhotoPreview(CandidateProfile.profile_photo_url || null);
          setResumePreview(CandidateProfile.active_resume.resume_url || null);
          setFormData({
            ...CandidateProfile,
            country_id: CandidateProfile.country_id?.toString() || "",
            city_id: CandidateProfile.city_id?.toString() || "",
          });
        }
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    initData();
  }, [hasMounted]);

  useEffect(() => {
    if (!formData.country_id || loadingInitial) return;
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await api.get(`/countries/${formData.country_id}/cities`);
        setCities(res.data.data);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.country_id, loadingInitial]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const parseDate = (dateString?: string) => {
    return dateString ? new Date(dateString) : null;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrors({});

    const payload = new FormData();
    payload.append("phone_number", formData.phone_number);
    payload.append("cover_letter", formData.cover_letter);
    payload.append("country_id", formData.country_id);
    payload.append("city_id", formData.city_id);
    payload.append("expected_salary", formData.expected_salary);
    payload.append("current_salary", formData.current_salary);
    payload.append("open_to_work", formData.open_to_work ? "1" : "0");

    if (resumeFile) payload.append("resume", resumeFile);
    if (photoFile) payload.append("profile_photo_path", photoFile);
    payload.append("experiences", JSON.stringify(formData.experiences));
    payload.append("educations", JSON.stringify(formData.educations));
    payload.append("projects", JSON.stringify(formData.projects));
    payload.append("certifications", JSON.stringify(formData.certifications));

    try {
      payload.append("_method", "POST");
      await api.post("/candidate-profile", payload);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        {
          job_title: "",
          company_name: "",
          start_date: "",
          end_date: "",
          description: "",
          is_current: false,
        },
      ],
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: "", description: "", link: "" },
      ],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      educations: [
        ...formData.educations,
        {
          degree: "",
          institution_name: "",
          start_date: "",
          end_date: "",
        },
      ],
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          title: "",
          issuing_organization: "",
          certificate_id: "",
          issue_date: "",
          link: "",
        },
      ],
    });
  };
  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...formData.experiences];
    newExp[index][field] = value;
    setFormData({ ...formData, experiences: newExp });
  };
  const updateEducation = (index: number, field: string, value: any) => {
    const newEdu = [...formData.educations];
    newEdu[index][field] = value;
    setFormData({ ...formData, educations: newEdu });
  };
  const updateCertification = (index: number, field: string, value: any) => {
    const newCert = [...formData.certifications];
    newCert[index][field] = value;
    setFormData({ ...formData, certifications: newCert });
  };
  const updateProject = (index: number, field: string, value: any) => {
    const newProj = [...formData.projects];
    newProj[index][field] = value;
    setFormData({ ...formData, projects: newProj });
  };


  const handleQuestion = (job: Job) => {
    router.push(`${job.slug}/questions`);
  };
  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[12px] disabled:opacity-50";
  const labelStyle =
    "text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-0.5 block";
  const cardStyle =
    "bg-white p-5 rounded-[24px] shadow-sm border border-slate-100";

  if (!hasMounted || loadingInitial)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-yellow-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Job <span className="text-yellow-500">Questions</span>
              </h1>
             
            </div>

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-yellow-300 hover:bg-slate-900 hover:text-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Applied job"
            )}
          </button>
        </div>
        {job?.screening_questions?.map((question, index) => {
  return (
    <div className="mb-4" key={question.id}>
      <label className={labelStyle}>
        {question.question}
      </label>

      {question.field_type === "text" && (
        <input
          type="text"
          className={inputStyle}
          value={questionAnswers[question.id] || ""}
          onChange={(e) =>
            handleQuestionChange(question.id, e.target.value)
          }
        />
      )}

      {question.field_type === "number" && (
        <input
          type="number"
          className={inputStyle}
          value={questionAnswers[question.id] || ""}
          onChange={(e) =>
            handleQuestionChange(question.id, e.target.value)
          }
        />
      )}

      {question.field_type === "boolean" && (
        <select
          className={inputStyle}
          value={questionAnswers[question.id] || ""}
          onChange={(e) =>
            handleQuestionChange(question.id, e.target.value)
          }
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )}
    </div>
  );
})}
             
        
      </div>
    </div>
  );
}
