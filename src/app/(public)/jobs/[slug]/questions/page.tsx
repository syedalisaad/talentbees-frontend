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
import { Job, LocationItem, ScreeningQuestion } from "@/src/lib/apiInterface";
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
    screening_answers: [] as any[],
  });

  // --- UI State ---
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchJob = async (jobSlug: String) => {
    try {
      setLoading(true);
      const response = await api.get(`/job-by-slug/${jobSlug}`);
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

  const handleSave = async () => {
    setErrors({});

    const newErrors: Record<string, string> = {};

    job?.screening_questions?.forEach((question: ScreeningQuestion, index:any) => {
      const answer = formData.screening_answers[index]?.value;

      if (question.is_required && (!answer || answer === "")) {
        newErrors[`question_${question.id}`] = "This question is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please answer all required questions");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/apply-job", {
        screening_answers: formData.screening_answers,
        company_job_posting_id :job?.id
      });
      router.push('/jobs/')
      toast.success("Job applied successfully!");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      if(err.response.status==403){
            toast.error(err.response.data.message);

      }

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionChange = (index: number, id: number, value: string) => {
    const updatedQuestions = [...formData.screening_answers];
    updatedQuestions[index] = { id: id, value: value };
    setFormData({ ...formData, screening_answers: updatedQuestions });
  };

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[12px] disabled:opacity-50";
  const labelStyle =
    "text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-0.5 block";
  const cardStyle =
    "bg-white p-5 rounded-[24px] shadow-sm border border-slate-100";

  if (loading)
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
        {job?.screening_questions?.map((question: ScreeningQuestion, index:any) => {
          return (
            <div className="mb-4" key={index}>
              <label className={labelStyle}>{question.question}</label>

              {question.field_type === "text" && (
                <input
                  type="text"
                  className={inputStyle}
                  required={question.is_required}
                  value={formData.screening_answers[index]?.value || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, question.id, e.target.value)
                  }
                />
              )}

              {question.field_type === "number" && (
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.screening_answers[index]?.value || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, question.id, e.target.value)
                  }
                />
              )}

              {question.field_type === "boolean" && (
                <select
                  className={inputStyle}
                  value={formData.screening_answers[index]?.value || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, question.id, e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              )}
              {errors[`question_${question.id}`] && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors[`question_${question.id}`]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
