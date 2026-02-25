// src/types/job.ts

export interface LocationItem {
  id: number;
  name: string;
}

export type EmploymentType = "Full-Time" | "Contract" | "Part-Time" | "Freelance";

export interface JobFormData {
  id?: number; // Optional, only present when editing
  title: string;
  category: category;
  type: EmploymentType;
  country_id: string | number;
  city_id: string | number;
  is_remote: boolean;
  min_salary: string | number;
  max_salary: string | number;
  currency: string;
  description: string;
  skills: string[];
  languages: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  message?: string;
}

export interface Job {
  id: number;
  title: string;  
  category: string;
  employment_type: EmploymentType;
  country_id: number;   
  city_id: number;
  is_remote: boolean;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: string;
  description: string;
  skills?: skill[];
  languages?: language[];
  country?: country;
  city?: city;
  company?: Company;
  created_at: string;
  updated_at: string;
}

export interface skill {
  id: number;
  name: string;
}
export interface language {
  id: number;
  name: string;
}
export interface country {
  id: number;
  name: string;
}
export interface city {
  id: number;
  name: string;
}

export interface Company {
  id: number;

  user_id: number;

  company_name: string;
  slug: string;

  logo: string | null;
  logo_url: string | null; // full URL from backend

  cover_image: string | null;

  website: string | null;
  industry: string | null;
  company_size: string | null;
  founded_year: number | null;

  email: string | null;
  phone: string | null;

  country_id: number | null;
  city_id: number | null;

  description: string | null;

  is_verified: boolean;
  is_featured: boolean;

  total_jobs: number;

  created_at?: string;
  updated_at?: string;
}

export interface category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
} 

export interface role {
  id: number;
  name: string; 
  created_at: string;
  updated_at: string;
} 
export interface user {
  id: number;
  name: string;
  email: string;
  roles: role[];
  created_at: string;
  updated_at: string;
  }