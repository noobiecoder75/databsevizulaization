import React from 'react';

interface AnalysisData {
  tariffData: Array<{ category: string; tariffCost: number; currentSpend: number; vendors: number }>;
}

interface ImmediateActionsSlideProps {
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

const ImmediateActionsSlide: React.FC<ImmediateActionsSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Strategic Objectives</h1>
        <h2 className="text-xl text-gray-600 font-semibold">Risk Mitigation Timeline</h2>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          
          {/* Short Term Column */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Short Term</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              
              <div className="bg-slate-600 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  <h3 className="font-bold text-sm text-white">Strengthen Non-USA Vendor Relationships</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Build stronger partnerships with European and Asian suppliers to reduce US dependency
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Target: Key alternate suppliers</div>
                  <div className="font-bold">Timeline: 6 months</div>
                </div>
              </div>
              
              <div className="bg-gray-600 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  <h3 className="font-bold text-sm text-white">Increase Safety Stock</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Boost inventory buffers for vulnerable categories by 50-100%
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Target: {analysisData?.tariffData.length || 0} categories</div>
                  <div className="font-bold">Priority: Critical components</div>
                </div>
              </div>
              
              <div className="bg-blue-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  <h3 className="font-bold text-sm text-white">Government Engagement</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Lobby for better inter-provincial trade and stronger ties with alternative supplier countries
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Focus: Policy advocacy</div>
                  <div className="font-bold">Trade relationship building</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Medium Term Column */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Medium Term</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              
              <div className="bg-indigo-700 p-6 rounded-xl text-white shadow-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
                  <h3 className="font-bold text-lg text-white">Diversify Supplier Countries</h3>
                </div>
                <p className="text-sm font-medium mb-4">
                  Establish procurement relationships across multiple regions to reduce geographic concentration risk
                </p>
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="font-bold text-sm mb-2">Geographic Strategy</div>
                  <div className="text-xs font-semibold">• Europe: 30% allocation</div>
                  <div className="text-xs font-semibold">• Asia: 25% allocation</div>
                  <div className="text-xs font-semibold">• Americas (non-US): 20% allocation</div>
                  <div className="text-xs font-semibold">• Canada: 25% allocation</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Long Term Column */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Long Term</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              
              <div className="bg-slate-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  <h3 className="font-bold text-sm text-white">Find Alternate Suppliers</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Identify and qualify alternative sources for most vulnerable parts
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Timeline: 2-3 years</div>
                  <div className="font-bold">Focus: Critical vulnerabilities</div>
                </div>
              </div>
              
              <div className="bg-stone-600 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  <h3 className="font-bold text-sm text-white">Increase Warehouse Space</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Expand storage capacity to support higher safety stock levels
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Capacity: 50% increase</div>
                  <div className="font-bold">Strategic locations</div>
                </div>
              </div>
              
              <div className="bg-emerald-800 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">7</div>
                  <h3 className="font-bold text-sm text-white">Build Canadian Capacity</h3>
                </div>
                <p className="text-xs font-medium mb-3">
                  Develop domestic supply capacity for critical components
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Investment: Local suppliers</div>
                  <div className="font-bold">Self-sufficiency goals</div>
                </div>
              </div>
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

export default ImmediateActionsSlide; 