export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  role: 'user' | 'staff' | 'co_admin' | 'admin';
  referral_code: string | null;
  fcm_token: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  city: string | null;
  roof_type: string | null;
  bill_range: string | null;
  message: string | null;
  referral_code_used: string | null;
  referred_by: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
  created_at: string;
}

export interface Installation {
  id: string;
  client_id: string;
  system_size_kw: number | null;
  install_date: string | null;
  warranty_expiry: string | null;
  amc_expiry: string | null;
  amc_amount: number | null;
  address: string | null;
  payment_status: string;
  payment_due_date: string | null;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  installation_id: string | null;
  issue_type: string | null;
  description: string | null;
  preferred_date: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_staff: string | null;
  completion_note: string | null;
  completion_photo_url: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  lead_id: string;
  status: 'pending' | 'converted' | 'rewarded';
  reward_amount: number;
  reward_paid: boolean;
  created_at: string;
}

export interface ElectricityLog {
  id: string;
  user_id: string;
  month: string;
  solar_units: number | null;
  grid_units: number | null;
  bill_amount: number | null;
  savings_amount?: number; // generated
  co2_offset_kg?: number;  // generated
  created_at: string;
}

export interface NotificationLog {
  id: string;
  type: string | null;
  target_user: string | null;
  title: string | null;
  body: string | null;
  delivered: boolean;
  created_at: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  admin_id: string;
  note: string | null;
  follow_up_date: string | null;
  created_at: string;
}
