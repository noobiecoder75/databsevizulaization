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
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">EXECUTIVE SUMMARY</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        
        {/* Top Impact Numbers - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-3 text-white text-center shadow-lg">
            <div className="text-2xl lg:text-3xl font-black mb-1">
              ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
            </div>
            <div className="text-sm lg:text-base font-bold opacity-90">TARIFF RISK</div>
            <div className="text-xs opacity-75 mt-1">Annual cost exposure</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-3 text-white text-center shadow-lg">
            <div className="text-2xl lg:text-3xl font-black mb-1">
              {analysisData?.vulnerableCategories.length || 0}
            </div>
            <div className="text-sm lg:text-base font-bold opacity-90">HIGH RISK</div>
            <div className="text-xs opacity-75 mt-1">Critical categories</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 text-white text-center shadow-lg">
            <div className="text-2xl lg:text-3xl font-black mb-1">
              ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
            </div>
            <div className="text-sm lg:text-base font-bold opacity-90">TOTAL VALUE</div>
            <div className="text-xs opacity-75 mt-1">Equipment portfolio</div>
          </div>
        </div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3" style={{ height: 'calc(100% - 12rem)' }}>
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.danger }}>
              CRITICAL RISKS
            </h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg shadow-md">
                <div className="text-sm lg:text-base font-black text-red-600 mb-1">
                  {analysisData?.vulnerableCategories?.[0]?.category && analysisData.vulnerableCategories[0].category.length > 25 ? 
                    analysisData.vulnerableCategories[0].category.substring(0, 25) + '...' : 
                    analysisData?.vulnerableCategories?.[0]?.category || 'Loading...'}
                </div>
                <div className="text-base font-bold text-red-700">
                  ${analysisData ? (analysisData.vulnerableCategories?.[0]?.totalSpend / 1000000).toFixed(1) : '0'}M AT RISK
                </div>
                <div className="text-xs text-red-600 font-medium">Most vulnerable equipment</div>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg shadow-md">
                <div className="text-sm lg:text-base font-black text-orange-600 mb-1">
                  US TARIFF IMPACT
                </div>
                <div className="text-sm font-bold text-orange-700">
                  {analysisData?.tariffData?.length || 0} CATEGORIES AFFECTED
                </div>
                <div className="text-xs text-orange-600 font-medium">25% tariff simulation</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.accent }}>
              ACTION PLAN
            </h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black mr-2">1</div>
                  <div className="text-sm font-black text-red-800">IMMEDIATE</div>
                </div>
                <div className="text-xs font-bold text-red-700">Increase buffer stock for US equipment</div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black mr-2">2</div>
                  <div className="text-sm font-black text-orange-800">SHORT-TERM</div>
                </div>
                <div className="text-xs font-bold text-orange-700">Diversify suppliers globally</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-black mr-2">3</div>
                  <div className="text-sm font-black text-blue-800">STRATEGIC</div>
                </div>
                <div className="text-xs font-bold text-blue-700">Negotiate protection clauses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call-to-Action */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-3 text-center shadow-2xl">
          <div className="text-base lg:text-lg font-black text-white mb-1">
            FOCUS: ELECTRICAL EQUIPMENT ONLY
          </div>
          <div className="text-xs lg:text-sm text-gray-300 font-bold">
            {equipmentVendorsLength} international vendors | Canadian suppliers excluded
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummarySlide; 