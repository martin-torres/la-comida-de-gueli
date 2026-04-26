export type LeadStatus = 'new' | 'qualified' | 'demo_scheduled' | 'trial_started' | 'closed_won' | 'closed_lost' | 'nurture';
export type LeadSource = 'landing_page' | 'in_person' | 'referral' | 'walk_in';

export interface PainScores {
  menu: number;
  orders: number;
  retention: number;
  payment: number;
  analytics: number;
}

export interface Lead {
  id: string;
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  current_pos?: string;
  table_count?: number;
  daily_customers?: number;
  pain_scores?: PainScores;
  identified_modules?: string[];
  readiness_score?: number;
  biggest_pain?: string;
  source?: LeadSource;
  status?: LeadStatus;
  notes?: string;
  assigned_to?: string;
  booked_demo_at?: string;
  trial_ends_at?: string;
  created: string;
  updated: string;
}

export interface LeadInput {
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  current_pos?: string;
  table_count?: number;
  daily_customers?: number;
  pain_scores?: PainScores;
  identified_modules?: string[];
  readiness_score?: number;
  biggest_pain?: string;
  source?: LeadSource;
  status?: LeadStatus;
  notes?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  minScore?: number;
  maxScore?: number;
  search?: string;
}

export interface LeadsRepo {
  create(lead: LeadInput): Promise<Lead>;
  getById(id: string): Promise<Lead | null>;
  getByPhone(phone: string): Promise<Lead | null>;
  update(id: string, data: Partial<LeadInput>): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
  list(filters?: LeadFilters): Promise<Lead[]>;
  delete(id: string): Promise<boolean>;
}