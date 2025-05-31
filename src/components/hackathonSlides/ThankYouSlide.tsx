import React from 'react';
import { CheckCircle, MessageCircle, Users, Mail, Calendar } from 'lucide-react';
import { Colors } from './types';

interface ThankYouSlideProps {
  colors: Colors;
}

const ThankYouSlide: React.FC<ThankYouSlideProps> = ({ colors }) => {
  return (
    <div 
      className="h-full flex flex-col justify-center items-center relative overflow-hidden pb-24"
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

      <div className="relative z-0 text-center max-w-5xl mx-auto px-8">
        {/* Main Thank You Section */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Thank You
            </h1>
            <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400 mb-6"></div>
            <h2 className="text-4xl font-semibold text-blue-100 mb-4">Questions & Discussion</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We're ready to discuss our findings and recommendations for BC Hydro's supply chain resilience strategy
            </p>
          </div>
        </div>

        {/* Team Contact Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-white/20 max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center mb-6">
            <div 
              className="p-4 rounded-2xl mr-4"
              style={{ backgroundColor: `${colors.darkGreen}20` }}
            >
              <Users className="w-8 h-8" style={{ color: colors.darkGreen }} />
            </div>
            <h3 className="text-3xl font-bold" style={{ color: colors.navy }}>
              Team Contact
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="text-lg font-semibold text-gray-800">Tej Tandon</p>
              <p className="text-sm text-gray-600">Data Analytics</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="text-lg font-semibold text-gray-800">Paula Apperley</p>
              <p className="text-sm text-gray-600">Supply Chain Analysis</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: colors.darkGreen }}></div>
              <p className="text-lg font-semibold text-gray-800">Simarprit Kaur</p>
              <p className="text-sm text-gray-600">Risk Assessment</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5" style={{ color: colors.navy }} />
                <span className="text-gray-700 font-medium">Analytics Hackathon 2025</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5" style={{ color: colors.navy }} />
                <span className="text-gray-700 font-medium">Beedie School of Business</span>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Prompt */}
        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
            <h4 className="text-xl font-semibold text-white">Ready for Your Questions</h4>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/90 text-lg">
            Let's explore how these insights can drive BC Hydro's strategic supply chain transformation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouSlide; 