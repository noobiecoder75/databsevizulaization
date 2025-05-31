import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Colors, AnalysisData } from './types';

interface SpendByCountrySlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const SpendByCountrySlide: React.FC<SpendByCountrySlideProps> = ({ colors, analysisData }) => {
  return (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">INTERNATIONAL PROCUREMENT</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.accent }}>SPENDING BY COUNTRY</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCountries || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="country" 
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
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>GEOGRAPHIC ANALYSIS</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">TOP SUPPLIER</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  {analysisData?.topCountries?.[0]?.country || 'Loading...'}
                </div>
                <div className="text-lg font-bold opacity-90">
                  ${analysisData ? (analysisData.topCountries?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">COUNTRIES INVOLVED</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  {analysisData?.topCountries.length || 0}
                </div>
                <div className="text-sm font-bold opacity-90">International suppliers</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-3">US EXPOSURE</h3>
                <div className="text-2xl font-black">
                  ${analysisData ? (
                    (analysisData.topCountries.find(c => 
                      c.country.toLowerCase().includes('united states') || 
                      c.country.toLowerCase().includes('usa') || 
                      c.country.toLowerCase().includes('us')
                    )?.spend || 0) / 1000000
                  ).toFixed(1) : '0'}M
                </div>
                <div className="text-sm font-bold opacity-90">Potential tariff exposure</div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">TOP 5 COUNTRIES</h3>
                <div className="space-y-1 mt-2">
                  {analysisData?.topCountries.slice(0, 5).map((country, idx) => (
                    <div key={country.country} className="flex justify-between text-xs">
                      <span className="font-bold truncate pr-2">{idx + 1}. {country.country}</span>
                      <span className="text-blue-300 font-black">${(country.spend / 1000000).toFixed(1)}M</span>
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