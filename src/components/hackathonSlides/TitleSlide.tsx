import React from 'react';
import { Colors } from './types';

interface TitleSlideProps {
  colors: Colors;
}

const TitleSlide: React.FC<TitleSlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden pb-24"
      style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.darkGreen} 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-0 max-w-6xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            Analytics Hackathon
            <span className="block text-6xl bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              2025
            </span>
          </h1>
          <h2 className="text-5xl font-semibold text-white mb-4 leading-relaxed">
            BC Hydro Supply Chain Risk Assessment
          </h2>
          <p className="text-2xl text-blue-100 font-medium">Beedie School of Business</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-white/20 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6" style={{ color: colors.navy }}>
            Team Members
          </h3>
          <div className="space-y-4 text-xl">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="font-semibold text-gray-800">Tej Tandon</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="font-semibold text-gray-800">Paula Apperley</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="font-semibold text-gray-800">Simarprit Kaur</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/80 text-lg font-medium">
            Supply Chain Resilience Through Data-Driven Insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitleSlide; 