export interface Colors {
  darkGreen: string;
  navy: string;
  lightGrey: string;
  teal: string;
  lightGreen: string;
  chartRed: string;
  chartOrange: string;
  chartYellow: string;
  chartBlue: string;
  chartPurple: string;
}

export interface VendorData {
  category?: string | null;
  average_lead_time_days?: number | null;
  annual_spend?: number | null;
  vendor_number?: number | null;
  country_of_origin?: string | null;
}

export interface CategoryVulnerabilityData {
  name: string;
  avgLeadTime: number;
  numSuppliers: number;
  totalSpend: number;
  vulnerabilityScore: number;
}

export interface TariffImpactData {
  name: string;
  affectedSpend: number;
  usTotalSpend: number;
}

export interface GlobalAlternativesData {
  country: string;
  [key: string]: any; // For dynamic category properties
}

export interface LpiData {
  country: string;
  lpiScore: number;
  color: string;
  rankText: string;
}

export interface HackathonSlideProps {
  colors: Colors;
  vendorData: VendorData[];
} 