"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Save, Loader2, Trash2, Briefcase, GraduationCap, Award, Link as LinkIcon, Phone } from "lucide-react";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";
import { LocationItem } from "@/src/lib/apiInterface";

export default function CandidateProfileForm() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // --- Profile State ---
  const [formData, setFormData] = useState({
    phone_number: "",
    address: "",
    country_id: "",
    city_id: "",
    open_to_work: true,
    expected_salary: "",
    skills: [] as number[], // Array of Skill IDs
    experiences: [] as any[],
    educations: [] as any[],
    projects: [] as any[],
  });

  // --- UI State ---
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    const initData = async () => {
      if (!hasMounted) return;
      setLoadingInitial(true);
      try {
        const countryRes = await api.get("/countries");
        setCountries(countryRes.data.data);
        
        // Fetch existing profile if it exists
        const profileRes = await api.get("/candidate-profile/me"); 
        if (profileRes.data.data) {
          const p = profileRes.data.data;
          setFormData({
            ...p,
            country_id: p.country_id?.toString() || "",
            city_id: p.city_id?.toString() || "",
          });
        }
      } catch (err) { console.error("Init error", err); }
      finally { setLoadingInitial(false); }
    };
    initData();
  }, [hasMounted]);

  // Fetch cities when country changes
  useEffect(() => {
    if (!formData.country_id || loadingInitial) return;
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await api.get(`/countries/${formData.country_id}/cities`);
        setCities(res.data.data);
      } finally { setLoadingCities(false); }
    };
    fetchCities();
  }, [formData.country_id, loadingInitial]);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrors({});
    
    const payload = new FormData();
    payload.append("phone_number", formData.phone_number);
    payload.append("country_id", formData.country_id);
    payload.append("city_id", formData.city_id);
    payload.append("expected_salary", formData.expected_salary);
    payload.append("open_to_work", formData.open_to_work ? "1" : "0");
    
    if (resumeFile) payload.append("resume", resumeFile);
    
    // Stringify nested arrays for Laravel
    payload.append("experiences", JSON.stringify(formData.experiences));
    payload.append("educations", JSON.stringify(formData.educations));
    payload.append("projects", JSON.stringify(formData.projects));

    try {
      // Logic: If profile exists use PUT spoofing, else POST
      payload.append("_method", "POST"); 
      await api.post("/candidate-profile", payload);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally { setIsSubmitting(false); }
  };

  // --- Dynamic Section Helpers ---
  const addExperience = () => {
    setFormData({ ...formData, experiences: [...formData.experiences, { job_title: "", company_name: "", start_date: "", is_current: false }] });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...formData.experiences];
    newExp[index][field] = value;
    setFormData({ ...formData, experiences: newExp });
  };

  // --- Styles (Matching your snippet) ---
  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[12px] disabled:opacity-50";
  const labelStyle = "text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-0.5 block";
  const cardStyle = "bg-white p-5 rounded-[24px] shadow-sm border border-slate-100";

  if (!hasMounted || loadingInitial) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-yellow-500" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Candidate <span className="text-yellow-500">Profile</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biological Data Sync</p>
          </div>
          <button onClick={handleSave} disabled={isSubmitting} className="bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg disabled:opacity-70">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? "Syncing..." : "Save Profile"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Bio */}
          <section className={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
               <Phone size={14} className="text-yellow-500" />
               <span className={labelStyle}>Basic Connectivity</span>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className={labelStyle}>Phone Number</label>
                <input name="phone_number" value={formData.phone_number} onChange={handleChange} className={inputStyle} placeholder="+00 000 000" />
                {errors.phone_number && <p className="text-[9px] text-red-500 font-bold mt-1">{errors.phone_number}</p>}
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>Country</label>
                <select name="country_id" value={formData.country_id} onChange={handleChange} className={inputStyle}>
                  <option value="">Select Territory</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>City</label>
                <select name="city_id" value={formData.city_id} onChange={handleChange} className={inputStyle} disabled={!formData.country_id || loadingCities}>
                  <option value="">{loadingCities ? "Mapping..." : "Select City"}</option>
                  {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Resume Upload */}
          <section className={cardStyle}>
            <label className={labelStyle}>Professional Dossier (Resume PDF)</label>
            <div className="mt-2 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-white hover:border-yellow-400 transition-all cursor-pointer relative">
               <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
               <div className="text-center">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                    {resumeFile ? resumeFile.name : "Drop PDF here or click to upload"}
                  </p>
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
              <button onClick={addExperience} className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all">
                + Add Experience
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.experiences.map((exp, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group">
                  <button onClick={() => setFormData({...formData, experiences: formData.experiences.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Job Title</label>
                      <input value={exp.job_title} onChange={(e) => updateExperience(i, 'job_title', e.target.value)} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Company</label>
                      <input value={exp.company_name} onChange={(e) => updateExperience(i, 'company_name', e.target.value)} className={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
              {formData.experiences.length === 0 && (
                <p className="text-[10px] text-center text-slate-400 font-bold py-4 italic">No experience records found in the swarm.</p>
              )}
            </div>
          </section>

          {/* Salary & Settings */}
          <section className={cardStyle}>
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className={labelStyle}>Expected Monthly Salary (USD)</label>
                   <input name="expected_salary" type="number" value={formData.expected_salary} onChange={handleChange} className={inputStyle} placeholder="5000" />
                </div>
                <div className="flex items-end pb-2">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input name="open_to_work" type="checkbox" checked={formData.open_to_work} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-200 accent-slate-900" />
                      <div>
                        <span className="text-[11px] font-black text-slate-900 uppercase">Open to Work</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Signal visibility to recruiters</p>
                      </div>
                   </label>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}