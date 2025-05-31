import React from 'react';
import { Shield, TrendingUp, Users } from 'lucide-react';
import { Colors } from './types';

interface ChallengesSlideProps {
  colors: Colors;
}

const ChallengesSlide: React.FC<ChallengesSlideProps> = ({ colors }) => {
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
          <h1 className="text-5xl font-bold text-white mb-4">Supply Chain Vulnerabilities</h1>
          <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400"></div>
          <p className="text-xl text-blue-100 mt-4 max-w-4xl mx-auto">
            Critical risk factors threatening BC Hydro's supply chain resilience
          </p>
        </div>

        <div className="flex-grow max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 h-full hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.chartRed}20` }}
                  >
                    <Shield className="w-12 h-12" style={{ color: colors.chartRed }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                    Geopolitical Risks
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Trade war tensions</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Tariff uncertainties</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Supply route disruptions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 h-full hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.chartOrange}20` }}
                  >
                    <TrendingUp className="w-12 h-12" style={{ color: colors.chartOrange }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                    Economic Factors
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Currency fluctuations</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Inflation pressures</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Rising transportation costs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 h-full hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${colors.lightGreen}20` }}
                  >
                    <Users className="w-12 h-12" style={{ color: colors.lightGreen }} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                    Operational Risks
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Single-source dependencies</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Extended lead times</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-lg font-medium text-gray-700">Quality assurance</span>
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

export default ChallengesSlide; 