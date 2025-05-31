import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCategorySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCategorySlide: React.FC<SpendByCategorySlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">ELECTRICAL EQUIPMENT SPEND</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.accent }}>ANNUAL SPENDING BY CATEGORY</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCategories || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={80}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Annual Spend']}
                    labelStyle={{ color: colors.dark }}
                  />
                  <Bar 
                    dataKey="spend" 
                    fill={colors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>KEY INSIGHTS</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">TOP CATEGORY</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  {analysisData?.topCategories?.[0]?.category && analysisData.topCategories[0].category.length > 15 ? 
                    analysisData.topCategories[0].category.substring(0, 15) + '...' : 
                    analysisData?.topCategories?.[0]?.category || 'Loading...'}
                </div>
                <div className="text-lg font-bold opacity-90">
                  ${analysisData ? (analysisData.topCategories?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">TOTAL PORTFOLIO</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
                </div>
                <div className="text-sm font-bold opacity-90">
                  {analysisData?.topCategories.length || 0} equipment categories
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">TOP 5 CATEGORIES</h3>
                <div className="space-y-1 mt-2">
                  {analysisData?.topCategories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between text-xs">
                      <span className="font-bold truncate pr-2">{idx + 1}. {cat.category.length > 12 ? cat.category.substring(0, 12) + '...' : cat.category}</span>
                      <span className="text-blue-300 font-black">${(cat.spend / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendByCategorySlide; 