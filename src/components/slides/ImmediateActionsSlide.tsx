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
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">IMMEDIATE ACTIONS (0-6 MONTHS)</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Left Column - Inventory Management */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>INVENTORY MANAGEMENT</h2>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-red-600 rounded-full flex items-center justify-center text-sm font-black mr-3">1</div>
                  <h3 className="font-black text-sm text-white">INCREASE US EQUIPMENT BUFFERS</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Boost safety stock for vulnerable categories by 50-100% before tariffs take effect
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Target: {analysisData?.tariffData.length || 0} categories</div>
                  <div className="font-bold">Timeline: 60 days</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-yellow-600 rounded-full flex items-center justify-center text-sm font-black mr-3">2</div>
                  <h3 className="font-black text-sm text-white">ACCELERATE PENDING ORDERS</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Fast-track Q1-Q2 procurement to avoid tariff impact
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Potential savings: $2-4M</div>
                  <div className="font-bold">Priority: US sourced equipment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-black mr-3">3</div>
                  <h3 className="font-black text-sm text-white">CONTRACT RENEGOTIATION</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Add tariff protection clauses to existing agreements
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Priority: Top 10 vendors</div>
                  <div className="font-bold">Cost protection mechanisms</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Supplier Engagement */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>SUPPLIER ENGAGEMENT</h2>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-green-600 rounded-full flex items-center justify-center text-sm font-black mr-3">4</div>
                  <h3 className="font-black text-sm text-white">ALTERNATIVE SOURCING</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Activate backup suppliers in Europe and Asia for critical items
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Lead time: 60-90 days</div>
                  <div className="font-bold">Focus: High-risk categories</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-purple-600 rounded-full flex items-center justify-center text-sm font-black mr-3">5</div>
                  <h3 className="font-black text-sm text-white">RISK COMMUNICATION</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Notify all US suppliers of potential supply disruptions
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Timeline: Within 2 weeks</div>
                  <div className="font-bold">Stakeholder alignment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 bg-white text-orange-600 rounded-full flex items-center justify-center text-sm font-black mr-3">6</div>
                  <h3 className="font-black text-sm text-white">MONITORING SYSTEM</h3>
                </div>
                <p className="text-xs font-bold mb-3 flex-1">
                  Implement daily tracking of tariff policy developments
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Resource: 1 FTE analyst</div>
                  <div className="font-bold">Real-time alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmediateActionsSlide; 