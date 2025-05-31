import React from 'react';
import { Shield, Map, Target, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Colors } from './types';

interface ConclusionSlideProps {
  colors: Colors;
}

const ConclusionSlide: React.FC<ConclusionSlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full p-12 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.darkGreen} 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-0">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-6">Key Takeaways</h1>
          <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400"></div>
          <p className="text-xl text-blue-100 mt-4 max-w-4xl mx-auto">
            Strategic insights for BC Hydro's supply chain resilience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {/* Critical Vulnerabilities Card */}
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
                  Critical Vulnerabilities
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">Switchgear most at-risk</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">US dependency threatens supply</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">$245M+ tariff exposure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Opportunities Card */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 h-full hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${colors.teal}20` }}
                >
                  <Map className="w-12 h-12" style={{ color: colors.teal }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  Global Opportunities
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">European alternatives exist</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">High LPI countries available</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">Diversification feasible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Required Card */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 h-full hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${colors.lightGreen}20` }}
                >
                  <Target className="w-12 h-12" style={{ color: colors.lightGreen }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  Action Required
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">Immediate diversification</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">Strategic partnerships</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-700">Government engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl p-8 shadow-2xl border border-yellow-200">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4" style={{ color: colors.navy }}>
                BC Hydro Must Act Now to Safeguard Long-Term Reliability
              </h2>
              <p className="text-xl font-medium text-gray-700 mb-6">
                The window for proactive supply chain diversification is closing. Strategic action today ensures energy security tomorrow.
              </p>
              <div className="flex justify-center items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-lg font-semibold" style={{ color: colors.navy }}>
                  Immediate Implementation Required
                </span>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConclusionSlide; 