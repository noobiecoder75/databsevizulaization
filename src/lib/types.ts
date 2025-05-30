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
      vendor_risk_inventory: {
        Row: {
          active_stock_unassigned: number | null
          active_stock_unassigned_y: number | null
          annual_spend: number | null
          ariba_supplier_group: string | null
          authorization_group_name: string | null
          auto_po_category: string | null
          auto_po_type: string | null
          avg_lead_time_days: number | null
          avg_lead_time_days_x: number | null
          category: string | null
          category_name_x: string | null
          clean_oa_number: string | null
          clean_oa_number_y: string | null
          clean_parent_oa_number2_x: string | null
          clean_parent_oa_number2_y: string | null
          country_of_origin: string | null
          country_of_origin_x: string | null
          days_of_supply_current: number | null
          days_of_supply_current_y: number | null
          end_date_clean_x: number | null
          end_date_clean_y: number | null
          frequency_of_use: number | null
          frequency_of_use_y: number | null
          fuzzy_matched_category: string | null
          id: number
          material_group_x: string | null
          material_group_y: string | null
          max_auto_po_value_ex: string | null
          portfolio: string | null
          purchasing_group_number: number | null
          purchasing_group_number_y: number | null
          reference_number_x: number | null
          reference_number_y: number | null
          reorder_point_stock_level: number | null
          reorder_point_stock_level_y: number | null
          restricted_us_vendor_x: string | null
          restricted_us_vendor_y: string | null
          risk_data_category: string | null
          risk_tolerance_x: string | null
          safety_stock: number | null
          safety_stock_y: number | null
          start_date_clean_x: number | null
          start_date_clean_y: number | null
          std_dev_lead_time_days: number | null
          std_dev_lead_time_days_x: number | null
          vendor_name: string | null
          vendor_number_clean: string | null
          vendor_performance: string | null
        }
        Insert: {
          active_stock_unassigned?: number | null
          active_stock_unassigned_y?: number | null
          annual_spend?: number | null
          ariba_supplier_group?: string | null
          authorization_group_name?: string | null
          auto_po_category?: string | null
          auto_po_type?: string | null
          avg_lead_time_days?: number | null
          avg_lead_time_days_x?: number | null
          category?: string | null
          category_name_x?: string | null
          clean_oa_number?: string | null
          clean_oa_number_y?: string | null
          clean_parent_oa_number2_x?: string | null
          clean_parent_oa_number2_y?: string | null
          country_of_origin?: string | null
          country_of_origin_x?: string | null
          days_of_supply_current?: number | null
          days_of_supply_current_y?: number | null
          end_date_clean_x?: number | null
          end_date_clean_y?: number | null
          frequency_of_use?: number | null
          frequency_of_use_y?: number | null
          fuzzy_matched_category?: string | null
          id?: number
          material_group_x?: string | null
          material_group_y?: string | null
          max_auto_po_value_ex?: string | null
          portfolio?: string | null
          purchasing_group_number?: number | null
          purchasing_group_number_y?: number | null
          reference_number_x?: number | null
          reference_number_y?: number | null
          reorder_point_stock_level?: number | null
          reorder_point_stock_level_y?: number | null
          restricted_us_vendor_x?: string | null
          restricted_us_vendor_y?: string | null
          risk_data_category?: string | null
          risk_tolerance_x?: string | null
          safety_stock?: number | null
          safety_stock_y?: number | null
          start_date_clean_x?: number | null
          start_date_clean_y?: number | null
          std_dev_lead_time_days?: number | null
          std_dev_lead_time_days_x?: number | null
          vendor_name?: string | null
          vendor_number_clean?: string | null
          vendor_performance?: string | null
        }
        Update: {
          active_stock_unassigned?: number | null
          active_stock_unassigned_y?: number | null
          annual_spend?: number | null
          ariba_supplier_group?: string | null
          authorization_group_name?: string | null
          auto_po_category?: string | null
          auto_po_type?: string | null
          avg_lead_time_days?: number | null
          avg_lead_time_days_x?: number | null
          category?: string | null
          category_name_x?: string | null
          clean_oa_number?: string | null
          clean_oa_number_y?: string | null
          clean_parent_oa_number2_x?: string | null
          clean_parent_oa_number2_y?: string | null
          country_of_origin?: string | null
          country_of_origin_x?: string | null
          days_of_supply_current?: number | null
          days_of_supply_current_y?: number | null
          end_date_clean_x?: number | null
          end_date_clean_y?: number | null
          frequency_of_use?: number | null
          frequency_of_use_y?: number | null
          fuzzy_matched_category?: string | null
          id?: number
          material_group_x?: string | null
          material_group_y?: string | null
          max_auto_po_value_ex?: string | null
          portfolio?: string | null
          purchasing_group_number?: number | null
          purchasing_group_number_y?: number | null
          reference_number_x?: number | null
          reference_number_y?: number | null
          reorder_point_stock_level?: number | null
          reorder_point_stock_level_y?: number | null
          restricted_us_vendor_x?: string | null
          restricted_us_vendor_y?: string | null
          risk_data_category?: string | null
          risk_tolerance_x?: string | null
          safety_stock?: number | null
          safety_stock_y?: number | null
          start_date_clean_x?: number | null
          start_date_clean_y?: number | null
          std_dev_lead_time_days?: number | null
          std_dev_lead_time_days_x?: number | null
          vendor_name?: string | null
          vendor_number_clean?: string | null
          vendor_performance?: string | null
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

// Helper types for easier usage
export type VendorRiskInventory = Database['public']['Tables']['vendor_risk_inventory']['Row']
export type VendorRiskInventoryInsert = Database['public']['Tables']['vendor_risk_inventory']['Insert']
export type VendorRiskInventoryUpdate = Database['public']['Tables']['vendor_risk_inventory']['Update'] 