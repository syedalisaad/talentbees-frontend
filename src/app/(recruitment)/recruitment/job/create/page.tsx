"use client";

import React, { useEffect, useState } from "react";
import { Plus, X, Save, Currency } from "lucide-react";
import { Job, LocationItem } from "@/src/lib/apiInterface";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";

const CURRENCIES = [
  "USD", // US Dollar
  "EUR", // Euro
  "GBP", // British Pound
  "JPY", // Japanese Yen
  "CNY", // Chinese Yuan
  "AUD", // Australian Dollar
  "CAD", // Canadian Dollar
  "CHF", // Swiss Franc
  "AED", // UAE Dirham
  "SAR", // Saudi Riyal
  "PKR", // Pakistani Rupee
  "INR", // Indian Rupee
  "SGD", // Singapore Dollar
  "HKD", // Hong Kong Dollar
  "NZD", // New Zealand Dollar
  "TRY", // Turkish Lira
  "ZAR", // South African Rand
  "SEK", // Swedish Krona
  "NOK", // Norwegian Krone
  "KRW", // South Korean Won
];
export default function PostJobForm({ jobId }: { jobId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Job>({
    title: "",
    category_name: "",
    job_type: "",
    country_id: 0,
    city_id: 0,
    is_remote: false,
    salary_max: 0,
    salary_min: 0,
    description: "",
    skills: [],
    languages: [],
    screening_questions: [],
  });
  const [hasMounted, setHasMounted] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      let response;
      if (jobId) {
        response = await api.put(`/company-job-postings/${jobId}`, formData);
      } else {
        response = await api.post("/company-job-postings", formData);
      }

      router.push("/recruitment/job");
    } catch (err: any) {
      console.error("Submission error:", err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (jobId && hasMounted) {
      const fetchJobData = async () => {
        try {
          const res = await api.get(`/company-job-postings/${jobId}`);
          console.log("Fetched job data for editing:", res.data.data);
          let data = res.data.data;
          data["category_name"] = data.category?.name || "";
          setFormData(res.data.data);
        } catch (err) {
          console.error("Failed to load job data for editing");
        }
      };
      fetchJobData();
    }
  }, [jobId, hasMounted]);

  const addQuestion = () => {
    setFormData({
      ...formData,
      screening_questions: [
        ...formData.screening_questions,
        { question: "", field_type: "text" },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      screening_questions: formData.screening_questions.filter(
        (_, i) => i !== index,
      ),
    });
  };
  useEffect(() => {
    const initData = async () => {
      if (!hasMounted) return;
      setLoadingInitial(true);
      try {
        const response = await api.get("/countries");
        setCountries(response.data.data);
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    initData();
  }, [hasMounted]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!hasMounted || !formData.country_id) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      try {
        const res = await api.get(`/countries/${formData.country_id}/cities`);
        setCities(res.data.data);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.country_id, hasMounted]);
  useEffect(() => {
    setHasMounted(true);
  }, []);

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
) => {
  const { name, value, type } = e.target;

  // 1. Handle Checkboxes
  if (type === "checkbox") {
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: checked });
    return;
  }

  // 2. Handle Salary/Numeric Pattern fields (Strip commas and non-digits)
  if (name === "salary_min" || name === "salary_max") {
    const rawValue = value.replace(/\D/g, ""); // Removes everything except 0-9
    setFormData({ 
      ...formData, 
      [name]: rawValue === "" ? 0 : Number(rawValue) 
    });
    return;
  }

  // 3. Handle Standard Numeric inputs (if any use type="number")
  if (type === "number") {
    setFormData({ ...formData, [name]: value === "" ? 0 : Number(value) });
    return;
  }

  // 4. Handle Default (Strings, Selects, Textareas)
  setFormData({ ...formData, [name]: value });
};

  const addSkill = () => {
    const trimmed = skillInput.trim();
    // Check if it's not empty and not already in the list
    if (
      trimmed &&
      !formData.skills.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { id: Date.now(), name: trimmed }],
      });
      setSkillInput("");
    }
  };

  const addLanguage = () => {
    const trimmed = langInput.trim();
    if (
      trimmed &&
      !formData.languages.some(
        (l) => l.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setFormData({
        ...formData,
        languages: [...formData.languages, { id: Date.now(), name: trimmed }],
      });
      setLangInput("");
    }
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.screening_questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, screening_questions: updatedQuestions });
  };

  const ValidationError = ({
    errors,
    field,
  }: {
    errors: any;
    field: string;
  }) => {
    if (!errors || !errors[field]) return null;
    return (
      <span className="text-[10px] font-bold text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
        {errors[field][0]}
      </span>
    );
  };

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[12px]";

  const labelStyle =
    "text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-0.5 block";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            {jobId ? "Edit " : "New "}
            <span className="text-yellow-500">Job</span>
          </h1>

          <button
            onClick={() => handleSubmit()}
            className="bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white px-4 py-2 rounded-lg font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
          >
            <Save size={14} /> Publish
          </button>
        </div>
        <div className="flex flex-col gap-4 ml-6 w-full flex-1 ">
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <label className={labelStyle}>Job Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  className={inputStyle}
                />
                <ValidationError errors={fieldErrors} field="title" />
              </div>

              <div className="col-span-4">
                <label className={labelStyle}>Category</label>
                <input
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                  type="text"
                  className={inputStyle}
                />
                <ValidationError errors={fieldErrors} field="category_name" />
              </div>
            </div>

            {/* Type / Country / City */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className={labelStyle}>Job Type</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="full-time">Full-Time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-Time</option>
                  <option value="internship">Internship</option>
                </select>
                <ValidationError errors={fieldErrors} field="job_type" />
              </div>

              <div>
                <label className={labelStyle}>Country</label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Territory</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <ValidationError errors={fieldErrors} field="country_id" />
              </div>

              <div>
                <label className={labelStyle}>City</label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  disabled={!formData.country_id || loadingCities}
                  className={inputStyle}
                >
                  <option value="">
                    {loadingCities ? "Locating..." : "Select City"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <ValidationError errors={fieldErrors} field="city_id" />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_remote"
                    checked={formData.is_remote}
                    onChange={handleChange}
                  />
                  <span className="text-[10px] font-black uppercase">
                    Remote
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
                {/* Min Salary */}
                <div className="col-span-4">
                  <label className={labelStyle}>Min Salary</label>
                  <div className="relative">
                    <input
                      name="salary_min"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      // Show commas in the UI, but keep raw number in state
                      value={
                        formData.salary_min === 0
                          ? ""
                          : formData.salary_min.toLocaleString()
                      }
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* Max Salary */}
                <div className="col-span-4">
                  <label className={labelStyle}>Max Salary</label>
                  <div className="relative">
                    <input
                      name="salary_max"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={
                        formData.salary_max === 0
                          ? ""
                          : formData.salary_max.toLocaleString()
                      }
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                {/* Currency (keeping your existing col-span-4 for the select) */}
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>Currency</label>

                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Currency</option>
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`${inputStyle} resize-none`}
              />
            </div>
            <ValidationError errors={fieldErrors} field="description" />
          </section>
          <div className="flex gap-2">
            <section className="flex-1 min-w-[400px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              {" "}
              <label className={labelStyle}>Skills</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Please add skills and press enter..."
                  className={inputStyle}
                />
                <Plus
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <ValidationError errors={fieldErrors} field="skills" />
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.skills?.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-yellow-200 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1"
                  >
                    {skill.name}
                    <X
                      size={8}
                      className="cursor-pointer text-slate-900"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter(
                            (s) => s.id !== skill.id,
                          ),
                        })
                      }
                    />
                  </span>
                ))}
              </div>
            </section>

            <section className="flex-1 min-w-[400px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              {" "}
              <label className={labelStyle}>Languages</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                  placeholder="Enter language (English, French, Spanish) and press enter..."
                  className={inputStyle}
                />
                <Plus
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <ValidationError errors={fieldErrors} field="languages" />
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.languages?.map((lang) => (
                  <span
                    key={lang.id}
                    className="bg-yellow-200 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1"
                  >
                    {lang.name}
                    <X
                      size={8}
                      className="cursor-pointer text-slate-900"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          languages: formData.languages.filter(
                            (l) => l.id !== lang.id,
                          ),
                        })
                      }
                    />
                  </span>
                ))}
              </div>
            </section>
          </div>
          <section className="flex-1 min-w-[400px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            {" "}
            <div className="flex items-center justify-between mb-3">
              <label className={labelStyle}>Screening Questions</label>
              <button
                type="button"
                onClick={addQuestion}
                className="text-[9px] font-black uppercase tracking-widest bg-slate-100 hover:bg-yellow-400 px-3 py-1 rounded-md transition-all flex items-center gap-1"
              >
                <Plus size={10} /> Add Question
              </button>
            </div>
            <div className="space-y-2">
              {formData.screening_questions.map((q, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-end bg-slate-50 p-2 rounded-xl border border-slate-100"
                >
                  <div className="flex-[3]">
                    <label className="text-[8px] font-bold uppercase text-slate-400 mb-1 block">
                      Question
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(index, "question", e.target.value)
                      }
                      placeholder="e.g. How many years of experience do you have?"
                      className={inputStyle}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[8px] font-bold uppercase text-slate-400 mb-1 block">
                      Response Type
                    </label>
                    <select
                      value={q.field_type}
                      onChange={(e) =>
                        updateQuestion(index, "field_type", e.target.value)
                      }
                      className={inputStyle}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="boolean">Yes/No (Radio)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {formData.screening_questions.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    No screening questions added
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
