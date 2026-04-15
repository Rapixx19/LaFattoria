export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          created_at: string
          date: string | null
          day_of_week: number | null
          id: string
          is_blocked: boolean
          notes: string | null
          service_id: string | null
          time_from: string
          time_to: string
          trainer_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          day_of_week?: number | null
          id?: string
          is_blocked?: boolean
          notes?: string | null
          service_id?: string | null
          time_from: string
          time_to: string
          trainer_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          day_of_week?: number | null
          id?: string
          is_blocked?: boolean
          notes?: string | null
          service_id?: string | null
          time_from?: string
          time_to?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          client_id: string
          client_snapshot: Json
          created_at: string
          date: string
          id: string
          items: Json
          notes: string | null
          number: string
          paid_amount: number | null
          paid_date: string | null
          pdf_url: string | null
          period: string | null
          source: string
          status: string
          type: string
          updated_at: string
          year: number
        }
        Insert: {
          client_id: string
          client_snapshot: Json
          created_at?: string
          date: string
          id?: string
          items: Json
          notes?: string | null
          number: string
          paid_amount?: number | null
          paid_date?: string | null
          pdf_url?: string | null
          period?: string | null
          source?: string
          status?: string
          type: string
          updated_at?: string
          year: number
        }
        Update: {
          client_id?: string
          client_snapshot?: Json
          created_at?: string
          date?: string
          id?: string
          items?: Json
          notes?: string | null
          number?: string
          paid_amount?: number | null
          paid_date?: string | null
          pdf_url?: string | null
          period?: string | null
          source?: string
          status?: string
          type?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "bills_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          bill_id: string | null
          cancelled_reason: string | null
          client_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          duration_minutes: number
          horse_id: string | null
          id: string
          notes: string | null
          requested_at: string
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status: string
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          bill_id?: string | null
          cancelled_reason?: string | null
          client_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          duration_minutes?: number
          horse_id?: string | null
          id?: string
          notes?: string | null
          requested_at?: string
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          bill_id?: string | null
          cancelled_reason?: string | null
          client_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          duration_minutes?: number
          horse_id?: string | null
          id?: string
          notes?: string | null
          requested_at?: string
          scheduled_date?: string
          scheduled_time?: string
          service_id?: string
          status?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_horse_id_fkey"
            columns: ["horse_id"]
            isOneToOne: false
            referencedRelation: "horses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      horses: {
        Row: {
          breed: string | null
          client_id: string
          created_at: string
          diet_notes: string | null
          farrier_date: string | null
          id: string
          name: string
          photo_url: string | null
          stall: string | null
          status: string
          vet_notes: string | null
        }
        Insert: {
          breed?: string | null
          client_id: string
          created_at?: string
          diet_notes?: string | null
          farrier_date?: string | null
          id?: string
          name: string
          photo_url?: string | null
          stall?: string | null
          status?: string
          vet_notes?: string | null
        }
        Update: {
          breed?: string | null
          client_id?: string
          created_at?: string
          diet_notes?: string | null
          farrier_date?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          stall?: string | null
          status?: string
          vet_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          client_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          active?: boolean
          client_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
        }
        Update: {
          active?: boolean
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          subscription: Json
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          subscription: Json
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          subscription?: Json
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          art_code: string
          created_at: string
          id: string
          is_custom: boolean
          name: string
          price: number
          price_history: Json
          sort_order: number
          unit: string
          vat_rate: number
        }
        Insert: {
          active?: boolean
          art_code: string
          created_at?: string
          id?: string
          is_custom?: boolean
          name: string
          price: number
          price_history?: Json
          sort_order?: number
          unit: string
          vat_rate?: number
        }
        Update: {
          active?: boolean
          art_code?: string
          created_at?: string
          id?: string
          is_custom?: boolean
          name?: string
          price?: number
          price_history?: Json
          sort_order?: number
          unit?: string
          vat_rate?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_bill_total: { Args: { items: Json }; Returns: number }
      get_revenue_by_month: {
        Args: { p_year: number }
        Returns: {
          bill_count: number
          invoiced: number
          month: number
          overdue: number
          paid: number
          pending: number
        }[]
      }
      get_user_client_id: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
      mark_overdue_bills: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

// Custom helper types
export type UserRole = 'owner' | 'trainer' | 'client'
export type Profile = Tables<'profiles'>
export type Client = Tables<'clients'>
export type Horse = Tables<'horses'>
export type Service = Tables<'services'>
export type Bill = Tables<'bills'>
export type Booking = Tables<'bookings'>
