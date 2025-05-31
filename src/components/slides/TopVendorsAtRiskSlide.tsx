import React from 'react';

interface RiskVendor {
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

interface AnalysisData {
  riskVendors: RiskVendor[];
}

interface TopVendorsAtRiskSlideProps {
  colors: {
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
  };
  analysisData: AnalysisData | null;
}

const TopVendorsAtRiskSlide: React.FC<TopVendorsAtRiskSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">TOP 5 VENDORS AT RISK</h1>
      <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
          
          {/* Risk Vendor Rankings */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-2" style={{ color: colors.accent }}>HIGHEST RISK VENDORS</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {analysisData?.riskVendors.slice(0, 5).map((vendor, idx) => {
                const riskColorMap = {
                  'Critical': 'border-red-600 bg-red-100',
                  'High': 'border-red-500 bg-red-50',
                  'Medium': 'border-yellow-500 bg-yellow-50',
                  'Low': 'border-green-500 bg-green-50'
                };
                const textColorMap = {
                  'Critical': 'text-red-900',
                  'High': 'text-red-800',
                  'Medium': 'text-yellow-800',
                  'Low': 'text-green-800'
                };
                
                const riskColor = riskColorMap[vendor.riskLevel as keyof typeof riskColorMap] || 'border-gray-500 bg-gray-50';
                const textColor = textColorMap[vendor.riskLevel as keyof typeof textColorMap] || 'text-gray-800';
                
                return (
                  <div key={vendor.vendor_number || idx} className={`p-2 rounded-lg border-2 ${riskColor} shadow-sm`}>
                    {/* Header with rank and risk level */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-black text-xs text-gray-900">
                        #{idx + 1} RISK VENDOR
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-black ${textColor} bg-white/70`}>
                        {vendor.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                    
                    {/* Vendor details */}
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      <div>
                        <div className="text-xs text-gray-600 font-medium">Country</div>
                        <div className="text-xs font-bold text-gray-900">{vendor.country_of_origin || 'Unknown'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-medium">Annual Spend</div>
                        <div className="text-xs font-bold text-blue-700">
                          ${(Number(vendor.annual_spend || 0) / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk factors */}
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Lead Time</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {Number(vendor.average_lead_time_days || 0)}d
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Safety Stock</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {Number(vendor.safety_stock || 0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Risk Score</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {vendor.riskScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 truncate mt-1 italic">
                      {vendor.category || 'Unknown Category'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Risk Analysis */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-2" style={{ color: colors.accent }}>RISK BREAKDOWN</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              
              {/* Risk Level Distribution */}
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm mb-2 text-center">RISK LEVEL DISTRIBUTION</h3>
                <div className="space-y-1 text-xs font-bold">
                  <div className="flex justify-between">
                    <span>Critical Risk:</span>
                    <span className="text-red-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'Critical').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk:</span>
                    <span className="text-orange-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'High').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk:</span>
                    <span className="text-yellow-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'Medium').length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Risk Factors */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm mb-2 text-center">KEY RISK FACTORS</h3>
                <div className="space-y-1 text-xs font-bold">
                  <div className="flex justify-between">
                    <span>Long Lead Times (&gt;90d):</span>
                    <span className="text-red-200">
                      {analysisData?.riskVendors.filter(v => Number(v.average_lead_time_days || 0) > 90).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Safety Stock (&lt;50):</span>
                    <span className="text-yellow-200">
                      {analysisData?.riskVendors.filter(v => Number(v.safety_stock || 0) < 50).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Risk Tolerance:</span>
                    <span className="text-orange-200">
                      {analysisData?.riskVendors.filter(v => v.risk_tolerance_category === 'Low').length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Exposure */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-center">HIGH-RISK EXPOSURE</h3>
                <div className="text-xl font-black mt-1 text-center">
                  ${analysisData ? (analysisData.riskVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0) / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90 text-center">
                  Combined annual spend at risk
                </div>
              </div>

              {/* Risk Methodology */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm mb-2 text-center">RISK SCORING</h3>
                <div className="text-xs font-bold space-y-1">
                  <div>• Risk Tolerance (BC Hydro perspective)</div>
                  <div>• Lead Time (delivery delays)</div>
                  <div>• Safety Stock (buffer capacity)</div>
                  <div>• Financial Impact (spend multiplier)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopVendorsAtRiskSlide; 