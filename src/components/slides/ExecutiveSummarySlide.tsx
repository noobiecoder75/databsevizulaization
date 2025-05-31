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
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800">Executive Summary</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 space-y-4 overflow-hidden">
        {/* Question Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">?</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Question</span>
          </div>
          <div className="border-2 border-dashed border-cyan-400 bg-cyan-50 rounded-lg p-3">
            <h2 className="text-lg font-semibold text-gray-800">
              How can BC Hydro Protect Vulnerable Components Despite Supply Chain Uncertainties?
            </h2>
          </div>
        </div>

        {/* Key Risks Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚠</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Key Risks</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div style={{ backgroundColor: colors.primary }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm mb-1">Low Risk Tolerance</div>
              <div className="text-xs">Categories are Vulnerable to supply chain disruption</div>
            </div>
            <div style={{ backgroundColor: colors.primary }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm mb-1">Long Lead times –</div>
              <div className="text-xs">almost/more than 3 years</div>
            </div>
            <div style={{ backgroundColor: colors.primary }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm mb-1">Possible 25% USA Tariffs</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">🔍</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Analysis</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div style={{ backgroundColor: colors.accent }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm">
                {analysisData?.vulnerableCategories?.[0]?.category?.includes('Switchgear') ? 'Switchgear' : 
                 analysisData?.vulnerableCategories?.[0]?.category || 'Switchgear'} is the most vulnerable component
              </div>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm text-white">Lead times unlikely to improve</div>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm">Alternate Sources Are Available</div>
            </div>
          </div>
        </div>

        {/* Strategic Response Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Strategic Response</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div style={{ backgroundColor: colors.info }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm">Enact dual-supplier policies</div>
            </div>
            <div style={{ backgroundColor: colors.info }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm">Increase safety stock supply</div>
            </div>
            <div style={{ backgroundColor: colors.info }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm">Lobby for Canadian Manufacturing</div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-base font-semibold text-gray-800">
              Switchgear example informs wider strategy/tactics can extend to other components
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end px-8 py-4">
        <div className="w-32 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummarySlide; 