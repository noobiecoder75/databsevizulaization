import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCategorySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCategorySlide: React.FC<SpendByCategorySlideProps> = ({ colors, analysisData }) => {
  // Calculate the number of categories to display (max 5)
  const totalCategories = analysisData?.topCategories.length || 0;
  const categoriesToShow = Math.min(5, totalCategories);
  const displayCategories = analysisData?.topCategories.slice(0, categoriesToShow) || [];

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Electrical Equipment Spend</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Annual spending most vulnerable categories</h2>
            <div className="flex-1 bg-white rounded-lg shadow-lg p-3 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCategories || []} margin={{ bottom: 40, left: 15, right: 15, top: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={60}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} 
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Annual Spend']}
                    labelStyle={{ color: colors.dark, fontSize: '10px' }}
                    contentStyle={{ fontSize: '10px' }}
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
          
          <div className="flex flex-col overflow-hidden min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Key Insights</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div style={{ backgroundColor: colors.accent }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-xs">Total Portfolio</h3>
                <div className="text-lg font-bold">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
                </div>
                <div className="text-xs font-semibold opacity-90">
                  {totalCategories} categories
                </div>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg text-white shadow-lg flex-1">
                <h3 className="font-bold text-xs mb-2">Top {categoriesToShow} Categories</h3>
                <div className="space-y-1">
                  {displayCategories.map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between text-xs">
                      <span className="font-semibold truncate pr-2 flex-1">{idx + 1}. {cat.category.length > 10 ? cat.category.substring(0, 10) + '...' : cat.category}</span>
                      <span className="text-blue-300 font-bold whitespace-nowrap">${(cat.spend / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end p-4 pt-2">
        <div className="w-24 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default SpendByCategorySlide; 