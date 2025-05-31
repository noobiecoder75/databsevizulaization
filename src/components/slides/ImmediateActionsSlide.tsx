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
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">IMMEDIATE ACTIONS (0-6 MONTHS)</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-[calc(100%-6rem)] max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>INVENTORY MANAGEMENT</h2>
            <div className="space-y-2 h-full flex flex-col justify-around">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center text-base font-black mr-2">1</div>
                  <h3 className="font-black text-base text-white">INCREASE US EQUIPMENT BUFFERS</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Boost safety stock for vulnerable categories by 50-100% before tariffs take effect
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Target: {analysisData?.tariffData.length || 0} categories</div>
                  <div className="font-bold">Timeline: 60 days</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-yellow-600 rounded-full flex items-center justify-center text-base font-black mr-2">2</div>
                  <h3 className="font-black text-base text-white">ACCELERATE PENDING ORDERS</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Fast-track Q1-Q2 procurement to avoid tariff impact
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Potential savings: $2-4M</div>
                  <div className="font-bold">Priority: US sourced equipment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-base font-black mr-2">3</div>
                  <h3 className="font-black text-base text-white">CONTRACT RENEGOTIATION</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Add tariff protection clauses to existing agreements
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Priority: Top 10 vendors</div>
                  <div className="font-bold">Cost protection mechanisms</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>SUPPLIER ENGAGEMENT</h2>
            <div className="space-y-2 h-full flex flex-col justify-around">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center text-base font-black mr-2">4</div>
                  <h3 className="font-black text-base text-white">ALTERNATIVE SOURCING</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Activate backup suppliers in Europe and Asia for critical items
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Lead time: 60-90 days</div>
                  <div className="font-bold">Focus: High-risk categories</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center text-base font-black mr-2">5</div>
                  <h3 className="font-black text-base text-white">RISK COMMUNICATION</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Notify all US suppliers of potential supply disruptions
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Timeline: Within 2 weeks</div>
                  <div className="font-bold">Stakeholder alignment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-orange-600 rounded-full flex items-center justify-center text-base font-black mr-2">6</div>
                  <h3 className="font-black text-base text-white">MONITORING SYSTEM</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Implement daily tracking of tariff policy developments
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
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