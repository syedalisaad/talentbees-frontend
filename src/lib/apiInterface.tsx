// src/types/job.ts

export interface LocationItem {
  id: number;
  name: string;
}

export type EmploymentType = "Full-Time" | "Contract" | "Part-Time" | "Freelance";

export interface JobFormData {
  id?: number; // Optional, only present when editing
  title: string;
  category: string;
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