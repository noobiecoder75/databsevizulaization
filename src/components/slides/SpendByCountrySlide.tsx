import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCountrySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCountrySlide: React.FC<SpendByCountrySlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-4 lg:p-6" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-2xl lg:text-4xl font-black mb-3 text-center text-white">INTERNATIONAL PROCUREMENT</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl" style={{ height: 'calc(100% - 4rem)' }}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-lg lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>SPENDING BY COUNTRY</h2>
            <div className="flex-1" style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCountries || []} margin={{ bottom: 40, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="country" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={60}
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
            <h2 className="text-sm lg:text-lg font-black mb-3" style={{ color: colors.accent }}>GEOGRAPHIC ANALYSIS</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm text-white mb-1">TOP SUPPLIER</h3>
                <div className="text-lg lg:text-xl font-black">
                  {analysisData?.topCountries?.[0]?.country || 'Loading...'}
                </div>
                <div className="text-sm font-bold opacity-90">
                  ${analysisData ? (analysisData.topCountries?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm mb-1">COUNTRIES INVOLVED</h3>
                <div className="text-lg lg:text-xl font-black">
                  {analysisData?.topCountries.length || 0}
                </div>
                <div className="text-xs font-bold opacity-90">International suppliers</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm mb-1">US EXPOSURE</h3>
                <div className="text-lg font-black">
                  ${analysisData ? (
                    (analysisData.topCountries.find(c => 
                      c.country.toLowerCase().includes('united states') || 
                      c.country.toLowerCase().includes('usa') || 
                      c.country.toLowerCase().includes('us')
                    )?.spend || 0) / 1000000
                  ).toFixed(1) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90">Potential tariff exposure</div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-black text-xs mb-2">TOP 5 COUNTRIES</h3>
                <div className="space-y-1">
                  {analysisData?.topCountries.slice(0, 5).map((country, idx) => (
                    <div key={country.country} className="flex justify-between text-xs">
                      <span className="font-bold truncate pr-1 flex-1">{idx + 1}. {country.country}</span>
                      <span className="text-blue-300 font-black whitespace-nowrap">${(country.spend / 1000000).toFixed(1)}M</span>
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

export default SpendByCountrySlide; 