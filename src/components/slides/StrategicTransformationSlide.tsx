import React from 'react';
import { Colors, AnalysisData } from './types';

interface StrategicTransformationSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const StrategicTransformationSlide: React.FC<StrategicTransformationSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">STRATEGIC TRANSFORMATION (6-24 MONTHS)</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          
          {/* Diversification Column */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.primary }}>DIVERSIFICATION</h2>
            <div className="flex-1 space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">EUROPEAN PARTNERSHIPS</h3>
                <p className="text-xs font-bold opacity-90">
                  Establish relationships with German and Nordic suppliers
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Focus: High-quality manufacturers</div>
                  <div className="font-bold">Timeline: 12-18 months</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">ASIAN MARKET ENTRY</h3>
                <p className="text-xs font-bold opacity-90">
                  Qualify Japanese and South Korean manufacturers
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Target: Premium suppliers</div>
                  <div className="font-bold">Risk: Lower than US sources</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">REGIONAL HUBS</h3>
                <p className="text-xs font-bold opacity-90">
                  Leverage Mexico and Canadian manufacturing
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Advantage: NAFTA benefits</div>
                  <div className="font-bold">Cost: 15-20% savings</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Innovation Column */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.primary }}>INNOVATION</h2>
            <div className="flex-1 space-y-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">LOCAL MANUFACTURING</h3>
                <p className="text-xs font-bold opacity-90">
                  Partner with Canadian firms for equipment assembly
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Investment: $5-8M</div>
                  <div className="font-bold">ROI: 3-4 years</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">TECHNOLOGY UPGRADE</h3>
                <p className="text-xs font-bold opacity-90">
                  Invest in digital twin and predictive maintenance
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">AI-powered monitoring</div>
                  <div className="font-bold">30% efficiency gain</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">JOINT VENTURES</h3>
                <p className="text-xs font-bold opacity-90">
                  Co-develop next-gen equipment with partners
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Shared R&D costs</div>
                  <div className="font-bold">IP ownership rights</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Operations Column */}
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.primary }}>OPERATIONS</h2>
            <div className="flex-1 space-y-3">
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">FLEXIBLE CONTRACTS</h3>
                <p className="text-xs font-bold opacity-90">
                  Multi-source agreements with automatic switching
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Dynamic pricing</div>
                  <div className="font-bold">Risk mitigation</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">RISK ANALYTICS</h3>
                <p className="text-xs font-bold opacity-90">
                  AI-powered supply chain risk monitoring
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">Real-time alerts</div>
                  <div className="font-bold">Predictive models</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-2">SCENARIO PLANNING</h3>
                <p className="text-xs font-bold opacity-90">
                  Quarterly stress testing of supply strategies
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-xs mt-2">
                  <div className="font-bold">What-if analysis</div>
                  <div className="font-bold">Contingency plans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Target Section */}
        <div className="mt-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-4 text-center shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-xl font-black">35% → 15%</div>
              <div className="text-sm font-bold">US DEPENDENCY REDUCTION</div>
            </div>
            <div>
              <div className="text-xl font-black">$8-12M</div>
              <div className="text-sm font-bold">ESTIMATED INVESTMENT</div>
            </div>
            <div>
              <div className="text-xl font-black">$15-25M</div>
              <div className="text-sm font-bold">ANNUAL SAVINGS POTENTIAL</div>
            </div>
          </div>
          <div className="mt-2 text-sm font-bold opacity-90">
            Target completion: 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicTransformationSlide; 