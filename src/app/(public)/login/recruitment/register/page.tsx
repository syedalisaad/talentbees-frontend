"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  User,
  CheckCircle2,
  Globe,
  MapPin,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";
import Link from "next/link";
import { LocationItem } from "@/src/lib/apiInterface";

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    role: "employer",
    password: "",
    country_id: "",
    city_id: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fix 1: Set mounted to true
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fix 2: Fetch Countries
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

  // Fix 3: Fetch Cities
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
      <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase animate-in fade-in slide-in-from-top-1">
        {fieldErrors[field][0]}
      </p>
    ) : null;

  if (!hasMounted || loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-yellow-500 mb-2" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Signal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans antialiased text-slate-900">
      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-[40%] bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#FACC15 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-12">
            Start your <br />
            <span className="text-yellow-400">Builder Swarm.</span>
          </h2>
          <div className="space-y-8">
            {[
              "Post unlimited job swarms",
              "Access top 1% vetted specialists",
              "AI-powered talent matching",
              "Integrated recruitment analytics",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-yellow-400" size={20} />
                <span className="text-sm font-bold opacity-80">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFDFD] overflow-y-auto">
        <div className="w-full max-w-md py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Create Business Account
            </h2>
            <p className="text-slate-500 font-bold text-sm">
              Join the Hive and start hiring elite talent.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase rounded-xl">
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRegister}>
            {/* Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.name ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.name ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-300 text-sm transition-all`}
                  placeholder="John Doe"
                />
              </div>
              <ErrorMsg field="name" />
            </div>

            {/* Email */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.email ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.email ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-300 text-sm transition-all`}
                  placeholder="hr@company.com"
                />
              </div>
              <ErrorMsg field="email" />
            </div>

            {/* Company Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
              <div className="relative">
                <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 ${fieldErrors.company_name ? "text-red-400" : "text-slate-300"}`} size={16} />
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className={`w-full bg-white border ${fieldErrors.company_name ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-300 text-sm transition-all`}
                  placeholder="BeeCorp"
                />
              </div>
              <ErrorMsg field="company_name" />
            </div>

            {/* Country */}
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
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <ErrorMsg field="country_id" />
            </div>

            {/* City */}
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
              <ErrorMsg field="city_id" />
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
                  className={`w-full bg-white border ${fieldErrors.password ? "border-red-500 ring-4 ring-red-500/5" : "border-slate-200"} rounded-xl py-3 pl-11 pr-4 outline-none focus:border-yellow-300 text-sm transition-all`}
                />
              </div>
              <ErrorMsg field="password" />
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-11 outline-none focus:border-yellow-300 text-sm transition-all"
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
              className="md:col-span-2 w-full bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 shadow-xl shadow-slate-100"
            >
              {loading ? "Initializing Hive..." : "Register Business"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center mt-8 text-xs font-bold text-slate-500 uppercase tracking-tight">
            Already have a portal?{" "}
            <Link href="/recruitment/login" className="text-yellow-500 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}