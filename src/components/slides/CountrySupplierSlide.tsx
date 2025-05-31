import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Colors, AnalysisData } from './types';
import { useVendorRiskInventory } from '../../hooks/useVendorRiskInventory';

interface CountrySupplierSlideProps {
  colors: Colors;
  analysisData: AnalysisData | null;
}

const CountrySupplierSlide: React.FC<CountrySupplierSlideProps> = ({ colors, analysisData }) => {
  const { data: allVendorData } = useVendorRiskInventory();

  // Equipment-only categories filter (same logic as main slideshow)
  const isEquipmentCategory = (category: string) => {
    if (!category) return false;
    const categoryLower = category.toLowerCase();
    
    const electricalEquipmentKeywords = [
      'transformer', 'transformers',
      'switchgear', 'switch gear', 'switches',
      'generator', 'generators',
      'battery', 'batteries',
      'cable', 'cables',
      'conductor', 'conductors',
      'insulator', 'insulators',
      'relay', 'relays',
      'meter', 'meters', 'metering',
      'breaker', 'breakers', 'circuit breaker',
      'motor', 'motors',
      'pump', 'pumps',
      'valve', 'valves',
      'electrical equipment',
      'power equipment',
      'transmission equipment',
      'distribution equipment',
      'substation equipment'
    ];
    
    return electricalEquipmentKeywords.some(keyword => categoryLower.includes(keyword));
  };

  // Calculate country supplier data for top 4 equipment categories (excluding Canada)
  const countrySupplierData = useMemo(() => {
    if (!allVendorData.length) return { topCategories: [], countryData: [], usaCategories: [] };

    // Filter to equipment vendors only and exclude Canada
    const equipmentVendors = allVendorData.filter(vendor => {
      const isEquipment = isEquipmentCategory(vendor.category || '');
      const isNotCanadian = !vendor.country_of_origin?.toLowerCase().includes('canada');
      return isEquipment && isNotCanadian;
    });

    // Get top 4 equipment spend categories
    const categorySpend = equipmentVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      acc[category] = (acc[category] || 0) + spend;
      return acc;
    }, {} as Record<string, number>);

    const top4Categories = Object.entries(categorySpend)
      .map(([category, spend]) => ({ category, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 4)
      .map(item => item.category);

    // Group vendors by category and country for top 4 categories
    const countryData: any[] = [];
    
    top4Categories.forEach(category => {
      const categoryVendors = equipmentVendors.filter(vendor => vendor.category === category);
      
      const countrySpend = categoryVendors.reduce((acc, vendor) => {
        const country = vendor.country_of_origin || 'Unknown';
        const spend = Number(vendor.annual_spend || 0);
        
        if (!acc[country]) {
          acc[country] = {
            spend: 0,
            vendorCount: 0,
            vendors: []
          };
        }
        
        acc[country].spend += spend;
        acc[country].vendorCount += 1;
        acc[country].vendors.push(vendor);
        return acc;
      }, {} as Record<string, any>);

      // Convert to array and add category info
      Object.entries(countrySpend).forEach(([country, data]) => {
        countryData.push({
          category,
          country,
          spend: data.spend,
          vendorCount: data.vendorCount,
          spendInMillions: data.spend / 1000000
        });
      });
    });

    // Calculate USA specific category breakdown
    const usaVendors = equipmentVendors.filter(vendor => 
      vendor.country_of_origin?.toLowerCase().includes('united states') ||
      vendor.country_of_origin?.toLowerCase().includes('usa') ||
      vendor.country_of_origin?.toLowerCase().includes('us')
    );

    const usaCategorySpend = usaVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      if (!acc[category]) {
        acc[category] = {
          spend: 0,
          vendorCount: 0
        };
      }
      acc[category].spend += spend;
      acc[category].vendorCount += 1;
      return acc;
    }, {} as Record<string, any>);

    const usaCategories = Object.entries(usaCategorySpend)
      .map(([category, data]) => ({
        category,
        spend: data.spend,
        vendorCount: data.vendorCount,
        spendInMillions: data.spend / 1000000
      }))
      .sort((a, b) => b.spend - a.spend);

    return {
      topCategories: top4Categories,
      countryData: countryData.sort((a, b) => b.spend - a.spend),
      usaCategories
    };
  }, [allVendorData]);

  // Prepare data for the main chart (top countries across all 4 equipment categories)
  const chartData = useMemo(() => {
    const countryTotals = countrySupplierData.countryData.reduce((acc, item) => {
      if (!acc[item.country]) {
        acc[item.country] = {
          country: item.country,
          totalSpend: 0,
          totalVendors: 0,
          categories: new Set()
        };
      }
      acc[item.country].totalSpend += item.spend;
      acc[item.country].totalVendors += item.vendorCount;
      acc[item.country].categories.add(item.category);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(countryTotals)
      .map((item: any) => ({
        ...item,
        spendInMillions: item.totalSpend / 1000000,
        categoryCount: item.categories.size
      }))
      .sort((a: any, b: any) => b.totalSpend - a.totalSpend)
      .slice(0, 8);
  }, [countrySupplierData]);

  // Country colors for consistency
  const getCountryColor = (country: string, index: number) => {
    const colorMap: Record<string, string> = {
      'United States': '#dc2626',
      'Germany': '#ea580c', 
      'Japan': '#d97706',
      'China': '#16a34a',
      'India': '#7c3aed',
      'South Korea': '#db2777',
      'Italy': '#059669',
      'France': '#0891b2'
    };
    return colorMap[country] || colors.primary;
  };

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Equipment Supplier Countries</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
              Top Countries - Electrical Equipment Spend
            </h2>
            <div className="flex-1 bg-white rounded-lg shadow-lg p-3 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ bottom: 40, left: 40, right: 15, top: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="country" 
                    angle={-45}
                    textAnchor="end"
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    height={60}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(1)}M`}
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    label={{ value: 'Annual Spend (Millions)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '9px', fill: '#374151' } }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg text-xs border-gray-200">
                            <p className="font-bold text-gray-800 mb-1">{data.country}</p>
                            <p className="text-green-600">Total Spend: <span className="font-semibold">${data.spendInMillions.toFixed(2)}M</span></p>
                            <p className="text-blue-600">Vendors: <span className="font-semibold">{data.totalVendors}</span></p>
                            <p className="text-purple-600">Categories: <span className="font-semibold">{data.categoryCount} of 4</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="spendInMillions" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCountryColor(entry.country, index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col overflow-hidden min-h-0">
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>USA Equipment Categories</h2>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {/* USA Category breakdown */}
              <div className="space-y-1">
                {countrySupplierData.usaCategories.slice(0, 5).map((item, index) => (
                  <div key={item.category} className="p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-bold text-xs text-red-800 mb-1">
                      {index + 1}. {item.category.length > 22 ? item.category.substring(0, 22) + '...' : item.category}
                    </div>
                    <div className="text-xs text-red-700">
                      <div>Spend: ${item.spendInMillions.toFixed(1)}M</div>
                      <div>Vendors: {item.vendorCount}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ backgroundColor: colors.secondary }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">USA Equipment Total</h3>
                <div className="text-lg font-bold">
                  ${countrySupplierData.usaCategories.reduce((sum, item) => sum + item.spendInMillions, 0).toFixed(1)}M
                </div>
                <div className="text-xs font-semibold opacity-90">
                  {countrySupplierData.usaCategories.reduce((sum, item) => sum + item.vendorCount, 0)} vendors
                </div>
                <div className="text-xs opacity-75">
                  {countrySupplierData.usaCategories.length} categories
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.info }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">Geographic Diversity</h3>
                <div className="text-lg font-bold">
                  {chartData.length}
                </div>
                <div className="text-xs font-semibold opacity-90">Countries supplying</div>
                <div className="text-xs opacity-75">Electrical equipment</div>
              </div>
              
              <div style={{ backgroundColor: colors.warning }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">Risk Assessment</h3>
                <div className="text-xs space-y-1">
                  <div>• <strong>USA dependence:</strong> Tariff risk</div>
                  <div>• <strong>Supply chain:</strong> Concentration risk</div>
                  <div>• <strong>Alternatives:</strong> {chartData.length - 1} other countries</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-3 rounded-lg text-white shadow-lg">
                <h3 className="font-bold text-sm mb-1">Key Insights</h3>
                <div className="text-xs space-y-1">
                  {chartData.length > 0 && (
                    <>
                      <div>• <strong>Top supplier:</strong> {chartData[0]?.country}</div>
                      <div>• <strong>Spend:</strong> ${chartData[0]?.spendInMillions.toFixed(1)}M</div>
                      <div>• <strong>Coverage:</strong> {chartData[0]?.categoryCount}/4 categories</div>
                    </>
                  )}
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

export default CountrySupplierSlide; 