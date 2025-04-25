export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "2025 Pre-Season AFL Time Capsule Questions, Rules": {
        Row: {
          "If Multi-Choice": string | null
          "Number of Responses able to be selected": number | null
          Points: number | null
          Question: string | null
          "Question Reference": number
          "Response Category": string | null
          "Rules/Help": string | null
        }
        Insert: {
          "If Multi-Choice"?: string | null
          "Number of Responses able to be selected"?: number | null
          Points?: number | null
          Question?: string | null
          "Question Reference": number
          "Response Category"?: string | null
          "Rules/Help"?: string | null
        }
        Update: {
          "If Multi-Choice"?: string | null
          "Number of Responses able to be selected"?: number | null
          Points?: number | null
          Question?: string | null
          "Question Reference"?: number
          "Response Category"?: string | null
          "Rules/Help"?: string | null
        }
        Relationships: []
      }
      administrators: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      "AFL Clubs": {
        Row: {
          "AFL Club Name": string
        }
        Insert: {
          "AFL Club Name": string
        }
        Update: {
          "AFL Club Name"?: string
        }
        Relationships: []
      }
      afl_coaches: {
        Row: {
          firstname: string
          id: string
          surname: string | null
          team: string
          updated_at: string
        }
        Insert: {
          firstname: string
          id: string
          surname?: string | null
          team: string
          updated_at: string
        }
        Update: {
          firstname?: string
          id?: string
          surname?: string | null
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      afl_players: {
        Row: {
          firstname: string
          id: string
          position: string | null
          surname: string
          team: string
          updated_at: string
        }
        Insert: {
          firstname: string
          id: string
          position?: string | null
          surname: string
          team: string
          updated_at?: string
        }
        Update: {
          firstname?: string
          id?: string
          position?: string | null
          surname?: string
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      competition_entries: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          payment_completed: boolean | null
          payment_session_id: string | null
          questions_completed: number
          responses_saved: number | null
          status: string | null
          terms_accepted: boolean | null
          testing_mode: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          payment_completed?: boolean | null
          payment_session_id?: string | null
          questions_completed?: number
          responses_saved?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          testing_mode?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          payment_completed?: boolean | null
          payment_session_id?: string | null
          questions_completed?: number
          responses_saved?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          testing_mode?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_entries_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_terms: {
        Row: {
          competition_id: string
          created_at: string
          id: number
          term_template_id: number
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: number
          term_template_id: number
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: number
          term_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "competition_terms_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_template"
            referencedColumns: ["competition_id"]
          },
          {
            foreignKeyName: "competition_terms_term_template_id_fkey"
            columns: ["term_template_id"]
            isOneToOne: false
            referencedRelation: "term_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string
          id: string
          label: string
          status: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          status?: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          status?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: []
      }
      competitions_template: {
        Row: {
          close_date: string
          competition_description: string | null
          competition_id: string
          competition_name: string
          competition_type: string
          created_at: string
          entry_fee: number
          event_date: string
          max_participants: number | null
          midseason_questions_count: number
          open_date: string
          parent_competition_id: string | null
          preseason_questions_count: number
          prizes: string | null
          sport: string
        }
        Insert: {
          close_date: string
          competition_description?: string | null
          competition_id: string
          competition_name: string
          competition_type: string
          created_at?: string
          entry_fee: number
          event_date: string
          max_participants?: number | null
          midseason_questions_count?: number
          open_date: string
          parent_competition_id?: string | null
          preseason_questions_count?: number
          prizes?: string | null
          sport: string
        }
        Update: {
          close_date?: string
          competition_description?: string | null
          competition_id?: string
          competition_name?: string
          competition_type?: string
          created_at?: string
          entry_fee?: number
          event_date?: string
          max_participants?: number | null
          midseason_questions_count?: number
          open_date?: string
          parent_competition_id?: string | null
          preseason_questions_count?: number
          prizes?: string | null
          sport?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitions_template_parent_competition_id_fkey"
            columns: ["parent_competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_template"
            referencedColumns: ["competition_id"]
          },
        ]
      }
      instagram_credentials: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      prediction_comments: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          question_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          question_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          question_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          answer: string
          created_at: string
          id: string
          question_id: number
          response_order: number
          submitted: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question_id: number
          response_order?: number
          submitted?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question_id?: number
          response_order?: number
          submitted?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          afl_team: string | null
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization: string | null
          phone: string | null
          player_reference: string | null
          player_status: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          afl_team?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          player_reference?: string | null
          player_status?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          afl_team?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          player_reference?: string | null
          player_status?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          help_text: string | null
          id: number
          options: string[]
          points: number | null
          question: string
          required_answers: number | null
          response_category: string | null
        }
        Insert: {
          created_at?: string
          help_text?: string | null
          id: number
          options?: string[]
          points?: number | null
          question: string
          required_answers?: number | null
          response_category?: string | null
        }
        Update: {
          created_at?: string
          help_text?: string | null
          id?: number
          options?: string[]
          points?: number | null
          question?: string
          required_answers?: number | null
          response_category?: string | null
        }
        Relationships: []
      }
      questions_old: {
        Row: {
          created_at: string
          help_text: string | null
          id: number
          options: string[]
          points: number | null
          question: string
          required_answers: number | null
          response_category: string | null
        }
        Insert: {
          created_at?: string
          help_text?: string | null
          id?: number
          options: string[]
          points?: number | null
          question: string
          required_answers?: number | null
          response_category?: string | null
        }
        Update: {
          created_at?: string
          help_text?: string | null
          id?: number
          options?: string[]
          points?: number | null
          question?: string
          required_answers?: number | null
          response_category?: string | null
        }
        Relationships: []
      }
      questions_template: {
        Row: {
          competition_id: string
          created_at: string
          help_text: string | null
          id: string
          number_of_responses: number
          points_value: number
          possible_answers: string | null
          question_id: string
          question_text: string
          reference_table: string | null
          response_category: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          help_text?: string | null
          id?: string
          number_of_responses?: number
          points_value: number
          possible_answers?: string | null
          question_id: string
          question_text: string
          reference_table?: string | null
          response_category: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          help_text?: string | null
          id?: string
          number_of_responses?: number
          points_value?: number
          possible_answers?: string | null
          question_id?: string
          question_text?: string
          reference_table?: string | null
          response_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_template_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_template"
            referencedColumns: ["competition_id"]
          },
        ]
      }
      term_template_sections: {
        Row: {
          category: string
          content_template: string
          created_at: string
          id: number
          rule_id: string
          sequence: number
          template_id: number
          title: string
        }
        Insert: {
          category: string
          content_template: string
          created_at?: string
          id?: number
          rule_id: string
          sequence: number
          template_id: number
          title: string
        }
        Update: {
          category?: string
          content_template?: string
          created_at?: string
          id?: number
          rule_id?: string
          sequence?: number
          template_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "term_template_sections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "term_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      term_templates: {
        Row: {
          created_at: string
          description: string | null
          id: number
          template_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          template_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          template_name?: string
        }
        Relationships: []
      }
      "Terms and Conditions 2025 AFL Time Capsule": {
        Row: {
          Category: string | null
          Description: string | null
          Name: string | null
          "Rule Reference": number
        }
        Insert: {
          Category?: string | null
          Description?: string | null
          Name?: string | null
          "Rule Reference": number
        }
        Update: {
          Category?: string | null
          Description?: string | null
          Name?: string | null
          "Rule Reference"?: number
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string | null
          session_duration: number | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_duration?: number | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string | null
          session_duration?: number | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_stripe_payment_success: {
        Args: { payment_session_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
