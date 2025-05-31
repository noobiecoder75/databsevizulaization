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
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Lead Time vs Safety Stock</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Delivery Risk Assessment</h2>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4" style={{ minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.leadTimeData || []} margin={{ bottom: 40, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="leadTime" 
                    type="number"
                    name="Lead Time"
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => `${value}d`}
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    dataKey="safetyStock" 
                    type="number"
                    name="Safety Stock"
                    domain={[0, 'dataMax']}
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-lg text-xs">
                            <p className="font-bold text-gray-800 text-xs">{data.category.length > 20 ? data.category.substring(0, 20) + '...' : data.category}</p>
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
          
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Risk Analysis</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="font-bold text-red-800 text-sm">High Risk</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  <span className="font-bold text-yellow-800 text-sm">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="font-bold text-green-800 text-sm">Low Risk</span>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.secondary }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-3">High Risk Vendors</h3>
                <div className="text-2xl font-bold">
                  {analysisData?.leadTimeData.filter(d => d.riskLevel === 'High').length || 0}
                </div>
                <div className="text-sm font-semibold opacity-90">
                  Long lead times + Low stock
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Average Metrics</h3>
                <div className="space-y-1">
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
              
              <div style={{ backgroundColor: colors.warning }} className="p-4 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-bold text-lg mb-2">Risk Zones</h3>
                <div className="text-sm space-y-1">
                  <div>• <strong>Top-right:</strong> Long + High stock</div>
                  <div>• <strong>Top-left:</strong> Short + High stock</div>
                  <div>• <strong>Bottom-right:</strong> Long + Low stock ⚠️</div>
                  <div>• <strong>Bottom-left:</strong> Short + Low stock</div>
                </div>
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

export default LeadTimeSlide; 