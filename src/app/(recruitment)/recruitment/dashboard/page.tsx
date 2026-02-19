"use client";

import React from "react";
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp,
  Mail
} from "lucide-react";

export default function RecruitmentDashboard() {
  const stats = [
    {
      label: "Total Specialists",
      value: "1,284",
      change: "+12%",
      icon: <Users className="text-blue-600" size={20} />,
      bg: "bg-blue-50",
    },
    {
      label: "Active Swarms",
      value: "12",
      change: "Stable",
      icon: <Briefcase className="text-yellow-600" size={20} />,
      bg: "bg-yellow-50",
    },
    {
      label: "Pending Reviews",
      value: "48",
      change: "Urgent",
      icon: <Clock className="text-orange-600" size={20} />,
      bg: "bg-orange-50",
    },
    {
      label: "Total Hired",
      value: "156",
      change: "+5",
      icon: <CheckCircle2 className="text-green-600" size={20} />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          Welcome back, <span className="text-yellow-500">Builder</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Your hive is humming. Here is the latest activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 ${stat.bg} rounded-xl`}>
                {stat.icon}
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                stat.change.includes('+') ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Specialists</h2>
            <button className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 uppercase flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                  <div>
                    <p className="text-xs font-black text-slate-900">Ammar Ahmed</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Frontend Specialist • Applied for UI Designer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Mail size={16} /></button>
                   <button className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Hiring Funnel */}
        <div className="bg-slate-900 text-white rounded-[24px] p-6 shadow-xl relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -top-4 text-white/5" size={120} />
          <h2 className="text-sm font-black uppercase tracking-widest mb-6">Hiring Velocity</h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                <span className="text-slate-400">Application Review</span>
                <span className="text-yellow-400">85%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                <span className="text-slate-400">Interview Stage</span>
                <span className="text-yellow-400">42%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[42%]" />
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                You are hiring 20% faster than last month. Keep the momentum up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}