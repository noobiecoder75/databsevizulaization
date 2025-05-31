import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colors, AnalysisData } from './types';

interface LeadTimeSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const LeadTimeSlide: React.FC<LeadTimeSlideProps> = ({ colors, analysisData }) => {
  const riskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">LEAD TIME VS SAFETY STOCK</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>DELIVERY RISK ASSESSMENT</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.leadTimeData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="leadTime" 
                    type="number"
                    name="Lead Time"
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => `${value}d`}
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="safetyStock" 
                    type="number"
                    name="Safety Stock"
                    domain={[0, 'dataMax']}
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-bold text-gray-800">{data.category}</p>
                            <p className="text-blue-600">Lead Time: {data.leadTime} days</p>
                            <p className="text-green-600">Safety Stock: {data.safetyStock}</p>
                            <p className={`font-bold`} style={{ color: riskColor(data.riskLevel) }}>
                              Risk: {data.riskLevel}
                            </p>
                            <p className="text-gray-600">Vendor: {data.vendor}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="safetyStock" fill={colors.primary}>
                    {analysisData?.leadTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={riskColor(entry.riskLevel)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>RISK ANALYSIS</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-red-100 rounded-lg border-l-4 border-red-600">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="font-bold text-red-800">High Risk</span>
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
              
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-3">HIGH RISK VENDORS</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  {analysisData?.leadTimeData.filter(d => d.riskLevel === 'High').length || 0}
                </div>
                <div className="text-sm font-bold opacity-90">
                  Long lead times + Low stock
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">AVERAGE METRICS</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg Lead Time:</span>
                    <span className="font-bold">
                      {analysisData ? Math.round(
                        analysisData.leadTimeData.reduce((sum, d) => sum + d.leadTime, 0) / 
                        analysisData.leadTimeData.length
                      ) : 0} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Safety Stock:</span>
                    <span className="font-bold">
                      {analysisData ? Math.round(
                        analysisData.leadTimeData.reduce((sum, d) => sum + d.safetyStock, 0) / 
                        analysisData.leadTimeData.length
                      ) : 0} units
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">RISK ZONES</h3>
                <div className="text-sm mt-2 space-y-1">
                  <div>• <strong>Top-right:</strong> Long lead + High stock</div>
                  <div>• <strong>Top-left:</strong> Short lead + High stock</div>
                  <div>• <strong>Bottom-right:</strong> Long lead + Low stock ⚠️</div>
                  <div>• <strong>Bottom-left:</strong> Short lead + Low stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTimeSlide; 