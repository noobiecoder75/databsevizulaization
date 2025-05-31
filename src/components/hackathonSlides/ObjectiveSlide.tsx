import React from 'react';
import { Target, HelpCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Colors } from './types';

interface ObjectiveSlideProps {
  colors: Colors;
}

const ObjectiveSlide: React.FC<ObjectiveSlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.lightGrey} 0%, #E8F4FD 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-3"></div>
      </div>

      <div className="relative z-0">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.primary }}>
            Project Objective
          </h1>
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.primary }}></div>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Strategic analysis to strengthen BC Hydro's supply chain resilience
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Objective Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-white/50 mb-8 hover:shadow-3xl transition-all duration-300">
            <div className="text-center mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Target className="w-16 h-16" style={{ color: colors.primary }} />
              </div>
              <h2 className="text-5xl font-bold mb-4" style={{ color: colors.primary }}>
                Identify Supply Chain Vulnerabilities & Strategic Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Comprehensive analysis to mitigate risks and ensure long-term operational reliability
              </p>
            </div>
          </div>

          {/* Key Questions and Expected Outcomes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Questions Card */}
            <div className="group">
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
              >
                <div className="flex items-center mb-6">
                  <div 
                    className="p-4 rounded-2xl mr-4"
                    style={{ backgroundColor: `${colors.accent}20` }}
                  >
                    <HelpCircle className="w-8 h-8" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: colors.accent }}>
                    Key Questions
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.accent }}></div>
                    <span className="text-lg font-medium text-gray-700">Which categories are most vulnerable?</span>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.accent }}></div>
                    <span className="text-lg font-medium text-gray-700">What are the tariff impact scenarios?</span>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.accent }}></div>
                    <span className="text-lg font-medium text-gray-700">Where are diversification opportunities?</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Critical analysis questions driving our research</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Outcomes Card */}
            <div className="group">
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
              >
                <div className="flex items-center mb-6">
                  <div 
                    className="p-4 rounded-2xl mr-4"
                    style={{ backgroundColor: `${colors.info}20` }}
                  >
                    <Lightbulb className="w-8 h-8" style={{ color: colors.info }} />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: colors.primary }}>
                    Expected Outcomes
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.info }}></div>
                    <span className="text-lg font-medium text-gray-700">Risk assessment framework</span>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.info }}></div>
                    <span className="text-lg font-medium text-gray-700">Strategic recommendations</span>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.info }}></div>
                    <span className="text-lg font-medium text-gray-700">Actionable insights</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>Deliverables to enhance supply chain resilience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom highlight */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-white/50">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-lg font-semibold" style={{ color: colors.primary }}>
                Data-Driven Approach to Supply Chain Transformation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveSlide; 