import React from 'react';

interface AnalysisData {
  topCategories: Array<{ category: string; spend: number }>;
  usaTariffImpact: number;
  vulnerableCategories: Array<{ category: string; totalSpend: number }>;
  totalSpend: number;
  tariffData: Array<{ category: string; tariffCost: number; currentSpend: number; vendors: number }>;
}

interface ExecutiveSummarySlideProps {
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
  equipmentVendorsLength: number;
}

const ExecutiveSummarySlide: React.FC<ExecutiveSummarySlideProps> = ({ colors, analysisData, equipmentVendorsLength }) => {
  return (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">EXECUTIVE SUMMARY</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        
        {/* Top Impact Numbers - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">TARIFF RISK</div>
            <div className="text-xs opacity-75 mt-1">Annual cost exposure from US tariffs</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              {analysisData?.vulnerableCategories.length || 0}
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">HIGH RISK</div>
            <div className="text-xs opacity-75 mt-1">Critical equipment categories</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">TOTAL VALUE</div>
            <div className="text-xs opacity-75 mt-1">International equipment portfolio</div>
          </div>
        </div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.danger }}>
              CRITICAL RISKS
            </h2>
            <div className="space-y-3">
              <div className="bg-red-50 border-l-8 border-red-500 p-3 rounded-r-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="text-lg lg:text-xl font-black text-red-600 mr-3">
                    {analysisData?.vulnerableCategories?.[0]?.category && analysisData.vulnerableCategories[0].category.length > 20 ? 
                      analysisData.vulnerableCategories[0].category.substring(0, 20) + '...' : 
                      analysisData?.vulnerableCategories?.[0]?.category || 'Loading...'}
                  </div>
                </div>
                <div className="text-lg font-bold text-red-700">
                  ${analysisData ? (analysisData.vulnerableCategories?.[0]?.totalSpend / 1000000).toFixed(1) : '0'}M AT RISK
                </div>
                <div className="text-xs text-red-600 font-medium">Most vulnerable equipment category</div>
              </div>
              
              <div className="bg-orange-50 border-l-8 border-orange-500 p-3 rounded-r-lg shadow-md">
                <div className="text-lg lg:text-xl font-black text-orange-600 mb-1">
                  US TARIFF IMPACT
                </div>
                <div className="text-base font-bold text-orange-700">
                  {analysisData?.tariffData?.length || 0} CATEGORIES AFFECTED
                </div>
                <div className="text-xs text-orange-600 font-medium">25% tariff simulation results</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>
              ACTION PLAN
            </h2>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">1</div>
                  <div className="text-base font-black text-red-800">IMMEDIATE</div>
                </div>
                <div className="text-xs font-bold text-red-700">Increase buffer stock for US-sourced equipment</div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">2</div>
                  <div className="text-base font-black text-orange-800">SHORT-TERM</div>
                </div>
                <div className="text-xs font-bold text-orange-700">Diversify suppliers across stable regions</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">3</div>
                  <div className="text-base font-black text-blue-800">STRATEGIC</div>
                </div>
                <div className="text-xs font-bold text-blue-700">Negotiate tariff protection clauses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call-to-Action */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-3 text-center shadow-2xl">
          <div className="text-lg lg:text-xl font-black text-white mb-1">
            FOCUS: ELECTRICAL EQUIPMENT ONLY
          </div>
          <div className="text-sm text-gray-300 font-bold">
            {equipmentVendorsLength} international vendor records analyzed | Canadian suppliers excluded (no tariffs)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummarySlide; 