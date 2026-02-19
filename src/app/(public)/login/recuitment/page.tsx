"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      router.push("/recruitment/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Authentication failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      <div className="hidden md:flex md:w-[45%] bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#FACC15 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8">
            Hire the <span className="text-yellow-300">Top 1%</span> of <br />{" "}
            Digital Builders.
          </h1>
          <div className="space-y-6">
            {[
              {
                icon: <Zap size={20} />,
                title: "Rapid Sourcing",
                desc: "Reduce time-to-hire by 40%.",
              },
              {
                icon: <Users size={20} />,
                title: "Verified Hive",
                desc: "Access vetted professionals.",
              },
              {
                icon: <BarChart3 size={20} />,
                title: "Data Insights",
                desc: "Real-time analytics.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start group text-white"
              >
                <div className="bg-slate-800 text-yellow-300 p-2.5 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Form Connection) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFDFD]">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Recruiter Portal
            </h2>
            <p className="text-slate-500 font-bold text-sm">
              Manage your hive and scale your team.
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Work Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-yellow-300 focus:ring-4 ring-yellow-300/5 font-medium text-sm"
                  placeholder="recruitment@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Security Key
                </label>
                <button
                  type="button"
                  className="text-[10px] font-black text-yellow-300 hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-11 outline-none focus:border-yellow-300 focus:ring-4 ring-yellow-300/5 font-medium text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-yellow-300 hover:text-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <p className="text-center mt-8 text-xs font-bold text-slate-500 tracking-tight">
            Don't have an account?{" "}
            <a
              href="/login/recuitment/register"
              className="text-yellow-300 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
