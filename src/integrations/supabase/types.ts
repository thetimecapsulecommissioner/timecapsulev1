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
          created_at: string
          id: string
          name: string
          role: string | null
          team: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          role?: string | null
          team: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      afl_players: {
        Row: {
          created_at: string
          id: string
          name: string
          position: string | null
          team: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: string | null
          team: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: string | null
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
          questions_completed: number
          responses_saved: number | null
          terms_accepted: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          questions_completed?: number
          responses_saved?: number | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          questions_completed?: number
          responses_saved?: number | null
          terms_accepted?: boolean | null
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
          avatar_url: string | null
          created_at: string
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
          avatar_url?: string | null
          created_at?: string
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
          avatar_url?: string | null
          created_at?: string
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
        Relationships: []
      }
      prediction_comments: {
        Row: {
          id: string
          user_id: string
          question_id: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
