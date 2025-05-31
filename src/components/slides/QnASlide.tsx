import React from 'react';
import { Colors, AnalysisData } from './types';

interface QnASlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const QnASlide: React.FC<QnASlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-6xl font-bold text-gray-800">Questions & Discussion</h1>
        <div className="w-32 h-1 bg-gray-600 mx-auto mt-4"></div>
        <p className="text-3xl text-gray-600 mt-4 font-semibold text-center">Thank you for your attention</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4 flex justify-center items-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-6xl shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-12 text-left">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Key Takeaways</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.primary }}>•</span>
                  <span>${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M annual cost risk from US tariffs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.primary }}>•</span>
                  <span>{analysisData?.vulnerableCategories.length || 0} high-risk categories identified</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.primary }}>•</span>
                  <span>Immediate action required on inventory management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.primary }}>•</span>
                  <span>Long-term strategy shift toward domestic sourcing</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.accent }}>Next Steps</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.accent }}>•</span>
                  <span>Form cross-functional risk committee</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.accent }}>•</span>
                  <span>Develop detailed implementation plan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.accent }}>•</span>
                  <span>Secure budget for strategic initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3" style={{ color: colors.accent }}>•</span>
                  <span>Begin supplier engagement immediately</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-8 pb-4">
        <div className="text-center">
          <div className="text-lg text-gray-600 font-semibold mb-4">
            Appendix: Detailed data analysis and assumptions available upon request
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end p-8 pt-4">
        <div className="w-32 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default QnASlide; 