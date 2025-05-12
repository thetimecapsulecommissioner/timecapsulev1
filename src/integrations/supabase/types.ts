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
            foreignKeyName: "competition_entries_competition_id_v2_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_entries_competition_id_v2_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_entries_backup: {
        Row: {
          competition_id: string | null
          created_at: string | null
          id: string | null
          payment_completed: boolean | null
          payment_session_id: string | null
          questions_completed: number | null
          responses_saved: number | null
          status: string | null
          terms_accepted: boolean | null
          testing_mode: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          competition_id?: string | null
          created_at?: string | null
          id?: string | null
          payment_completed?: boolean | null
          payment_session_id?: string | null
          questions_completed?: number | null
          responses_saved?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          testing_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          competition_id?: string | null
          created_at?: string | null
          id?: string | null
          payment_completed?: boolean | null
          payment_session_id?: string | null
          questions_completed?: number | null
          responses_saved?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          testing_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      competition_terms: {
        Row: {
          competition_id: string
          compiled_terms: string
          created_at: string
          custom_fields: Json | null
          id: string
          terms_template_id: string
          updated_at: string
        }
        Insert: {
          competition_id: string
          compiled_terms: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          terms_template_id: string
          updated_at?: string
        }
        Update: {
          competition_id?: string
          compiled_terms?: string
          created_at?: string
          custom_fields?: Json | null
          id?: string
          terms_template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_terms_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_terms_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_terms_terms_template_id_fkey"
            columns: ["terms_template_id"]
            isOneToOne: false
            referencedRelation: "terms_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_user_fields: {
        Row: {
          competition_id: string
          created_at: string
          display_order: number
          field_key: string
          field_label: string
          field_options: Json | null
          field_type: string
          help_text: string | null
          id: string
          is_required: boolean | null
          updated_at: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          display_order?: number
          field_key: string
          field_label: string
          field_options?: Json | null
          field_type: string
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          display_order?: number
          field_key?: string
          field_label?: string
          field_options?: Json | null
          field_type?: string
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_user_fields_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_user_fields_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
        ]
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
      competitions_v2: {
        Row: {
          available_to_new_entrants: boolean | null
          competition_relationship_type: string | null
          competition_type: string | null
          created_at: string | null
          description: string | null
          display_status: string | null
          end_date: string | null
          entry_deadline: string | null
          entry_fee: number | null
          event_date: string | null
          id: string
          is_public: boolean | null
          max_participants: number | null
          new_entrant_fee: number | null
          parent_competition_id: string | null
          prediction_phase: string | null
          prizes: string | null
          requires_group: boolean | null
          sponsor_id: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
          user_data_fields: Json | null
        }
        Insert: {
          available_to_new_entrants?: boolean | null
          competition_relationship_type?: string | null
          competition_type?: string | null
          created_at?: string | null
          description?: string | null
          display_status?: string | null
          end_date?: string | null
          entry_deadline?: string | null
          entry_fee?: number | null
          event_date?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          new_entrant_fee?: number | null
          parent_competition_id?: string | null
          prediction_phase?: string | null
          prizes?: string | null
          requires_group?: boolean | null
          sponsor_id?: string | null
          start_date?: string | null
          status: string
          title: string
          updated_at?: string | null
          user_data_fields?: Json | null
        }
        Update: {
          available_to_new_entrants?: boolean | null
          competition_relationship_type?: string | null
          competition_type?: string | null
          created_at?: string | null
          description?: string | null
          display_status?: string | null
          end_date?: string | null
          entry_deadline?: string | null
          entry_fee?: number | null
          event_date?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          new_entrant_fee?: number | null
          parent_competition_id?: string | null
          prediction_phase?: string | null
          prizes?: string | null
          requires_group?: boolean | null
          sponsor_id?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_data_fields?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_v2_parent_competition_id_fkey"
            columns: ["parent_competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_v2_parent_competition_id_fkey"
            columns: ["parent_competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
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
      legacy_competitions: {
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
      legacy_predictions: {
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
      legacy_preseason_questions_2025: {
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
      legacy_questions: {
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
      legacy_questions_old: {
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
      legacy_terms_and_conditions_2025: {
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
      prediction_comments: {
        Row: {
          comment: string | null
          competition_id: string | null
          created_at: string
          id: string
          question_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          question_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          question_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_comments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_comments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions_v2: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          points_earned: number | null
          prediction_value: string
          question_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          prediction_value: string
          question_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          prediction_value?: string
          question_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_v2_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_v2_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_v2_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_v2"
            referencedColumns: ["id"]
          },
        ]
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
      questions_v2: {
        Row: {
          competition_id: string
          created_at: string | null
          id: string
          points: number | null
          question_number: number
          question_text: string
          question_type: string
          response_options: Json | null
          updated_at: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          id?: string
          points?: number | null
          question_number: number
          question_text: string
          question_type: string
          response_options?: Json | null
          updated_at?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          id?: string
          points?: number | null
          question_number?: number
          question_text?: string
          question_type?: string
          response_options?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_v2_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_v2_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_templates: {
        Row: {
          competition_type: string
          created_at: string
          id: string
          is_active: boolean | null
          template_content: string
          template_name: string
        }
        Insert: {
          competition_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          template_content: string
          template_name: string
        }
        Update: {
          competition_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          template_content?: string
          template_name?: string
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
      user_field_responses: {
        Row: {
          competition_id: string
          created_at: string
          field_id: string
          id: string
          response_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          field_id: string
          id?: string
          response_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          field_id?: string
          id?: string
          response_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_field_responses_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_field_responses_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "legacy_competitions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_field_responses_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "competition_user_fields"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      legacy_competitions_view: {
        Row: {
          created_at: string | null
          id: string | null
          label: string | null
          status: string | null
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          label?: string | null
          status?: string | null
          total_questions?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          label?: string | null
          status?: string | null
          total_questions?: never
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      direct_update_competition: {
        Args: {
          p_id: string
          p_title: string
          p_description: string
          p_status: string
          p_competition_type: string
        }
        Returns: boolean
      }
      fix_competition_ids: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_competition_display_status: {
        Args:
          | {
              p_start_date: string
              p_entry_deadline: string
              p_end_date: string
            }
          | {
              p_start_date: string
              p_entry_deadline: string
              p_end_date: string
              p_event_date?: string
            }
        Returns: string
      }
      get_competition_status: {
        Args:
          | {
              p_start_date: string
              p_entry_deadline: string
              p_end_date: string
            }
          | {
              p_start_date: string
              p_entry_deadline: string
              p_end_date: string
              p_event_date?: string
            }
        Returns: string
      }
      get_user_field_history: {
        Args: { p_user_id: string; p_field_key: string }
        Returns: {
          competition_id: string
          response_value: Json
          created_at: string
        }[]
      }
      handle_stripe_payment_success: {
        Args: { payment_session_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      migrate_competition_metadata: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_competitions_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      safe_create_competition: {
        Args: {
          p_title: string
          p_description: string
          p_start_date: string
          p_end_date: string
          p_entry_deadline: string
          p_event_date: string
          p_entry_fee: number
          p_competition_relationship_type: string
          p_parent_competition_id: string
          p_competition_type: string
          p_available_to_new_entrants: boolean
          p_new_entrant_fee: number
          p_is_public: boolean
          p_prediction_phase: string
          p_status: string
          p_requires_group: boolean
          p_user_data_fields: Json
          p_max_participants: number
          p_prizes: string
          p_display_status: string
          p_sponsor_id: string
        }
        Returns: string
      }
      safe_timestamp_cast: {
        Args: { p_value: string }
        Returns: string
      }
      safe_update_competition: {
        Args: {
          p_id: string
          p_title: string
          p_description: string
          p_start_date: string
          p_end_date: string
          p_entry_deadline: string
          p_event_date: string
          p_entry_fee: number
          p_competition_relationship_type: string
          p_parent_competition_id: string
          p_competition_type: string
          p_available_to_new_entrants: boolean
          p_new_entrant_fee: number
          p_is_public: boolean
          p_prediction_phase: string
          p_status: string
          p_requires_group: boolean
          p_user_data_fields: Json
          p_max_participants: number
          p_prizes: string
          p_display_status: string
          p_sponsor_id: string
        }
        Returns: boolean
      }
      update_all_competition_statuses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_competition_relationship_type: {
        Args: { p_competition_id: string; p_relationship_type: string }
        Returns: boolean
      }
      update_competition_simple: {
        Args: { competition_data: Json }
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
