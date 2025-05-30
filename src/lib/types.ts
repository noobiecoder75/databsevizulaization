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
      inventory_data_no_services: {
        Row: {
          active_stock_unassigned: number | null
          avg_lead_time_days: number | null
          category_name: string | null
          country_of_origin: string | null
          created_at: string | null
          days_of_supply_current: number | null
          frequency_of_use: number | null
          id: number
          reorder_point_stock_level: number | null
          safety_stock: number | null
          std_dev_lead_time_days: number | null
          updated_at: string | null
        }
        Insert: {
          active_stock_unassigned?: number | null
          avg_lead_time_days?: number | null
          category_name?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          days_of_supply_current?: number | null
          frequency_of_use?: number | null
          id?: number
          reorder_point_stock_level?: number | null
          safety_stock?: number | null
          std_dev_lead_time_days?: number | null
          updated_at?: string | null
        }
        Update: {
          active_stock_unassigned?: number | null
          avg_lead_time_days?: number | null
          category_name?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          days_of_supply_current?: number | null
          frequency_of_use?: number | null
          id?: number
          reorder_point_stock_level?: number | null
          safety_stock?: number | null
          std_dev_lead_time_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_risk_inventory: {
        Row: {
          active_stock_unassigned: number | null
          annual_spend: number | null
          average_lead_time_days: number | null
          category: string | null
          country_of_origin: string | null
          created_at: string | null
          days_of_supply_current: number | null
          frequency_of_use: number | null
          id: number
          portfolio: string | null
          reorder_point_stock_level: number | null
          risk_tolerance_category: string | null
          safety_stock: number | null
          std_dev_lead_time_days: number | null
          updated_at: string | null
          vendor_number: number | null
          vendor_performance: string | null
        }
        Insert: {
          active_stock_unassigned?: number | null
          annual_spend?: number | null
          average_lead_time_days?: number | null
          category?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          days_of_supply_current?: number | null
          frequency_of_use?: number | null
          id?: number
          portfolio?: string | null
          reorder_point_stock_level?: number | null
          risk_tolerance_category?: string | null
          safety_stock?: number | null
          std_dev_lead_time_days?: number | null
          updated_at?: string | null
          vendor_number?: number | null
          vendor_performance?: string | null
        }
        Update: {
          active_stock_unassigned?: number | null
          annual_spend?: number | null
          average_lead_time_days?: number | null
          category?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          days_of_supply_current?: number | null
          frequency_of_use?: number | null
          id?: number
          portfolio?: string | null
          reorder_point_stock_level?: number | null
          risk_tolerance_category?: string | null
          safety_stock?: number | null
          std_dev_lead_time_days?: number | null
          updated_at?: string | null
          vendor_number?: number | null
          vendor_performance?: string | null
        }
        Relationships: []
      }
      country_trade_partners: {
        Row: {
          id: number
          reporter_name: string | null
          partner_name: string | null
          hs_code: string | null
          year: number | null
          import_value: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          reporter_name?: string | null
          partner_name?: string | null
          hs_code?: string | null
          year?: number | null
          import_value?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          reporter_name?: string | null
          partner_name?: string | null
          hs_code?: string | null
          year?: number | null
          import_value?: number | null
          created_at?: string | null
          updated_at?: string | null
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

// Convenience type aliases
export type InventoryDataNoServices = Tables<'inventory_data_no_services'>
export type InventoryDataNoServicesInsert = TablesInsert<'inventory_data_no_services'>
export type InventoryDataNoServicesUpdate = TablesUpdate<'inventory_data_no_services'>

export type VendorRiskInventory = Tables<'vendor_risk_inventory'>
export type VendorRiskInventoryInsert = TablesInsert<'vendor_risk_inventory'>
export type VendorRiskInventoryUpdate = TablesUpdate<'vendor_risk_inventory'>

export type CountryTradePartners = Tables<'country_trade_partners'>
export type CountryTradePartnersInsert = TablesInsert<'country_trade_partners'>
export type CountryTradePartnersUpdate = TablesUpdate<'country_trade_partners'> 