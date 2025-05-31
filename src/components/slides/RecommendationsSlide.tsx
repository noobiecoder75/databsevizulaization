import React from 'react';
import { Target, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Colors, AnalysisData } from './types';

interface RecommendationsSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const RecommendationsSlide: React.FC<RecommendationsSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Strategic Recommendations</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ height: 'calc(100% - 8rem)' }}>
          
          {/* Short-term Strategies */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
              <Target className="w-6 h-6 inline mr-2" />
              Short-Term (6-18 Months)
            </h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <h3 className="font-bold text-lg">Immediate Buffer Increase</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Increase safety stock by 75% for all US-sourced equipment to minimize tariff impact
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Investment: $2-3M | Risk reduction: 60%</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.warning }} className="p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <h3 className="font-bold text-lg">Supplier Diversification</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Activate backup suppliers in Europe and Asia for top 5 vulnerable categories
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Timeline: 12 months | Cost: $500K setup</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-gray-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <h3 className="font-bold text-lg">Contract Renegotiation</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Add tariff protection clauses to all major supplier agreements
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Top 15 vendors | Savings: $1-2M</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Long-term Strategies */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.accent }}>
              <TrendingUp className="w-6 h-6 inline mr-2" />
              Long-Term (2-5 Years)
            </h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div style={{ backgroundColor: colors.primary }} className="p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  <h3 className="font-bold text-lg">Domestic Manufacturing</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Partner with Canadian manufacturers for domestic electrical equipment production
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Investment: $10-15M | Timeline: 3-5 years</div>
                  <div className="font-bold">Risk reduction: 80% | Savings: $5M/year</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="font-bold text-lg">Strategic Partnerships</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Establish joint ventures with stable international suppliers in non-tariff regions
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Focus: Europe, South Korea, Japan</div>
                  <div className="font-bold">Guaranteed supply + Cost stability</div>
                </div>
              </div>
              
              <div className="bg-purple-600 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 mr-2" />
                  <h3 className="font-bold text-lg">Technology Investment</h3>
                </div>
                <p className="text-sm font-medium mb-3">
                  Invest in advanced inventory management and predictive analytics
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">ROI: 300% over 5 years | Efficiency: 25%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Impact Summary */}
        <div className="bg-gray-800 rounded-xl p-4 text-center shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-2xl font-bold text-red-300">
                ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
              </div>
              <div className="text-sm font-semibold">Annual Risk Exposure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">80%</div>
              <div className="text-sm font-semibold">Risk Reduction Target</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-300">3-5 Years</div>
              <div className="text-sm font-semibold">Full Implementation</div>
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

export default RecommendationsSlide; 