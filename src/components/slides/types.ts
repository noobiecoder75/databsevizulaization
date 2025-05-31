export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  warning: string;
  success: string;
  danger: string;
  info: string;
  dark: string;
  light: string;
}

export interface RiskVendor {
  vendor_number: number | null;
  country_of_origin: string | null;
  annual_spend: string | number | null;
  average_lead_time_days: string | number | null;
  safety_stock: string | number | null;
  risk_tolerance_category: string | null;
  category: string | null;
  riskScore: number;
  riskLevel: string;
}

export interface TopCategory {
  category: string;
  spend: number;
}

export interface VulnerableCategory {
  category: string;
  totalSpend: number;
}

export interface TariffData {
  category: string;
  tariffCost: number;
  currentSpend: number;
  vendors: number;
}

export interface TopCountry {
  country: string;
  spend: number;
}

export interface RiskMatrixData {
  category: string;
  totalSpend: number;
  vendorCount: number;
  riskLevel: string;
  riskScore: number;
}

export interface LeadTimeData {
  leadTime: number;
  safetyStock: number;
  category: string;
  riskLevel: string;
  vendor: number | null;
}

export interface TopVendor {
  vendor_number: number | null;
  category: string;
  country_of_origin: string;
  annual_spend: string | number | null;
}

export interface AnalysisData {
  topCategories: TopCategory[];
  riskMatrixData: RiskMatrixData[];
  leadTimeData: LeadTimeData[];
  topCountries: TopCountry[];
  topVendors: TopVendor[];
  riskVendors: RiskVendor[];
  tariffData: TariffData[];
  vulnerableCategories: VulnerableCategory[];
  totalSpend: number;
  usaTariffImpact: number;
} 