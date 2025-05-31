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
    <div className="h-full flex flex-col max-h-screen overflow-hidden" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Lead Time vs Safety Stock</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Delivery Risk Assessment</h2>
            <div className="flex-1 bg-white rounded-lg shadow-lg p-3 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.leadTimeData || []} margin={{ bottom: 30, left: 15, right: 15, top: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="leadTime" 
                    type="number"
                    name="Lead Time"
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => `${value}d`}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Lead Time (days)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '9px', fill: '#374151' } }}
                  />
                  <YAxis 
                    dataKey="safetyStock" 
                    type="number"
                    name="Safety Stock"
                    domain={[0, 'dataMax']}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Safety Stock', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '9px', fill: '#374151' } }}
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
          
          <div className="flex flex-col overflow-hidden min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Risk Analysis</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="font-bold text-red-800 text-xs">High Risk</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span className="font-bold text-yellow-800 text-xs">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="font-bold text-green-800 text-xs">Low Risk</span>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.secondary }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-2">High Risk Vendors</h3>
                <div className="text-xl font-bold">
                  {analysisData?.leadTimeData.filter(d => d.riskLevel === 'High').length || 0}
                </div>
                <div className="text-xs font-semibold opacity-90">
                  Long lead times + Low stock
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">Average Metrics</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Avg Lead Time:</span>
                    <span className="font-bold">
                      {analysisData ? Math.round(
                        analysisData.leadTimeData.reduce((sum, d) => sum + d.leadTime, 0) / 
                        analysisData.leadTimeData.length
                      ) : 0} days
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
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
              
              <div style={{ backgroundColor: colors.warning }} className="p-3 rounded-lg text-white shadow-lg flex-1">
                <h3 className="font-bold text-sm mb-1">Risk Zones</h3>
                <div className="text-xs space-y-1">
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
      <div className="flex justify-end p-4 pt-2">
        <div className="w-24 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default LeadTimeSlide; 