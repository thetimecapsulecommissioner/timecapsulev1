
export interface UserActivity {
  id: string;
  event_type: string;
  user_id: string | null;
  timestamp: string;
  ip_address: string | null;
  page_url: string | null;
  user_agent: string | null;
  session_duration: number | null;
  metadata: Record<string, any> | null;
  display_name?: string; // For joining with profiles
}

export type ActivityEventType = 
  | 'page_view' 
  | 'login_success' 
  | 'login_failed'
  | 'logout'
  | 'competition_entry'
  | 'prediction_submitted';
