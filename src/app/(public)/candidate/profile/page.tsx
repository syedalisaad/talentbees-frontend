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
import { LocationItem } from "@/src/lib/apiInterface";
import DatePicker from "react-datepicker";

export default function CandidateProfileForm() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // --- Profile State ---
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

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);


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

        const profileRes = await api.get("/candidate-profile/me");
        if (profileRes.data.data) {
          const p = profileRes.data.data;
          setFormData({
            ...p,
            country_id: p.country_id?.toString() || "",
            city_id: p.city_id?.toString() || "",
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
    console.log("Payload before files:", resumeFile, photoFile, formData);

    if (resumeFile) payload.append("resume", resumeFile);
    if (photoFile) payload.append("photo", photoFile);

    payload.append("experiences", JSON.stringify(formData.experiences));
    payload.append("educations", JSON.stringify(formData.educations));
    payload.append("projects", JSON.stringify(formData.projects));
    payload.append("certifications", JSON.stringify(formData.certifications));

    try {
      payload.append("_method", "POST");
      await api.post("/candidate-profile", payload);
      // router.push("/candidate/profile");
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
          expiry_date: "",
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
  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
    // Create a local URL for the preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
              Candidate <span className="text-yellow-500">Profile</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Biological Data Sync
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSubmitting ? "Syncing..." : "Save Profile"}
          </button>
        </div>

        <div className="space-y-4">
          <section className={cardStyle}>
            <div className="flex items-center gap-2 mb-6">
              <Phone size={14} className="text-yellow-500" />
              <span className={labelStyle}>Basic Connectivity & Identity</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start mb-6 border-b border-slate-50 pb-6">
              {/* --- Profile Photo Upload Component --- */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  {profilePhotoPreview ? (
                    <img
                      src={profilePhotoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                      No Photo
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <label className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoChange(file);
                      }}
                    />
                  </label>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full shadow-sm border-2 border-white">
                  <Plus size={12} className="text-slate-900 stroke-[4px]" />
                </div>
              </div>

              {/* Identity Text */}
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Profile Avatar
                </h3>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-xs uppercase tracking-tight">
                  Upload a professional headshot. JPEG or PNG. Max 2MB. Your
                  photo helps build trust with potential employers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className={labelStyle}>Phone Number</label>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="+00 000 000"
                />
                {errors.phone_number && (
                  <p className="text-[9px] text-red-500 font-bold mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>Country</label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Territory</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>City</label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className={inputStyle}
                  disabled={!formData.country_id || loadingCities}
                >
                  <option value="">
                    {loadingCities ? "Mapping..." : "Select City"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>
                  Current Monthly Salary (USD)
                </label>
                <input
                  name="current_salary"
                  type="number"
                  value={formData.current_salary}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="5000"
                />
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>
                  Expected Monthly Salary (USD)
                </label>
                <input
                  name="expected_salary"
                  type="number"
                  value={formData.expected_salary}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="5000"
                />
              </div>
              <div className="flex items-end pb-2 col-span-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    name="open_to_work"
                    type="checkbox"
                    checked={formData.open_to_work}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg border-slate-200 accent-slate-900"
                  />
                  <div>
                    <span className="text-[11px] font-black text-slate-900 uppercase">
                      Open to Work
                    </span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      Signal visibility to recruiters
                    </p>
                  </div>
                </label>
              </div>
              <div className="col-span-12">
                <label className={labelStyle}>Cover Letter</label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.cover_letter && (
                  <p className="text-[9px] text-red-500 font-bold mt-1">
                    {errors.cover_letter}
                  </p>
                )}
              </div>
              <div className="col-span-12">
                              <label className={labelStyle}>Upload Resume (PDF only)</label>

              <div className="mt-2 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-white hover:border-yellow-400 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                    {resumeFile
                      ? resumeFile.name
                      : "Drop PDF here or click to upload"}
                  </p>
                </div>
              </div>
              </div>
            </div>
          </section>
          {/* Dynamic Experience Section */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-yellow-500" />
                <label className={`${labelStyle} !mb-0`}>Career History</label>
              </div>
              <button
                onClick={addExperience}
                className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {formData.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group"
                >
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        experiences: formData.experiences.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <label className={labelStyle}>Job Title</label>
                      <input
                        value={exp.job_title}
                        onChange={(e) =>
                          updateExperience(i, "job_title", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Company</label>
                      <input
                        value={exp.company_name}
                        onChange={(e) =>
                          updateExperience(i, "company_name", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={exp.is_current}
                          onChange={(e) =>
                            updateExperience(i, "is_current", e.target.checked)
                          }
                          className="w-5 h-5 rounded-lg border-slate-200 accent-slate-900"
                        />
                        <div>
                          <span className="text-[11px] font-black text-slate-900 uppercase">
                            Is current position
                          </span>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            Are you currently working in this role?
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Start Date</label>

                      <DatePicker
                        selected={parseDate(exp.start_date)}
                        onChange={(date) =>
                          updateExperience(i, "start_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>End Date</label>
                      <DatePicker
                        selected={parseDate(exp.end_date)}
                        onChange={(date) =>
                          updateExperience(i, "end_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>

                    <div className="col-span-4">
                      <label className={labelStyle}>Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(i, "description", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.experiences.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 font-bold py-4 italic">
                  No experience records found in the swarm.
                </p>
              )}
            </div>
          </section>

          {/* Dynamic Education Section */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-yellow-500" />
                <label className={`${labelStyle} !mb-0`}>
                  Education History
                </label>
              </div>
              <button
                onClick={addEducation}
                className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all"
              >
                + Add Education
              </button>
            </div>

            <div className="space-y-3">
              {formData.educations.map((edu, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group"
                >
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        educations: formData.educations.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <label className={labelStyle}>Degree</label>
                      <input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(i, "degree", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-6">
                      <label className={labelStyle}>Institution Name</label>
                      <input
                        value={edu.institution_name}
                        onChange={(e) =>
                          updateEducation(i, "institution_name", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Start Date</label>
                      <DatePicker
                        selected={parseDate(edu.start_date)}
                        onChange={(date) =>
                          updateEducation(i, "start_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>End Date</label>
                      <DatePicker
                        selected={parseDate(edu.end_date)}
                        onChange={(date) =>
                          updateEducation(i, "end_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.educations.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 font-bold py-4 italic">
                  No education records found in the swarm.
                </p>
              )}
            </div>
          </section>

          {/* Dynamic Certificaiton Section */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-yellow-500" />
                <label className={`${labelStyle} !mb-0`}>
                  Certification History
                </label>
              </div>
              <button
                onClick={addCertification}
                className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all"
              >
                + Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {formData.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group"
                >
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        certifications: formData.certifications.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <label className={labelStyle}>Title</label>
                      <input
                        value={cert.title}
                        onChange={(e) =>
                          updateCertification(i, "title", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>
                        issuing Organization Name
                      </label>
                      <input
                        value={cert.issuing_organization}
                        onChange={(e) =>
                          updateCertification(
                            i,
                            "issuing_organization",
                            e.target.value,
                          )
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Certificate ID</label>
                      <input
                        value={cert.certificate_id}
                        onChange={(e) =>
                          updateCertification(
                            i,
                            "certificate_id",
                            e.target.value,
                          )
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Link</label>
                      <input
                        value={cert.link}
                        onChange={(e) =>
                          updateCertification(i, "link", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Issue Date</label>
                      <DatePicker
                        selected={parseDate(cert.issue_date)}
                        onChange={(date) =>
                          updateCertification(i, "issue_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Expiry Date</label>
                      <DatePicker
                        selected={parseDate(cert.expiry_date)}
                        onChange={(date) =>
                          updateCertification(
                            i,
                            "expiry_date",
                            formatDate(date),
                          )
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`${inputStyle} pl-10 cursor-pointer hover:border-slate-300 focus:ring-2 focus:ring-yellow-400/20 w-full`}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.certifications.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 font-bold py-4 italic">
                  No certification records found in the swarm.
                </p>
              )}
            </div>
          </section>

          {/* Dynamic Project Section */}
          <section className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-yellow-500" />
                <label className={`${labelStyle} !mb-0`}>Project History</label>
              </div>
              <button
                onClick={addProject}
                className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all"
              >
                + Add Project
              </button>
            </div>

            <div className="space-y-3">
              {formData.projects.map((proj, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group"
                >
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        projects: formData.projects.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <label className={labelStyle}>Title</label>
                      <input
                        value={proj.title}
                        onChange={(e) =>
                          updateProject(i, "title", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>

                    <div className="col-span-4">
                      <label className={labelStyle}>Link</label>
                      <input
                        value={proj.link}
                        onChange={(e) =>
                          updateProject(i, "link", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className={labelStyle}>Issue Date</label>

                      <DatePicker
                        selected={parseDate(proj.issue_date)}
                        onChange={(date) =>
                          updateProject(i, "issue_date", formatDate(date))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Issue Date"
                        portalId="root-portal"
                        popperPlacement="bottom-start"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className={`
      ${inputStyle} 
      pl-10 
      cursor-pointer 
      hover:border-slate-300 
      focus:ring-2 
      focus:ring-yellow-400/20 
      w-full
    `}
                        calendarClassName="premium-calendar-popup"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className={labelStyle}>Description</label>
                      <textarea
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(i, "description", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.projects.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 font-bold py-4 italic">
                  No project records found in the swarm.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
