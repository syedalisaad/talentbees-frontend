// src/types/job.ts

export interface LocationItem {
  id: number;
  name: string;
}

export type EmploymentType =
  | "Full-Time"
  | "Contract"
  | "Part-Time"
  | "Freelance";

export type CandidateStatus =  'applied'|
                'shortlisted'|
                'interviewing'|
                'rejected'|
                'hired'|
                'withdrawn';

export interface JobFormData {
  id?: number; // Optional, only present when editing
  title: string;
  category: Category;
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
  category_name: string;
  employment_type: EmploymentType;
  country_id: number;
  city_id: number;
  is_remote: boolean;
  slug: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: string;
  description: string;
  external_link: string;
  skills: Skill[] | [];
  languages?: Language[];
  country?: Country;
  city?: City;
  screening_questions?: ScreeningQuestion[] |any;
  company?: Company;
  created_at?: string;
  updated_at?: string;
  is_applied?: boolean;
  category:Category
}
export interface ScreeningQuestion {
  id: number;
  question: string;
  field_type: string;
  is_required: boolean;
  order: number;
}

export interface ScreeningAnswer{
  id: number;
  screening_question_id:number;
  answer:string;
  ScreeningQuestion? : ScreeningQuestion;
  application?: Candidate
}
export interface Skill {
  id: number;
  name: string;
}
export interface Language {
  id: number;
  name: string;
}
export interface Country {
  id: number;
  name: string;
}
export interface City {
  id: number;
  name: string;
}

export interface CandidateProfile {
    id?: number;
    user_id: number;
    profile_photo_path: string | null;
    profile_photo_url: string; 
    phone_number: string;
    address: string | null;
    country_id: number;
    city_id: number;
    cover_letter: string | null;
    current_salary: string | null;
    expected_salary: string | null;
    open_to_work: boolean;
    currency:String|null
    
    social_links: any | null;

    // Relationships
    user?: User;
    country?: Country;
    city?: City;
    skills?: Skill[];
    languages?: Language[];
    experiences?: any[];
    educations?: any[];
    projects?: any[];
    certifications?: any[];
    resumes?: any[];
    active_resume?: any;
    screening_answers ?: ScreeningAnswer[];
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
  candidate_profile?: CandidateProfile
}

export interface Category {
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
export interface User {
  id: number;
  name: string;
  email: string;
  allow_external_link:boolean;
  roles: role[];
  created_at: string;
  updated_at: string;
  company?: Company;
  candidate_profile?: CandidateProfile;
}

export interface Candidate {
  id: number;
  company_job_posting_id: number;
  user_id: number;
  status: CandidateStatus;
  candidate? : User;
  screening_answers?: ScreeningAnswer;
  created_at: string;

}
