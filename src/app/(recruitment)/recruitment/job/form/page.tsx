"use client";

import React, { useState } from "react";
import { Globe2, Plus, X, Save } from "lucide-react";

export default function PostJobForm() {
  const [formData, setFormData] = useState({
    skills: [] as string[],
    languages: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const addSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput("");
    }
  };

  // Common styles for ultra-compact UI
  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[12px] placeholder:font-normal placeholder:text-slate-300";
  const labelStyle = "text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-0.5 block";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">New <span className="text-yellow-500">Job</span></h1>
          <button className="bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white px-4 py-2 rounded-lg font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2">
            <Save size={14} /> Publish
          </button>
        </div>

        <div className="space-y-3">
          {/* Section 1: Core Details */}
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <label className={labelStyle}>Job Title</label>
                <input type="text" placeholder="Senior Laravel Developer" className={inputStyle} />
              </div>
              <div className="col-span-4">
                <label className={labelStyle}>Category</label>
                <input type="text" placeholder="Engineering" className={inputStyle} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className={labelStyle}>Type</label>
                <select className={inputStyle}>
                  <option>Full-Time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Country</label>
                <select className={inputStyle}>
                  <option>Pakistan</option>
                  <option>UAE</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>City</label>
                <select className={inputStyle}>
                  <option>Karachi</option>
                  <option>Dubai</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-slate-900" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase">Remote</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelStyle}>Min Salary</label>
                <div className="relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">$</span>
                   <input type="number" className={`${inputStyle} pl-5`} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Max Salary</label>
                <div className="relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">$</span>
                   <input type="number" className={`${inputStyle} pl-5`} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Currency</label>
                <select className={inputStyle}>
                  <option>USD</option>
                  <option>PKR</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Description */}
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className={labelStyle}>Description</label>
            <textarea rows={3} placeholder="Brief role overview..." className={`${inputStyle} resize-none font-medium text-slate-600`}></textarea>
          </section>

          {/* Section 3: Tags (Skills & Languages) */}
          <div className="grid grid-cols-2 gap-3">
            <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <label className={labelStyle}>Skills</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Press enter..."
                  className={inputStyle}
                />
                <Plus size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.skills.map((skill) => (
                  <span key={skill} className="bg-slate-900 text-yellow-400 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                    {skill}
                    <X size={8} className="cursor-pointer text-white" onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} />
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <label className={labelStyle}>Languages</label>
              <div className="relative mb-2">
                <input type="text" placeholder="Add..." className={inputStyle} />
                <Plus size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="bg-yellow-100 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded border border-yellow-200">English</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 