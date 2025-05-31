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
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Executive Summary</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        {/* Question Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">?</span>
            </div>
            <span className="text-2xl font-semibold text-gray-700">Question</span>
          </div>
          <div className="border-2 border-dashed border-cyan-400 bg-cyan-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              How can BC Hydro Protect Vulnerable Components Despite Supply Chain Uncertainties?
            </h2>
          </div>
        </div>

        {/* Key Risks Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚠</span>
            </div>
            <span className="text-2xl font-semibold text-gray-700">Key Risks</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div style={{ backgroundColor: colors.primary }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Low Risk Tolerance</div>
              <div className="text-xs">Categories are Vulnerable to supply chain disruption</div>
            </div>
            <div style={{ backgroundColor: colors.primary }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Long Lead times –</div>
              <div className="text-xs">almost/more than 3 years</div>
            </div>
            <div style={{ backgroundColor: colors.primary }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Possible 25% USA Tariffs</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🔍</span>
            </div>
            <span className="text-2xl font-semibold text-gray-700">Analysis</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div style={{ backgroundColor: colors.accent }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">
                {analysisData?.vulnerableCategories?.[0]?.category?.includes('Switchgear') ? 'Switchgear' : 
                 analysisData?.vulnerableCategories?.[0]?.category || 'Switchgear'} is the most vulnerable component
              </div>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2 text-red-300">Lead times unlikely to improve</div>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Alternate Sources Are Available</div>
            </div>
          </div>
        </div>

        {/* Strategic Response Section */}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <span className="text-2xl font-semibold text-gray-700">Strategic Response</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div style={{ backgroundColor: colors.info }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Enact dual-supplier policies</div>
            </div>
            <div style={{ backgroundColor: colors.info }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Increase safety stock supply</div>
            </div>
            <div style={{ backgroundColor: colors.info }} className="text-white p-4 rounded-lg text-center">
              <div className="font-bold text-sm mb-2">Lobby for Canadian Manufacturing</div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Switchgear proxy example strategies can be extrapolated to other vulnerable components
            </div>
            <div className="text-red-600 font-bold text-lg">Or</div>
            <div className="text-lg font-semibold text-gray-800">
              Switchgear example informs wider strategy/tactics can extend to other components
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end p-8 pt-4">
        <div className="w-32 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummarySlide; 