import React from 'react';
import { Target, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Colors, AnalysisData } from './types';

interface RecommendationsSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const RecommendationsSlide: React.FC<RecommendationsSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">STRATEGIC RECOMMENDATIONS</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Short-term Strategies */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.danger }}>
              <Target className="w-8 h-8 inline mr-3" />
              SHORT-TERM (6-18 MONTHS)
            </h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center text-sm font-black mr-2">1</div>
                  <h3 className="font-black text-lg">IMMEDIATE BUFFER INCREASE</h3>
                </div>
                <p className="text-sm font-bold">
                  Increase safety stock by 75% for all US-sourced equipment categories to minimize tariff impact
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Investment: $2-3M | Risk reduction: 60%</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-orange-600 rounded-full flex items-center justify-center text-sm font-black mr-2">2</div>
                  <h3 className="font-black text-lg">SUPPLIER DIVERSIFICATION</h3>
                </div>
                <p className="text-sm font-bold">
                  Activate backup suppliers in Europe and Asia for top 5 vulnerable categories
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Timeline: 12 months | Cost: $500K setup</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-yellow-600 rounded-full flex items-center justify-center text-sm font-black mr-2">3</div>
                  <h3 className="font-black text-lg">CONTRACT RENEGOTIATION</h3>
                </div>
                <p className="text-sm font-bold">
                  Add tariff protection clauses to all major supplier agreements
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Target: Top 15 vendors | Potential savings: $1-2M</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Long-term Strategies */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.accent }}>
              <TrendingUp className="w-8 h-8 inline mr-3" />
              LONG-TERM (2-5 YEARS)
            </h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  <h3 className="font-black text-lg">DOMESTIC MANUFACTURING</h3>
                </div>
                <p className="text-sm font-bold mb-2">
                  Partner with Canadian manufacturers to develop domestic electrical equipment production capabilities
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Investment: $10-15M | Timeline: 3-5 years</div>
                  <div className="font-bold">Risk reduction: 80% | Long-term savings: $5M/year</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="font-black text-lg">STRATEGIC PARTNERSHIPS</h3>
                </div>
                <p className="text-sm font-bold mb-2">
                  Establish joint ventures with stable international suppliers in non-tariff regions
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">Focus: Europe, South Korea, Japan</div>
                  <div className="font-bold">Guaranteed supply + Cost stability</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 mr-2" />
                  <h3 className="font-black text-lg">TECHNOLOGY INVESTMENT</h3>
                </div>
                <p className="text-sm font-bold mb-2">
                  Invest in advanced inventory management and predictive analytics for supply chain optimization
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs">
                  <div className="font-bold">ROI: 300% over 5 years | Efficiency gains: 25%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Impact Summary */}
        <div className="mt-6 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-4 text-center shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-2xl font-black text-red-300">
                ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
              </div>
              <div className="text-sm font-bold">ANNUAL RISK EXPOSURE</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-300">80%</div>
              <div className="text-sm font-bold">RISK REDUCTION TARGET</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-300">3-5 YEARS</div>
              <div className="text-sm font-bold">FULL IMPLEMENTATION</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSlide; 