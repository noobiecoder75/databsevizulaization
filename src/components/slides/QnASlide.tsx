import React from 'react';
import { Colors, AnalysisData } from './types';

interface QnASlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const QnASlide: React.FC<QnASlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-12" style={{ backgroundColor: colors.primary }}>
      <div className="h-full flex flex-col justify-center items-center text-center text-white">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">Questions & Discussion</h1>
          <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-2xl text-blue-200 mb-8">Thank you for your attention</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl">
          <div className="grid grid-cols-2 gap-8 text-left">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
              <ul className="space-y-2 text-lg">
                <li>• ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M annual cost risk from US tariffs</li>
                <li>• {analysisData?.vulnerableCategories.length || 0} high-risk categories identified</li>
                <li>• Immediate action required on inventory management</li>
                <li>• Long-term strategy shift toward domestic sourcing</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
              <ul className="space-y-2 text-lg">
                <li>• Form cross-functional risk committee</li>
                <li>• Develop detailed implementation plan</li>
                <li>• Secure budget for strategic initiatives</li>
                <li>• Begin supplier engagement immediately</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-lg text-blue-200">
          Appendix: Detailed data analysis and assumptions available upon request
        </div>
      </div>
    </div>
  );
};

export default QnASlide; 