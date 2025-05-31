import React from 'react';
import { Colors, AnalysisData } from './types';

interface StrategicTransformationSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const StrategicTransformationSlide: React.FC<StrategicTransformationSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-8" style={{ backgroundColor: colors.light }}>
      {/* Title */}
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Strategic Transformation</h1>
      <h2 className="text-xl text-gray-600 mb-8 font-semibold">(6-24 Months)</h2>
      
      <div className="relative pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" style={{ height: 'calc(100% - 8rem)' }}>
          
          {/* Diversification Column */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Diversification</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">European Partnerships</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Establish relationships with German and Nordic suppliers
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Focus: High-quality manufacturers</div>
                  <div className="font-bold">Timeline: 12-18 months</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Asian Market Entry</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Qualify Japanese and South Korean manufacturers
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Target: Premium suppliers</div>
                  <div className="font-bold">Risk: Lower than US sources</div>
                </div>
              </div>
              
              <div className="bg-purple-600 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Regional Hubs</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Leverage Mexico and Canadian manufacturing
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Advantage: NAFTA benefits</div>
                  <div className="font-bold">Cost: 15-20% savings</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Innovation Column */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Innovation</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div style={{ backgroundColor: colors.warning }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Local Manufacturing</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Partner with Canadian firms for equipment assembly
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Investment: $5-8M</div>
                  <div className="font-bold">ROI: 3-4 years</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Technology Upgrade</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Invest in digital twin and predictive maintenance
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">AI-powered monitoring</div>
                  <div className="font-bold">30% efficiency gain</div>
                </div>
              </div>
              
              <div className="bg-indigo-600 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Joint Ventures</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Co-develop next-gen equipment with partners
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Shared R&D costs</div>
                  <div className="font-bold">IP ownership rights</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Operations Column */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Operations</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="bg-gray-600 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Flexible Contracts</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Multi-source agreements with automatic switching
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Dynamic pricing</div>
                  <div className="font-bold">Risk mitigation</div>
                </div>
              </div>
              
              <div className="bg-teal-600 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Risk Analytics</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  AI-powered supply chain risk monitoring
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">Real-time alerts</div>
                  <div className="font-bold">Predictive models</div>
                </div>
              </div>
              
              <div className="bg-orange-600 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg text-white mb-2">Scenario Planning</h3>
                <p className="text-sm font-medium opacity-90 mb-2">
                  Quarterly stress testing of supply strategies
                </p>
                <div className="bg-white/20 p-2 rounded-lg text-sm">
                  <div className="font-bold">What-if analysis</div>
                  <div className="font-bold">Contingency plans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Target Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-4 text-center shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-2xl font-bold">35% → 15%</div>
              <div className="text-sm font-semibold">US Dependency Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$8-12M</div>
              <div className="text-sm font-semibold">Estimated Investment</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$15-25M</div>
              <div className="text-sm font-semibold">Annual Savings Potential</div>
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold opacity-90">
            Target completion: 2026
          </div>
        </div>
        
        {/* Logo Space - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-28 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default StrategicTransformationSlide; 