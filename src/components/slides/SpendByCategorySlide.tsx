import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCategorySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCategorySlide: React.FC<SpendByCategorySlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">ELECTRICAL EQUIPMENT SPEND</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-lg lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>ANNUAL SPENDING BY CATEGORY</h2>
            <div className="flex-1" style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCategories || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={80}
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Annual Spend']}
                    labelStyle={{ color: colors.dark, fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
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
          
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.accent }}>KEY INSIGHTS</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-1">TOP CATEGORY</h3>
                <div className="text-lg lg:text-xl font-black">
                  {analysisData?.topCategories?.[0]?.category && analysisData.topCategories[0].category.length > 12 ? 
                    analysisData.topCategories[0].category.substring(0, 12) + '...' : 
                    analysisData?.topCategories?.[0]?.category || 'Loading...'}
                </div>
                <div className="text-sm font-bold opacity-90">
                  ${analysisData ? (analysisData.topCategories?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">TOTAL PORTFOLIO</h3>
                <div className="text-lg lg:text-xl font-black">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90">
                  {analysisData?.topCategories.length || 0} categories
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-black text-xs mb-2">TOP 5 CATEGORIES</h3>
                <div className="space-y-1">
                  {analysisData?.topCategories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between text-xs">
                      <span className="font-bold truncate pr-1 flex-1">{idx + 1}. {cat.category.length > 10 ? cat.category.substring(0, 10) + '...' : cat.category}</span>
                      <span className="text-blue-300 font-black whitespace-nowrap">${(cat.spend / 1000000).toFixed(1)}M</span>
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