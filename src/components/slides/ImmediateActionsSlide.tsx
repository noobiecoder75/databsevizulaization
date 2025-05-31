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
        <h1 className="text-5xl font-bold text-gray-800">Immediate Actions</h1>
        <h2 className="text-xl text-gray-600 font-semibold">(0-6 Months)</h2>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column - Inventory Management */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>Inventory Management</h2>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              <div style={{ backgroundColor: colors.secondary }} className="p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
                  <h3 className="font-bold text-lg text-white">Increase US Equipment Buffers</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Boost safety stock for vulnerable categories by 50-100% before tariffs take effect
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Target: {analysisData?.tariffData.length || 0} categories</div>
                  <div className="font-bold">Timeline: 60 days</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.warning }} className="p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
                  <h3 className="font-bold text-lg text-white">Accelerate Pending Orders</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Fast-track Q1-Q2 procurement to avoid tariff impact
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Potential savings: $2-4M</div>
                  <div className="font-bold">Priority: US sourced equipment</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
                  <h3 className="font-bold text-lg text-white">Contract Renegotiation</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Add tariff protection clauses to existing agreements
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Priority: Top 10 vendors</div>
                  <div className="font-bold">Cost protection mechanisms</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Supplier Engagement */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>Supplier Engagement</h2>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              <div style={{ backgroundColor: colors.accent }} className="p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
                  <h3 className="font-bold text-lg text-white">Alternative Sourcing</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Activate backup suppliers in Europe and Asia for critical items
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Lead time: 60-90 days</div>
                  <div className="font-bold">Focus: High-risk categories</div>
                </div>
              </div>
              
              <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">5</div>
                  <h3 className="font-bold text-lg text-white">Risk Communication</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Notify all US suppliers of potential supply disruptions
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Timeline: Within 2 weeks</div>
                  <div className="font-bold">Stakeholder alignment</div>
                </div>
              </div>
              
              <div className="bg-orange-600 p-6 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-4">6</div>
                  <h3 className="font-bold text-lg text-white">Monitoring System</h3>
                </div>
                <p className="text-sm font-medium mb-4 flex-1">
                  Implement daily tracking of tariff policy developments
                </p>
                <div className="bg-white/20 p-3 rounded-lg text-sm">
                  <div className="font-bold">Resource: 1 FTE analyst</div>
                  <div className="font-bold">Real-time alerts</div>
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