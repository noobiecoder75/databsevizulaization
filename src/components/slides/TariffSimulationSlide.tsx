import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface TariffSimulationSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const TariffSimulationSlide: React.FC<TariffSimulationSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">25% US Tariff Simulation</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Cost Impact by Category</h2>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4" style={{ minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.tariffData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
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
                    formatter={(value: number, name: string) => [
                      `$${(value / 1000000).toFixed(2)}M`, 
                      name === 'currentSpend' ? 'Current Spend' : 'Tariff Cost'
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="currentSpend" fill={colors.primary} name="Current Spend" />
                  <Bar dataKey="tariffCost" fill={colors.danger} name="25% Tariff Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Impact Summary</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg">Total Annual Impact</h3>
                <div className="text-2xl font-bold mt-2">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-sm font-semibold opacity-90">25% tariff on US equipment</div>
              </div>
              
              <div style={{ backgroundColor: colors.warning }} className="p-4 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-bold text-lg mb-3">Most Affected</h3>
                <div className="space-y-2 overflow-y-auto">
                  {analysisData?.tariffData.slice(0, 3).map((cat, idx) => (
                    <div key={cat.category} className="bg-white/20 p-3 rounded text-sm">
                      <div className="font-bold">{idx + 1}. {cat.category.length > 15 ? cat.category.substring(0, 15) + '...' : cat.category}</div>
                      <div className="text-sm font-semibold opacity-90">
                        +${(cat.tariffCost / 1000000).toFixed(1)}M annually
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg">Categories at Risk</h3>
                <div className="text-2xl font-bold mt-2">
                  {analysisData?.tariffData.length || 0}
                </div>
                <div className="text-sm font-semibold opacity-90">Equipment categories affected</div>
              </div>
            </div>
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

export default TariffSimulationSlide; 