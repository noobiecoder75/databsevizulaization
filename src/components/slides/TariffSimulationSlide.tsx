import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface TariffSimulationSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const TariffSimulationSlide: React.FC<TariffSimulationSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">25% US TARIFF SIMULATION</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.accent }}>COST IMPACT BY CATEGORY</h2>
            <div className="flex-1" style={{ minHeight: '300px' }}>
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
            <h2 className="text-sm lg:text-lg font-black mb-3" style={{ color: colors.accent }}>IMPACT SUMMARY</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">TOTAL ANNUAL IMPACT</h3>
                <div className="text-xl lg:text-2xl font-black mt-1">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90">25% tariff on US equipment</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-black text-sm mb-2">MOST AFFECTED</h3>
                <div className="space-y-1 overflow-y-auto">
                  {analysisData?.tariffData.slice(0, 3).map((cat, idx) => (
                    <div key={cat.category} className="bg-white/20 p-2 rounded text-xs">
                      <div className="font-bold">{idx + 1}. {cat.category.length > 15 ? cat.category.substring(0, 15) + '...' : cat.category}</div>
                      <div className="text-xs font-bold opacity-90">
                        +${(cat.tariffCost / 1000000).toFixed(1)}M annually
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">CATEGORIES AT RISK</h3>
                <div className="text-xl lg:text-2xl font-black mt-1">
                  {analysisData?.tariffData.length || 0}
                </div>
                <div className="text-xs font-bold opacity-90">Equipment categories affected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffSimulationSlide; 