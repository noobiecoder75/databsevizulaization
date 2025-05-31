import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colors, AnalysisData } from './types';

interface RiskMatrixSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const RiskMatrixSlide: React.FC<RiskMatrixSlideProps> = ({ colors, analysisData }) => {
  const riskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">RISK MATRIX ANALYSIS</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>VENDOR COUNT VS TOTAL SPEND</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.riskMatrixData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="vendorCount" 
                    type="number"
                    name="Vendor Count"
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="totalSpend" 
                    type="number"
                    name="Total Spend"
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'totalSpend') return [`$${(value / 1000000).toFixed(2)}M`, 'Total Spend'];
                      if (name === 'vendorCount') return [value, 'Vendor Count'];
                      return [value, name];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-bold text-gray-800">{data.category}</p>
                            <p className="text-blue-600">Vendors: {data.vendorCount}</p>
                            <p className="text-green-600">Spend: ${(data.totalSpend / 1000000).toFixed(2)}M</p>
                            <p className={`font-bold`} style={{ color: riskColor(data.riskLevel) }}>
                              Risk: {data.riskLevel}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="totalSpend" fill={colors.primary}>
                    {analysisData?.riskMatrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={riskColor(entry.riskLevel)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>RISK LEGEND</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-red-100 rounded-lg border-l-4 border-red-600">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="font-bold text-red-800">Critical Risk</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-orange-100 rounded-lg border-l-4 border-orange-600">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                  <span className="font-bold text-orange-800">High Risk</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-100 rounded-lg border-l-4 border-yellow-600">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  <span className="font-bold text-yellow-800">Medium Risk</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-100 rounded-lg border-l-4 border-green-600">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <span className="font-bold text-green-800">Low Risk</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-3">RISK FACTORS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Critical:</span>
                    <span className="text-red-300 font-bold">
                      {analysisData?.riskMatrixData.filter(d => d.riskLevel === 'Critical').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High:</span>
                    <span className="text-orange-300 font-bold">
                      {analysisData?.riskMatrixData.filter(d => d.riskLevel === 'High').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <span className="text-yellow-300 font-bold">
                      {analysisData?.riskMatrixData.filter(d => d.riskLevel === 'Medium').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low:</span>
                    <span className="text-green-300 font-bold">
                      {analysisData?.riskMatrixData.filter(d => d.riskLevel === 'Low').length || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">INTERPRETATION</h3>
                <div className="text-sm mt-2 space-y-1">
                  <div>• <strong>High spend + Few vendors</strong> = Higher risk</div>
                  <div>• <strong>Many vendors</strong> = More options</div>
                  <div>• <strong>Concentrated spending</strong> = Supply vulnerability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrixSlide; 