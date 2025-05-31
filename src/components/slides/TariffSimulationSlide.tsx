import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface TariffSimulationSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const TariffSimulationSlide: React.FC<TariffSimulationSlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">25% US TARIFF SIMULATION</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>COST IMPACT BY CATEGORY</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.tariffData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
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
                    formatter={(value: number, name: string) => [
                      `$${(value / 1000000).toFixed(2)}M`, 
                      name === 'currentSpend' ? 'Current Spend' : 'Tariff Cost'
                    ]}
                  />
                  <Bar dataKey="currentSpend" fill={colors.primary} name="Current Spend" />
                  <Bar dataKey="tariffCost" fill={colors.danger} name="25% Tariff Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-y-auto">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>IMPACT SUMMARY</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">TOTAL ANNUAL IMPACT</h3>
                <div className="text-2xl lg:text-3xl font-black mt-2">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-sm font-bold opacity-90">25% tariff on US equipment</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-3">MOST AFFECTED</h3>
                <div className="space-y-2">
                  {analysisData?.tariffData.slice(0, 4).map((cat, idx) => (
                    <div key={cat.category} className="bg-white/20 p-2 rounded text-sm">
                      <div className="font-bold">{idx + 1}. {cat.category.length > 20 ? cat.category.substring(0, 20) + '...' : cat.category}</div>
                      <div className="text-xs font-bold opacity-90">
                        +${(cat.tariffCost / 1000000).toFixed(1)}M annually
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">CATEGORIES AT RISK</h3>
                <div className="text-2xl lg:text-3xl font-black mt-2">
                  {analysisData?.tariffData.length || 0}
                </div>
                <div className="text-sm font-bold opacity-90">Equipment categories affected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffSimulationSlide; 