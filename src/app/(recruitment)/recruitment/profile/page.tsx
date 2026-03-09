"use client";

import React, { useEffect, useState } from "react";
import { Save, Loader2, Building2 } from "lucide-react";
import { LocationItem, User } from "@/src/lib/apiInterface";
import api from "@/src/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const router = useRouter();

  const defaultCompany = {
    company_name: "",
    website: "",
    industry: "",
    country_id: "",
    city_id: "",
  };

  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    company: defaultCompany as any,
  });

  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  console.log(formData);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/my-profile`);
        const data = res.data.data;

        // FIX: Deep merge API data with default structure
        setFormData({
          ...data,
          company: {
            ...defaultCompany,
            ...(data.company || {}),
          },
        });
      } catch (err) {
        console.error("Failed to load profile data");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchProfile();
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await api.get("/countries");
      setCountries(response.data.data);
    } catch (err) {
      console.error("Failed to load countries");
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      const countryId = formData.company?.country_id;
      if (!countryId) {
        setCities([]);
        return;
      }
      setLoadingCities(true);
      try {
        const res = await api.get(`/countries/${countryId}/cities`);
        setCities(res.data.data);
      } catch (err) {
        console.error("Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.company?.country_id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const isCompanyField = [
      "company_name",
      "website",
      "industry",
      "country_id",
      "city_id",
    ].includes(name);

    if (isCompanyField) {
      setFormData((prev) => ({
        ...prev,
        company: {
          ...(prev.company || defaultCompany),
          [name]: value,
        } as any, // Adding 'as any' here bypasses the strict nested check
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFieldErrors({});

    const data = new FormData();
    data.append("name", formData.name || "");
    data.append("company_name", formData.company?.company_name || "");
    data.append("industry", formData.company?.industry || "");
    data.append("website", formData.company?.website || "");
    data.append("country_id", String(formData.company?.country_id || ""));
    data.append("city_id", String(formData.company?.city_id || ""));

    if (logoFile) {
      data.append("company_logo", logoFile);
    }

    try {
      await api.post("/my-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-slate-700 text-[13px]";
  const labelStyle =
    "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Account <span className="text-yellow-500">Settings</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-1">
              Manage your TalentBees profile and company info
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-yellow-400 hover:text-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="space-y-6">
          {/* User Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-700 mb-4">
              Personal Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  type="text"
                  className={inputStyle}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-[10px] mt-1 font-bold">
                    {fieldErrors.name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className={labelStyle}>Email Address</label>
                <input
                  name="email"
                  value={formData.email || ""}
                  disabled
                  type="email"
                  className={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Company Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-700">
              Company Details
            </h2>

            {/* Logo Row */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="relative h-20 w-20 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                {logoPreview || formData.company?.logo_url ? (
                  <img
                    src={logoPreview || formData.company?.logo_url|| ""}
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building2 className="text-slate-300" size={32} />
                )}
              </div>
              <div className="flex-1">
                <label className={labelStyle}>Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="text-[11px] text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-yellow-400 file:text-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Company Name</label>
                <input
                  name="company_name"
                  value={formData.company?.company_name || ""}
                  onChange={handleChange}
                  type="text"
                  className={inputStyle}
                />
                {fieldErrors.company_name && (
                  <p className="text-red-500 text-[10px] mt-1 font-bold">
                    {fieldErrors.company_name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className={labelStyle}>Industry</label>
                <input
                  name="industry"
                  value={formData.company?.industry || ""}
                  onChange={handleChange}
                  type="text"
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Website</label>
              <input
                name="website"
                value={formData.company?.website || ""}
                onChange={handleChange}
                type="text"
                className={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Country</label>
                <select
                  name="country_id"
                  value={formData.company?.country_id || ""}
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
              <div>
                <label className={labelStyle}>City</label>
                <select
                  name="city_id"
                  value={formData.company?.city_id || ""}
                  onChange={handleChange}
                  disabled={loadingCities || !formData.company?.country_id}
                  className={inputStyle}
                >
                  <option value="">
                    {loadingCities ? "Loading..." : "Select City"}
                  </option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
