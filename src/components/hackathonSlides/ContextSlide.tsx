import React from 'react';
import { Map, TrendingUp, Zap, Users } from 'lucide-react';
import { Colors } from './types';

interface ContextSlideProps {
  colors: Colors;
}

const ContextSlide: React.FC<ContextSlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full p-12 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.lightGrey} 0%, #E8F4FD 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-0">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.navy }}>
            BC Hydro: Powering British Columbia
          </h1>
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Leading the province's energy transformation through innovative supply chain management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Service Area Card */}
          <div className="group">
            <div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
            >
              <div className="flex items-center mb-6">
                <div 
                  className="p-4 rounded-2xl mr-4"
                  style={{ backgroundColor: `${colors.teal}20` }}
                >
                  <Map className="w-12 h-12" style={{ color: colors.teal }} />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: colors.navy }}>
                  Service Area
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                  <span className="text-lg font-medium text-gray-700">Serves 95% of BC's population</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                  <span className="text-lg font-medium text-gray-700">5+ million customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                  <span className="text-lg font-medium text-gray-700">464,000 km² service territory</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                  <span className="text-lg font-medium text-gray-700">Critical infrastructure reliability</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Essential utility services across British Columbia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Procurement Growth Card */}
          <div className="group">
            <div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
            >
              <div className="flex items-center mb-6">
                <div 
                  className="p-4 rounded-2xl mr-4"
                  style={{ backgroundColor: `${colors.lightGreen}20` }}
                >
                  <TrendingUp className="w-12 h-12" style={{ color: colors.lightGreen }} />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: colors.navy }}>
                  Procurement Growth
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chartRed }}></div>
                  <span className="text-lg font-medium text-gray-700">Annual spend: $650M → $2B</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chartRed }}></div>
                  <span className="text-lg font-medium text-gray-700">300% growth in procurement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chartRed }}></div>
                  <span className="text-lg font-medium text-gray-700">Complex supply chain challenges</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.chartRed }}></div>
                  <span className="text-lg font-medium text-gray-700">Need for risk mitigation</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Strategic supply chain transformation required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-white/50">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-lg font-semibold" style={{ color: colors.navy }}>
              Critical Challenge: Supply Chain Vulnerability Management
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextSlide; 