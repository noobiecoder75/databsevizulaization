import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colors, AnalysisData } from './types';
import { useVendorRiskInventory } from '../../hooks/useVendorRiskInventory';

interface RiskMatrixSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

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

  return (
    <div className="h-full p-8" style={{ backgroundColor: colors.light }}>
      {/* Title */}
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Comprehensive Risk Matrix</h1>
      
      <div className="relative pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>All Categories - Vendor Count vs Total Spend</h2>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4" style={{ minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={comprehensiveRiskData} margin={{ bottom: 60, left: 60, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="vendorCount" 
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 2']}
                    name="Vendor Count"
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Number of Vendors', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '10px' } }}
                  />
                  <YAxis 
                    dataKey="totalSpend" 
                    type="number"
                    name="Total Spend"
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Annual Spend (Millions)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
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
                          <div className="bg-white p-3 border rounded shadow-lg text-xs max-w-48">
                            <p className="font-bold text-gray-800 text-xs mb-1">
                              {data.category.length > 30 ? data.category.substring(0, 30) + '...' : data.category}
                            </p>
                            <p className="text-blue-600">Vendors: {data.vendorCount}</p>
                            <p className="text-green-600">Spend: ${(data.totalSpend / 1000000).toFixed(2)}M</p>
                            <p className={`font-bold`} style={{ color: riskColor(data.riskLevel) }}>
                              Risk: {data.riskLevel} (Score: {data.riskScore})
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="totalSpend" fill={colors.primary}>
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
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="font-bold text-red-800 text-sm">Critical Risk</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span className="font-bold text-orange-800 text-sm">High Risk</span>
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
              
              <div className="bg-gray-800 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-3">Risk Distribution</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Critical:</span>
                    <span className="text-red-300 font-bold">
                      {comprehensiveRiskData.filter(d => d.riskLevel === 'Critical').length || 0} categories
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High:</span>
                    <span className="text-orange-300 font-bold">
                      {comprehensiveRiskData.filter(d => d.riskLevel === 'High').length || 0} categories
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <span className="text-yellow-300 font-bold">
                      {comprehensiveRiskData.filter(d => d.riskLevel === 'Medium').length || 0} categories
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low:</span>
                    <span className="text-green-300 font-bold">
                      {comprehensiveRiskData.filter(d => d.riskLevel === 'Low').length || 0} categories
                    </span>
                  </div>
                  <div className="border-t border-gray-600 mt-3 pt-3">
                    <div className="text-sm font-bold text-blue-300">
                      Total Vendors: {comprehensiveRiskData.reduce((sum, d) => sum + d.vendorCount, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Coverage</h3>
                <div className="text-2xl font-bold">
                  {comprehensiveRiskData.length || 0}
                </div>
                <div className="text-sm font-semibold opacity-90">Total categories</div>
                <div className="text-xs opacity-75 mt-1">All procurement types</div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-4 rounded-xl text-white shadow-lg flex-1">
                <h3 className="font-bold text-lg mb-2">Interpretation</h3>
                <div className="text-sm space-y-1">
                  <div>• <strong>High spend + Few vendors</strong> = Higher risk</div>
                  <div>• <strong>Many vendors</strong> = More options</div>
                  <div>• <strong>Concentrated spending</strong> = Vulnerability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo Space - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-28 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrixSlide; 