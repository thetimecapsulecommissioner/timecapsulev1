
// Define the UserActivity interface to match the actual data in the user_activity table
export type UserActivity = {
  id: string;
  event_type: string;
  user_id: string | null;
  display_name: string | null;
  timestamp: string;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
};
