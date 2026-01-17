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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appliance_states: {
        Row: {
          appliance_id: string
          id: string
          state: string
          timestamp: string
        }
        Insert: {
          appliance_id: string
          id?: string
          state: string
          timestamp?: string
        }
        Update: {
          appliance_id?: string
          id?: string
          state?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "appliance_states_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "appliances"
            referencedColumns: ["id"]
          },
        ]
      }
      appliances: {
        Row: {
          created_at: string
          gpio_pin: number | null
          icon: string | null
          id: string
          name: string
          power_rating: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          gpio_pin?: number | null
          icon?: string | null
          id?: string
          name: string
          power_rating?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          gpio_pin?: number | null
          icon?: string | null
          id?: string
          name?: string
          power_rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      budget_settings: {
        Row: {
          cost_per_unit: number
          created_at: string
          daily_budget: number
          id: string
          monthly_budget: number
          updated_at: string
        }
        Insert: {
          cost_per_unit?: number
          created_at?: string
          daily_budget?: number
          id?: string
          monthly_budget?: number
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          daily_budget?: number
          id?: string
          monthly_budget?: number
          updated_at?: string
        }
        Relationships: []
      }
      daily_usage_summary: {
        Row: {
          appliance_id: string
          cost: number
          created_at: string
          date: string
          energy_kwh: number
          id: string
          total_on_time_minutes: number
        }
        Insert: {
          appliance_id: string
          cost?: number
          created_at?: string
          date?: string
          energy_kwh?: number
          id?: string
          total_on_time_minutes?: number
        }
        Update: {
          appliance_id?: string
          cost?: number
          created_at?: string
          date?: string
          energy_kwh?: number
          id?: string
          total_on_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_usage_summary_appliance_id_fkey"
            columns: ["appliance_id"]
            isOneToOne: false
            referencedRelation: "appliances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_appliance_on_time: {
        Args: {
          p_appliance_id: string
          p_end_date: string
          p_start_date: string
        }
        Returns: number
      }
      get_budget_status: {
        Args: never
        Returns: {
          cost_per_unit: number
          daily_budget: number
          daily_overrun: boolean
          daily_remaining: number
          month_spent: number
          monthly_budget: number
          monthly_overrun: boolean
          monthly_remaining: number
          today_spent: number
        }[]
      }
      get_daily_usage_summary: {
        Args: { p_date?: string }
        Returns: {
          appliance_id: string
          appliance_name: string
          cost: number
          energy_kwh: number
          icon: string
          power_rating: number
          total_on_time_minutes: number
        }[]
      }
      get_monthly_usage_summary: {
        Args: { p_month: number; p_year: number }
        Returns: {
          appliance_id: string
          appliance_name: string
          cost: number
          energy_kwh: number
          icon: string
          power_rating: number
          total_on_time_minutes: number
        }[]
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
