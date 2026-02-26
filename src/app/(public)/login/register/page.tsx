"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  CheckCircle2,
  Globe,
  MapPin,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";
import Link from "next/link";
import { LocationItem } from "@/src/lib/apiInterface";

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "candidate",
    password: "",
    country_id: "", 
    city_id: "",    
    password_confirmation: "",
  });

  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});

  // 1. Prevent SSR Mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. Fetch Countries on Mount
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

  // 3. Fetch Cities when country changes
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/register", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/verify-email");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors);
        setError("Please correct the highlighted fields.");
      } else {
        setError(err.response?.data?.message || "Hive connection failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">
        {fieldErrors[field][0]}
      </p>
    ) : null;

  if (!hasMounted || loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-yellow-500 mb-2" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Hive...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex md:w-[40%] bg-yellow-400 p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#000 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-12">
            Join the <br />
            <span className="bg-slate-900 text-white px-2">Elite Swarm.</span>
          </h2>
          <div className="space-y-8">
            {["Access high-ticket global roles", "Showcase skill-set", "AI job matching"].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-900">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold opacity-90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFDFD] overflow-y-auto">
        <div className="w-full max-w-md py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Talent Account</h2>
            <p className="text-slate-500 font-bold text-sm">Build your profile and land your dream mission.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase rounded-xl">
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.name ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.name ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm transition-all`}
                  placeholder="e.g. Alex Rivera"
                />
              </div>
              <ErrorMsg field="name" />
            </div>

            {/* Email */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personal Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.email ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.email ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm transition-all`}
                  placeholder="alex@example.com"
                />
              </div>
              <ErrorMsg field="email" />
            </div>

            {/* Country Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select
                  required
                  value={formData.country_id}
                  onChange={(e) => setFormData({ ...formData, country_id: e.target.value, city_id: "" })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm appearance-none transition-all cursor-pointer"
                >
                  <option value="">Select Territory</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select
                  required
                  disabled={!formData.country_id || loadingCities}
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm appearance-none transition-all cursor-pointer disabled:opacity-50"
                >
                  <option value="">{loadingCities ? "Locating..." : "Select City"}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.password ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.password ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-400 text-sm transition-all`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-11 outline-none focus:border-yellow-400 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="md:col-span-2 w-full bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {loading ? "Establishing Connection..." : "Create My Profile"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center mt-8 text-xs font-bold text-slate-500 uppercase tracking-tight">
            Already a member? <Link href="/login" className="text-yellow-500 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}