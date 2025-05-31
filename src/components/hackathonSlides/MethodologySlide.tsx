import React from 'react';
import { Database, BarChart3 } from 'lucide-react';
import { Colors } from './types';

interface MethodologySlideProps {
  colors: Colors;
}

const MethodologySlide: React.FC<MethodologySlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.darkGreen} 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-0 h-full flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Data & Methodology</h1>
          <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400"></div>
          <p className="text-xl text-blue-100 mt-4 max-w-4xl mx-auto">
            Comprehensive analytical framework for supply chain risk assessment
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 flex-grow max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div>
              <div className="flex items-center mb-6">
                <div 
                  className="p-4 rounded-2xl mr-4"
                  style={{ backgroundColor: `${colors.darkGreen}20` }}
                >
                  <Database className="w-8 h-8" style={{ color: colors.darkGreen }} />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>Data Sources</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>BC Hydro Vendor Data</h4>
                  <p className="text-sm text-gray-600 mt-1">Internal procurement records, vendor performance metrics</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>WTO Tariff Database</h4>
                  <p className="text-sm text-gray-600 mt-1">HS code-specific tariff rates (Conceptual)</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>World Bank LPI</h4>
                  <p className="text-sm text-gray-600 mt-1">Logistics performance indicators (Conceptual)</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>UN Comtrade</h4>
                  <p className="text-sm text-gray-600 mt-1">International trade statistics (Conceptual)</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-6">
                <div 
                  className="p-4 rounded-2xl mr-4"
                  style={{ backgroundColor: `${colors.teal}20` }}
                >
                  <BarChart3 className="w-8 h-8" style={{ color: colors.teal }} />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: colors.navy }}>Analysis Steps</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.darkGreen }}>
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>Risk Assessment</h4>
                    <p className="text-sm text-gray-600">Category vulnerability scoring</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-green-50/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.lightGreen }}>
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>Supplier Analysis</h4>
                    <p className="text-sm text-gray-600">Geographic concentration mapping</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-orange-50/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.chartOrange }}>
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>Trade Analysis</h4>
                    <p className="text-sm text-gray-600">Alternative sourcing identification</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-purple-50/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>Scenario Modeling</h4>
                    <p className="text-sm text-gray-600">Tariff impact simulations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide; 