import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colors, VendorData } from './types';

interface AppendixSlideProps {
  colors: Colors;
  vendorData: VendorData[];
}

const AppendixSlide: React.FC<AppendixSlideProps> = ({ colors, vendorData }) => {
  // Lead time vs spend scatter plot data
  const leadTimeSpendData = useMemo(() => {
    if (!vendorData.length) return [];
    
    const analysis = vendorData.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const leadTime = Number(vendor.average_lead_time_days || 0);
      const spend = Number(vendor.annual_spend || 0);
      const supplierId = String(vendor.vendor_number || `unknown_supplier_${category}`);

      if (!acc[category]) {
        acc[category] = { totalLeadTime: 0, totalSpend: 0, supplierSet: new Set<string>(), count: 0 };
      }
      acc[category].totalLeadTime += leadTime;
      acc[category].totalSpend += spend;
      acc[category].supplierSet.add(supplierId);
      acc[category].count++;
      return acc;
    }, {} as Record<string, { totalLeadTime: number; totalSpend: number; supplierSet: Set<string>; count: number }>);

    return Object.entries(analysis)
      .filter(([_, data]) => data.count > 0 && data.totalSpend > 0)
      .map(([name, data]) => {
        const avgLeadTime = data.totalLeadTime / data.count;
        const numSuppliers = data.supplierSet.size;
        return {
          x: avgLeadTime,
          y: data.totalSpend / 1000000, // Convert to millions
          category: name.length > 20 ? name.substring(0,20) + "..." : name,
          fullName: name,
          numSuppliers,
          size: Math.max(80 - (numSuppliers * 5), 20), // Larger bubbles for fewer suppliers
          riskLevel: numSuppliers <= 2 ? 'High' : numSuppliers <= 4 ? 'Medium' : 'Low'
        };
      })
      .sort((a, b) => b.y - a.x) // Sort by spend primarily
      .slice(0, 15); // Show top 15 categories
  }, [vendorData]);

  // Data quality metrics
  const dataQualityMetrics = useMemo(() => {
    const totalVendors = vendorData.length;
    const withCategory = vendorData.filter(v => v.category && v.category.trim() !== '').length;
    const withLeadTime = vendorData.filter(v => v.average_lead_time_days && v.average_lead_time_days > 0).length;
    const withSpend = vendorData.filter(v => v.annual_spend && v.annual_spend > 0).length;
    const withCountry = vendorData.filter(v => v.country_of_origin && v.country_of_origin.trim() !== '').length;
    
    return {
      totalVendors,
      categoryCompleteness: Math.round((withCategory / totalVendors) * 100),
      leadTimeCompleteness: Math.round((withLeadTime / totalVendors) * 100),
      spendCompleteness: Math.round((withSpend / totalVendors) * 100),
      countryCompleteness: Math.round((withCountry / totalVendors) * 100)
    };
  }, [vendorData]);

  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.darkGreen} 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-0 h-full flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-4">Appendix: Detailed Analysis</h1>
          <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400"></div>
          <p className="text-xl text-blue-100 mt-4 max-w-4xl mx-auto">
            Comprehensive data quality metrics and detailed lead time analysis
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 flex-grow max-h-[calc(100vh-14rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-[350px]">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGreen }}>
                Lead Time vs Annual Spend Analysis (Detailed)
              </h2>
              {leadTimeSpendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Lead Time" 
                      unit=" days"
                      domain={[0, 'dataMax + 20']}
                      label={{ value: 'Average Lead Time (Days)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Annual Spend" 
                      unit="M"
                      tickFormatter={(tick) => `$${tick.toFixed(0)}M`}
                      label={{ value: 'Annual Spend ($M)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => {
                        if (name === "Lead Time") return [`${value.toFixed(0)} days`, "Avg Lead Time"];
                        if (name === "Annual Spend") return [`$${value.toFixed(1)}M`, "Total Spend"];
                        return [value, name];
                      }}
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return data ? `${data.fullName} (${data.numSuppliers} suppliers, ${data.riskLevel} risk)` : '';
                      }}
                    />
                    <Scatter name="Categories" data={leadTimeSpendData} fill={colors.teal}>
                      {leadTimeSpendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.riskLevel === 'High' ? colors.chartRed :
                          entry.riskLevel === 'Medium' ? colors.chartOrange :
                          colors.teal
                        } />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No data available for detailed analysis.</p>
              )}
            </div>
            
            <div className="h-[350px] flex flex-col">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGreen }}>
                Data Quality Summary
              </h2>
              <div className="space-y-4 flex-grow">
                <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800">Total Vendors</h3>
                  <p className="text-2xl font-bold">{dataQualityMetrics.totalVendors}</p>
                  <p className="text-sm text-green-600">Complete vendor records</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold" style={{ color: colors.navy }}>Data Completeness</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Category:</span>
                      <span className="font-semibold">{dataQualityMetrics.categoryCompleteness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lead Time:</span>
                      <span className="font-semibold">{dataQualityMetrics.leadTimeCompleteness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annual Spend:</span>
                      <span className="font-semibold">{dataQualityMetrics.spendCompleteness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Country:</span>
                      <span className="font-semibold">{dataQualityMetrics.countryCompleteness}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 text-sm">Analysis Notes</h4>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• Bubble size indicates supplier concentration</li>
                    <li>• Red = High risk (≤2 suppliers)</li>
                    <li>• Orange = Medium risk (3-4 suppliers)</li>
                    <li>• Blue = Lower risk (5+ suppliers)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-700">
              <strong>Data Quality Note:</strong> This analysis is based on available vendor data. 
              Categories with insufficient data have been filtered out to ensure accuracy of insights.
              All financial figures are normalized and anonymized for presentation purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppendixSlide; 