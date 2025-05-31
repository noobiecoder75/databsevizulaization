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
  
  const categoryName = payload.category.length > 12 ? 
    payload.category.substring(0, 12) + '...' : 
    payload.category;
  
  return (
    <g>
      <text
        x={x}
        y={y - 15}
        textAnchor="middle"
        fontSize="7"
        fill="#374151"
        fontWeight="600"
      >
        {categoryName}
      </text>
      <text
        x={x}
        y={y - 5}
        textAnchor="middle"
        fontSize="6"
        fill="#6b7280"
        fontWeight="500"
      >
        ({payload.vendorCount} vendors)
      </text>
    </g>
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
    <div className="h-full flex flex-col max-h-screen overflow-hidden" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Comprehensive Risk Matrix</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>All Categories - Vendor Count vs Total Spend</h2>
            <div className="flex-1 bg-white rounded-lg shadow-lg p-3 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={comprehensiveRiskData} margin={{ bottom: 40, left: 40, right: 15, top: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="vendorCount" 
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 2']}
                    name="Vendor Count"
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Number of Vendors', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '9px', fill: '#374151' } }}
                  />
                  <YAxis 
                    dataKey="totalSpend" 
                    type="number"
                    name="Total Spend"
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Annual Spend (Millions)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '9px', fill: '#374151' } }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg text-xs max-w-52 border-gray-200">
                            <p className="font-bold text-gray-800 mb-1">
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
          
          <div className="flex flex-col overflow-hidden min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Risk Legend</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="font-bold text-red-800 text-xs">Critical</span>
                  </div>
                  <span className="text-red-700 font-bold text-xs">{riskCounts.Critical}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="font-bold text-orange-800 text-xs">High</span>
                  </div>
                  <span className="text-orange-700 font-bold text-xs">{riskCounts.High}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <span className="font-bold text-yellow-800 text-xs">Medium</span>
                  </div>
                  <span className="text-yellow-700 font-bold text-xs">{riskCounts.Medium}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="font-bold text-green-800 text-xs">Low</span>
                  </div>
                  <span className="text-green-700 font-bold text-xs">{riskCounts.Low}</span>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">Portfolio Overview</h3>
                <div className="text-xl font-bold">
                  {comprehensiveRiskData.length}
                </div>
                <div className="text-xs font-semibold opacity-90">Total categories</div>
                <div className="text-xs opacity-75">All procurement types</div>
                <div className="border-t border-blue-400 mt-2 pt-1">
                  <div className="text-xs font-bold">
                    {comprehensiveRiskData.reduce((sum, d) => sum + d.vendorCount, 0)} Total Vendors
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-2">Interpretation</h3>
                <div className="text-xs space-y-1">
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
      <div className="flex justify-end p-4 pt-2">
        <div className="w-24 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrixSlide; 