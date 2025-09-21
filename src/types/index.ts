export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  plan: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: PlanLimits;
}

export interface PlanLimits {
  projects: number;
  ai_requests: number;
  file_uploads: number;
  storage_mb: number;
}

export interface Usage {
  period_start: string;
  period_end: string;
  projects_used: number;
  ai_requests_used: number;
  file_uploads_used: number;
  storage_used_mb: number;
  limits: PlanLimits;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Document {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  project_id?: string;
  uploaded_at: string;
  processed: boolean;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}