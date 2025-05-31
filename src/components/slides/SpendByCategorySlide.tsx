import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCategorySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCategorySlide: React.FC<SpendByCategorySlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-8" style={{ backgroundColor: colors.light }}>
      {/* Title */}
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Electrical Equipment Spend</h1>
      
      <div className="relative pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Annual Spending by Category</h2>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4" style={{ minHeight: '400px' }}>
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
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Key Insights</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-sm text-white mb-2">Top Category</h3>
                <div className="text-xl font-bold">
                  {analysisData?.topCategories?.[0]?.category && analysisData.topCategories[0].category.length > 12 ? 
                    analysisData.topCategories[0].category.substring(0, 12) + '...' : 
                    analysisData?.topCategories?.[0]?.category || 'Loading...'}
                </div>
                <div className="text-sm font-semibold opacity-90">
                  ${analysisData ? (analysisData.topCategories?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-sm">Total Portfolio</h3>
                <div className="text-xl font-bold">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
                </div>
                <div className="text-xs font-semibold opacity-90">
                  {analysisData?.topCategories.length || 0} categories
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-bold text-sm mb-3">Top 5 Categories</h3>
                <div className="space-y-2">
                  {analysisData?.topCategories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between text-sm">
                      <span className="font-semibold truncate pr-2 flex-1">{idx + 1}. {cat.category.length > 10 ? cat.category.substring(0, 10) + '...' : cat.category}</span>
                      <span className="text-blue-300 font-bold whitespace-nowrap">${(cat.spend / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo Space - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-28 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default SpendByCategorySlide; 