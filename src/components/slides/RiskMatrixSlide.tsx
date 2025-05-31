import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Colors, AnalysisData } from './types';
import { useVendorRiskInventory } from '../../hooks/useVendorRiskInventory';

interface RiskMatrixSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

// Custom label component for scatter points
const CustomLabel = ({ x, y, payload }: any) => {
  if (!payload) return null;
  
  const categoryName = payload.category.length > 8 ? 
    payload.category.substring(0, 8) + '...' : 
    payload.category;
  
  return (
    <text
      x={x}
      y={y - 10}
      textAnchor="middle"
      fontSize="8"
      fill="#374151"
      fontWeight="600"
    >
      {categoryName}
    </text>
  );
};

const RiskMatrixSlide: React.FC<RiskMatrixSlideProps> = ({ colors, analysisData }) => {
  const { data: allVendorData } = useVendorRiskInventory();

  // Calculate comprehensive risk matrix data using ALL categories (not just electrical equipment)
  const comprehensiveRiskData = useMemo(() => {
    if (!allVendorData.length) return analysisData?.riskMatrixData || [];

    // Filter to non-Canadian vendors only (to maintain tariff analysis relevance)
    const nonCanadianVendors = allVendorData.filter(vendor => {
      const isNotCanadian = !vendor.country_of_origin?.toLowerCase().includes('canada');
      return isNotCanadian && vendor.category; // Must have a category
    });

    // Group by category and calculate risk metrics
    const categoryData = nonCanadianVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      
      if (!acc[category]) {
        acc[category] = {
          category,
          totalSpend: 0,
          vendorCount: 0,
          vendors: []
        };
      }
      
      acc[category].totalSpend += spend;
      acc[category].vendorCount += 1;
      acc[category].vendors.push(vendor);
      return acc;
    }, {} as Record<string, any>);

    // Calculate risk scores for each category
    return Object.values(categoryData).map((cat: any) => {
      const vendors = cat.vendors;
      const avgLeadTime = vendors.reduce((sum: number, v: any) => sum + Number(v.average_lead_time_days || 0), 0) / vendors.length;
      const avgSafetyStock = vendors.reduce((sum: number, v: any) => sum + Number(v.safety_stock || 0), 0) / vendors.length;
      
      let riskLevel = 'Low';
      let riskScore = 0;

      // Calculate risk score based on lead time, safety stock, and vendor diversity
      const leadTimeScore = avgLeadTime > 60 ? 3 : avgLeadTime > 30 ? 2 : 1;
      const safetyStockScore = avgSafetyStock < 50 ? 3 : avgSafetyStock < 100 ? 2 : 1;
      const vendorDiversityScore = vendors.length <= 2 ? 3 : vendors.length <= 5 ? 2 : 1;
      
      riskScore = leadTimeScore + safetyStockScore + vendorDiversityScore;
      
      if (riskScore >= 8) riskLevel = 'Critical';
      else if (riskScore >= 6) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';

      return {
        category: cat.category,
        totalSpend: cat.totalSpend,
        vendorCount: cat.vendorCount,
        riskLevel,
        riskScore
      };
    }).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [allVendorData, analysisData]);

  const riskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  // Calculate risk distribution for the legend
  const riskCounts = {
    Critical: comprehensiveRiskData.filter(d => d.riskLevel === 'Critical').length,
    High: comprehensiveRiskData.filter(d => d.riskLevel === 'High').length,
    Medium: comprehensiveRiskData.filter(d => d.riskLevel === 'Medium').length,
    Low: comprehensiveRiskData.filter(d => d.riskLevel === 'Low').length
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Comprehensive Risk Matrix</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>All Categories - Vendor Count vs Total Spend</h2>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4" style={{ minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={comprehensiveRiskData} margin={{ bottom: 60, left: 60, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="vendorCount" 
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 2']}
                    name="Vendor Count"
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Number of Vendors', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '10px', fill: '#374151' } }}
                  />
                  <YAxis 
                    dataKey="totalSpend" 
                    type="number"
                    name="Total Spend"
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Annual Spend (Millions)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px', fill: '#374151' } }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-lg text-sm max-w-60 border-gray-200">
                            <p className="font-bold text-gray-800 mb-2">
                              {data.category}
                            </p>
                            <div className="space-y-1">
                              <p className="text-blue-600">Vendors: <span className="font-semibold">{data.vendorCount}</span></p>
                              <p className="text-green-600">Spend: <span className="font-semibold">${(data.totalSpend / 1000000).toFixed(2)}M</span></p>
                              <p className="font-bold" style={{ color: riskColor(data.riskLevel) }}>
                                Risk: {data.riskLevel} (Score: {data.riskScore})
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="totalSpend" fill={colors.primary}>
                    <LabelList content={<CustomLabel />} />
                    {comprehensiveRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={riskColor(entry.riskLevel)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Risk Legend</h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="font-bold text-red-800 text-sm">Critical</span>
                  </div>
                  <span className="text-red-700 font-bold text-sm">{riskCounts.Critical}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span className="font-bold text-orange-800 text-sm">High</span>
                  </div>
                  <span className="text-orange-700 font-bold text-sm">{riskCounts.High}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                    <span className="font-bold text-yellow-800 text-sm">Medium</span>
                  </div>
                  <span className="text-yellow-700 font-bold text-sm">{riskCounts.Medium}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="font-bold text-green-800 text-sm">Low</span>
                  </div>
                  <span className="text-green-700 font-bold text-sm">{riskCounts.Low}</span>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Portfolio Overview</h3>
                <div className="text-2xl font-bold">
                  {comprehensiveRiskData.length}
                </div>
                <div className="text-sm font-semibold opacity-90">Total categories</div>
                <div className="text-xs opacity-75">All procurement types</div>
                <div className="border-t border-blue-400 mt-3 pt-2">
                  <div className="text-sm font-bold">
                    {comprehensiveRiskData.reduce((sum, d) => sum + d.vendorCount, 0)} Total Vendors
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-3">Interpretation</h3>
                <div className="text-sm space-y-2">
                  <div>• <strong>High spend + Few vendors</strong> = Higher risk</div>
                  <div>• <strong>Many vendors</strong> = More supplier options</div>
                  <div>• <strong>Concentrated spending</strong> = Supply vulnerability</div>
                  <div>• <strong>Risk score</strong> = Lead time + Safety stock + Vendor diversity</div>
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

export default RiskMatrixSlide; 