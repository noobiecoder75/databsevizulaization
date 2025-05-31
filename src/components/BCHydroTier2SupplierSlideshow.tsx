import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, AlertTriangle, Users, Globe, TrendingUp, Shield, Factory, Navigation, AlertCircle, ArrowRight, Target, Zap, DollarSign, Clock, Gauge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart, Area, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap } from 'recharts';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';

const BCHydroTier2SupplierSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: vendorData, loading: vendorLoading } = useVendorRiskInventory();
  const { data: tradeData, loading: tradeLoading, getSubcategoryByHsCode } = useCountryTradePartners();

  const colors = {
    primary: '#003B71',    // BC Hydro Navy Blue
    secondary: '#E31837',  // BC Hydro Red
    accent: '#00A651',     // BC Hydro Green
    neutral: '#F5F5F5',    // Light Grey
    warning: '#FF6B35',    // Orange
    success: '#28A745',    // Green
    danger: '#DC3545',     // Red
    info: '#17A2B8',       // Teal
    dark: '#343A40',       // Dark Grey
    light: '#FFFFFF'       // White
  };

  const CHART_COLORS = [colors.primary, colors.secondary, colors.accent, colors.warning, colors.info, colors.success];

  // Equipment-only categories filter (exclude services and non-electrical equipment)
  const isEquipmentCategory = (category: string) => {
    if (!category) return false;
    const categoryLower = category.toLowerCase();
    
    // Only include specific electrical equipment categories
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
    
    // Must contain electrical equipment keywords
    return electricalEquipmentKeywords.some(keyword => categoryLower.includes(keyword));
  };

  // Filter vendor data to equipment only AND exclude Canadian suppliers (no tariffs)
  const equipmentVendors = useMemo(() => {
    return vendorData.filter(vendor => {
      const isEquipment = isEquipmentCategory(vendor.category || '');
      const isNotCanadian = !vendor.country_of_origin?.toLowerCase().includes('canada');
      return isEquipment && isNotCanadian;
    });
  }, [vendorData]);

  // Slide 1: Title Slide
  const titleSlide = (
    <div className="h-full flex flex-col justify-center items-center text-center relative px-4 sm:px-8" style={{ backgroundColor: colors.primary }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 opacity-90"></div>
      <div className="relative z-10 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-4 sm:mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">International Electrical Equipment Supply Chain Risk & Vendor Analysis</h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-blue-200 mb-3 sm:mb-4">BC Hydro</h2>
          <div className="w-24 sm:w-32 h-1 bg-white mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100">Strategic Analysis Team | {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );

  // Calculate metrics for slides
  const analysisData = useMemo(() => {
    if (!equipmentVendors.length) return null;

    // Annual spend by category
    const spendByCategory = equipmentVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      acc[category] = (acc[category] || 0) + spend;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(spendByCategory)
      .map(([category, spend]) => ({ category, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);

    // Risk matrix data
    const riskMatrix = equipmentVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      const riskLevel = vendor.risk_tolerance_category || 'Low';
      
      if (!acc[category]) {
        acc[category] = {
          category,
          totalSpend: 0,
          vendorCount: 0,
          riskLevel,
          riskScore: riskLevel === 'High' ? 3 : riskLevel === 'Medium' ? 2 : 1
        };
      }
      
      acc[category].totalSpend += spend;
      acc[category].vendorCount += 1;
      return acc;
    }, {} as Record<string, any>);

    const riskMatrixData = Object.values(riskMatrix).slice(0, 15);

    // Lead time vs safety stock
    const leadTimeData = equipmentVendors
      .filter(v => v.average_lead_time_days && v.safety_stock)
      .map(vendor => ({
        leadTime: Number(vendor.average_lead_time_days || 0),
        safetyStock: Number(vendor.safety_stock || 0),
        category: vendor.category,
        riskLevel: vendor.risk_tolerance_category || 'Low',
        vendor: vendor.vendor_number
      }));

    // Spend by country
    const spendByCountry = equipmentVendors.reduce((acc, vendor) => {
      const country = vendor.country_of_origin || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      acc[country] = (acc[country] || 0) + spend;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(spendByCountry)
      .map(([country, spend]) => ({ country, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);

    // Top vendors
    const vendorMap = equipmentVendors.reduce((acc, vendor) => {
      const vendorId = vendor.vendor_number;
      if (!vendorId) return acc;
      
      if (!acc[vendorId] || Number(vendor.annual_spend || 0) > Number(acc[vendorId].annual_spend || 0)) {
        acc[vendorId] = vendor;
      }
      return acc;
    }, {} as Record<number, typeof equipmentVendors[0]>);

    const topVendors = Object.values(vendorMap)
      .sort((a, b) => Number(b.annual_spend || 0) - Number(a.annual_spend || 0))
      .slice(0, 10);

    // US tariff simulation (25%)
    const usaVendors = equipmentVendors.filter(v => 
      v.country_of_origin?.toLowerCase().includes('united states') ||
      v.country_of_origin?.toLowerCase().includes('usa') ||
      v.country_of_origin?.toLowerCase().includes('us')
    );

    const tariffImpact = usaVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      const tariffCost = spend * 0.25; // 25% tariff
      
      if (!acc[category]) {
        acc[category] = {
          category,
          currentSpend: 0,
          tariffCost: 0,
          vendors: 0
        };
      }
      
      acc[category].currentSpend += spend;
      acc[category].tariffCost += tariffCost;
      acc[category].vendors += 1;
      return acc;
    }, {} as Record<string, any>);

    const tariffData = Object.values(tariffImpact)
      .sort((a, b) => b.tariffCost - a.tariffCost)
      .slice(0, 8);

    // Most vulnerable categories (high risk + low buffer)
    const vulnerableCategories = Object.values(riskMatrix)
      .filter(cat => cat.riskLevel === 'High')
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 3);

    return {
      topCategories,
      riskMatrixData,
      leadTimeData,
      topCountries,
      topVendors,
      tariffData,
      vulnerableCategories,
      totalSpend: equipmentVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0),
      usaTariffImpact: tariffData.reduce((sum, t) => sum + t.tariffCost, 0)
    };
  }, [equipmentVendors]);

  // Slide 2: Executive Summary
  const executiveSummary = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Executive Summary</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.secondary }}>Key Findings</h2>
            <div className="space-y-4 lg:space-y-6">
              <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Most Vulnerable Portfolio</h3>
                <p className="text-red-700 text-sm sm:text-base">
                  {analysisData?.vulnerableCategories[0]?.category || 'Loading...'} - 
                  ${analysisData ? (analysisData.vulnerableCategories[0]?.totalSpend / 1000000).toFixed(1) : '..'}M at risk
                </p>
              </div>
              
              <div className="p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <h3 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">US Tariff Impact</h3>
                <p className="text-orange-700 text-sm sm:text-base">
                  {analysisData?.tariffData.length || 0} electrical equipment categories affected - 
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '..'}M additional cost risk
                </p>
              </div>
              
              <div className="p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">International Equipment Portfolio</h3>
                <p className="text-blue-700 text-sm sm:text-base">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(1) : '..'}M annual spend on international electrical equipment ({equipmentVendors.length} vendor records)
                </p>
              </div>
              
              <div className="p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Analysis Scope</h3>
                <p className="text-green-700 text-sm sm:text-base">
                  Electrical equipment only (transformers, switchgear, generators) - excludes Canadian suppliers (no tariffs)
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.secondary }}>Recommended Actions</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Immediate Risk Mitigation</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Increase buffer stock in high-risk equipment categories with US sourcing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Supplier Diversification</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Develop alternative equipment sources in Canada and stable international markets</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">Contract Restructuring</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Negotiate tariff protection clauses and dual sourcing agreements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 3: Objective & Methodology
  const methodologySlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Objective & Methodology</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.accent }}>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 sm:mr-3" />
              Analysis Goal
            </h2>
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-4 lg:mb-6">
              <p className="text-base sm:text-lg text-blue-800 leading-relaxed">
                Identify vulnerabilities in equipment vendor relationships and sourcing patterns to protect BC Hydro against supply chain disruptions and cost escalations.
              </p>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: colors.secondary }}>Key Metrics</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
              <li>• Annual spend proxy: Days of Supply × Lead Time</li>
              <li>• Risk assessment by equipment category and geography</li>
              <li>• Tariff impact simulation (25% US tariff)</li>
              <li>• Equipment vendor concentration analysis</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.accent }}>
              <Factory className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 sm:mr-3" />
              Data Sources
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Equipment Vendor Risk Inventory</h4>
                <p className="text-xs sm:text-sm text-gray-600">Complete equipment vendor data with spend, lead times, and risk categories</p>
                <div className="text-xs text-blue-600 mt-1">{equipmentVendors.length} equipment records analyzed</div>
              </div>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Country Trade Partners</h4>
                <p className="text-xs sm:text-sm text-gray-600">Global trade flows for tier-2 dependency mapping</p>
                <div className="text-xs text-blue-600 mt-1">{tradeData.length} trade records</div>
              </div>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Equipment Risk Categories</h4>
                <p className="text-xs sm:text-sm text-gray-600">Category-specific risk thresholds and tolerance levels</p>
              </div>
              
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Scope: Electrical Equipment Only</h4>
                <p className="text-xs sm:text-sm text-yellow-700">Analysis focuses on transformers, switchgear, generators, batteries, and electrical equipment only</p>
              </div>
              
              <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 text-sm sm:text-base">Tariff Focus: Non-Canadian Suppliers</h4>
                <p className="text-xs sm:text-sm text-orange-700">Excludes Canadian suppliers (no domestic tariffs) - focuses on international supply risk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 4: Spend by Product Category
  const spendByCategorySlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Electrical Equipment Spend by Category</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Annual Equipment Spend Distribution</h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.topCategories || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
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
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Category Insights</h2>
            <div className="space-y-3 lg:space-y-4">
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Top Equipment Category</h3>
                <div className="text-lg sm:text-2xl font-bold text-blue-700">
                  {analysisData?.topCategories[0]?.category || 'Loading...'}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  ${analysisData ? (analysisData.topCategories[0]?.spend / 1000000).toFixed(1) : '..'}M annual spend
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 text-sm sm:text-base">Total Equipment Portfolio</h3>
                <div className="text-lg sm:text-2xl font-bold text-green-700">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(1) : '..'}M
                </div>
                <div className="text-xs sm:text-sm text-green-600">
                  Across {analysisData?.topCategories.length || 0} major equipment categories
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                <h3 className="font-semibold text-sm sm:text-base">Top 5 Equipment Categories</h3>
                <div className="max-h-32 sm:max-h-48 overflow-y-auto">
                  {analysisData?.topCategories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between items-center text-xs sm:text-sm py-1">
                      <span className="font-medium truncate pr-2">{idx + 1}. {cat.category.length > 25 ? cat.category.substring(0, 25) + '...' : cat.category}</span>
                      <span className="text-blue-600 whitespace-nowrap">${(cat.spend / 1000000).toFixed(1)}M</span>
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

  // Slide 5: Category Risk Matrix
  const riskMatrixSlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Electrical Equipment Category Risk Matrix</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Risk vs Spend Analysis</h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.riskMatrixData || []} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="totalSpend" 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    name="Annual Spend"
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="riskScore" 
                    domain={[0.5, 3.5]}
                    tickFormatter={(value) => value === 3 ? 'High' : value === 2 ? 'Medium' : 'Low'}
                    name="Risk Level"
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-300 rounded shadow text-sm">
                            <p className="font-semibold">{data.category}</p>
                            <p>Annual Spend: ${(data.totalSpend / 1000000).toFixed(2)}M</p>
                            <p>Risk Level: {data.riskLevel}</p>
                            <p>Vendors: {data.vendorCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    dataKey="vendorCount" 
                    fill={colors.secondary}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Risk Breakdown</h2>
            <div className="space-y-3 lg:space-y-4">
              {['High', 'Medium', 'Low'].map(riskLevel => {
                const categories = analysisData?.riskMatrixData.filter(cat => cat.riskLevel === riskLevel) || [];
                const totalSpend = categories.reduce((sum, cat) => sum + cat.totalSpend, 0);
                
                return (
                  <div key={riskLevel} className={`p-3 sm:p-4 rounded-lg ${
                    riskLevel === 'High' ? 'bg-red-50 border border-red-200' :
                    riskLevel === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <h3 className={`font-semibold text-sm sm:text-base ${
                      riskLevel === 'High' ? 'text-red-900' :
                      riskLevel === 'Medium' ? 'text-yellow-900' :
                      'text-green-900'
                    }`}>
                      {riskLevel} Risk Equipment Categories
                    </h3>
                    <div className="text-xs sm:text-sm mt-2 space-y-1">
                      <div>Categories: {categories.length}</div>
                      <div>Total Spend: ${(totalSpend / 1000000).toFixed(1)}M</div>
                      <div>Vendors: {categories.reduce((sum, cat) => sum + cat.vendorCount, 0)}</div>
                    </div>
                  </div>
                );
              })}
              
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Critical Insight</h3>
                <p className="text-xs sm:text-sm text-gray-700 mt-2">
                  Equipment categories in the top-right quadrant (high spend + high risk) require immediate attention for risk mitigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 6: Lead Time vs Safety Stock
  const leadTimeSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>Lead Time vs Safety Stock</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>Buffer Analysis</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.leadTimeData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="leadTime" 
                    name="Lead Time (Days)"
                    tickFormatter={(value) => `${value}d`}
                  />
                  <YAxis 
                    dataKey="safetyStock" 
                    name="Safety Stock"
                    tickFormatter={(value) => `${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-300 rounded shadow">
                            <p className="font-semibold">Vendor {data.vendor}</p>
                            <p>Category: {data.category}</p>
                            <p>Lead Time: {data.leadTime} days</p>
                            <p>Safety Stock: {data.safetyStock}</p>
                            <p>Risk: {data.riskLevel}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    dataKey="safetyStock" 
                    fill={colors.warning}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>Risk Zones</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900">High Risk Zone</h3>
                <p className="text-sm text-red-700 mt-2">High lead time + Low safety stock</p>
                <div className="text-xs text-gray-600 mt-1">
                  {analysisData?.leadTimeData.filter(d => d.leadTime > 90 && d.safetyStock < 50).length || 0} vendors
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900">Medium Risk</h3>
                <p className="text-sm text-yellow-700 mt-2">Moderate lead time or safety stock</p>
                <div className="text-xs text-gray-600 mt-1">
                  {analysisData?.leadTimeData.filter(d => 
                    (d.leadTime > 60 && d.leadTime <= 90) || 
                    (d.safetyStock >= 50 && d.safetyStock < 100)
                  ).length || 0} vendors
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900">Well Buffered</h3>
                <p className="text-sm text-green-700 mt-2">Adequate safety stock for lead times</p>
                <div className="text-xs text-gray-600 mt-1">
                  {analysisData?.leadTimeData.filter(d => d.leadTime <= 60 && d.safetyStock >= 100).length || 0} vendors
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 7: Spend by Country of Origin
  const spendByCountrySlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>International Equipment Spend by Country</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Geographic Distribution (Excluding Canada)</h2>
            <div className="h-64 sm:h-80 lg:h-96">
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
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>International Supplier Risk Assessment</h2>
            <div className="space-y-3 lg:space-y-4">
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Analysis Scope</h3>
                <p className="text-xs sm:text-sm text-blue-700 mt-2">
                  International electrical equipment suppliers only. Canadian suppliers excluded (no domestic tariffs).
                </p>
              </div>
              
              {analysisData?.topCountries.slice(0, 5).map((country, idx) => {
                const countryName = country.country?.toLowerCase() || '';
                let riskLevel = 'Low';
                let riskColor = 'text-green-600';
                
                if (countryName.includes('united states') || countryName.includes('usa') || countryName.includes('us')) {
                  riskLevel = 'High (Tariff)';
                  riskColor = 'text-red-600';
                } else if (countryName.includes('china') || countryName.includes('russia')) {
                  riskLevel = 'High (Geopolitical)';
                  riskColor = 'text-red-600';
                } else if (countryName.includes('india') || countryName.includes('mexico')) {
                  riskLevel = 'Medium';
                  riskColor = 'text-yellow-600';
                }
                
                return (
                  <div key={country.country} className="p-3 border rounded-lg">
                    <div className="font-semibold text-gray-900 text-sm">
                      {idx + 1}. {country.country}
                    </div>
                    <div className="text-xs text-gray-600">
                      ${(country.spend / 1000000).toFixed(1)}M electrical equipment spend
                    </div>
                    <div className={`text-xs font-medium ${riskColor}`}>
                      {riskLevel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 8: Top Vendors
  const topVendorsSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>Top Vendors</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Vendor Concentration</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analysisData?.topVendors.map((vendor, idx) => (
                <div key={vendor.vendor_number} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Vendor #{vendor.vendor_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vendor.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        Origin: {vendor.country_of_origin}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        ${(Number(vendor.annual_spend || 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-500">Annual spend</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>Lead Time: {vendor.average_lead_time_days || 'N/A'} days</div>
                    <div>Risk: {vendor.risk_tolerance_category || 'Unknown'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Vendor Risk Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: 'High Risk', value: analysisData?.topVendors.filter(v => v.risk_tolerance_category === 'High').length || 0, fill: colors.danger },
                      { name: 'Medium Risk', value: analysisData?.topVendors.filter(v => v.risk_tolerance_category === 'Medium').length || 0, fill: colors.warning },
                      { name: 'Low Risk', value: analysisData?.topVendors.filter(v => v.risk_tolerance_category === 'Low').length || 0, fill: colors.success },
                      { name: 'Unknown', value: analysisData?.topVendors.filter(v => !v.risk_tolerance_category || v.risk_tolerance_category === 'Unknown').length || 0, fill: colors.dark }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 9: Tier-2 Supply Mapping
  const tier2MappingSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>Tier-2 Supply Mapping</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Supply Chain Network</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">BC Hydro Direct Suppliers</h3>
                <div className="text-sm space-y-1">
                  <div>Total Vendors: {analysisData?.topVendors.length || 0}</div>
                  <div>Countries: {[...new Set(analysisData?.topVendors.map(v => v.country_of_origin))].length || 0}</div>
                  <div>Categories: {[...new Set(analysisData?.topVendors.map(v => v.category))].length || 0}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Major Supply Relationships</h3>
                {analysisData?.topCountries.slice(0, 5).map((country, idx) => (
                  <div key={country.country} className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{country.country}</div>
                        <div className="text-sm text-gray-600">
                          ${(country.spend / 1000000).toFixed(1)}M annual spend
                        </div>
                      </div>
                      <div className="text-right">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Tier-2 Dependencies</h2>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900">Indirect Sourcing Risk</h3>
                <p className="text-sm text-orange-700 mt-2">
                  Our direct suppliers may depend on high-risk countries for their components
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Key Insights</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• US suppliers may source from China (trade war risk)</li>
                  <li>• European suppliers depend on energy-intensive processes</li>
                  <li>• Asian suppliers face raw material concentration</li>
                  <li>• Limited visibility into tier-2 relationships</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900">Action Required</h3>
                <p className="text-sm text-red-700 mt-2">
                  Implement supplier questionnaires to map tier-2 dependencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 10: Tariff Simulation (25% US Tariff)
  const tariffSimulationSlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Tariff Simulation (25% US Tariff)</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Cost Impact by Equipment Category</h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analysisData?.tariffData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={80}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} fontSize={12} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${(value / 1000000).toFixed(2)}M`, 
                      name === 'currentSpend' ? 'Current Spend' : 'Tariff Cost'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="currentSpend" fill={colors.primary} name="Current Spend" />
                  <Bar dataKey="tariffCost" fill={colors.danger} name="Additional Tariff Cost" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 lg:mb-4" style={{ color: colors.accent }}>Tariff Impact Summary</h2>
            <div className="space-y-3 lg:space-y-4">
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 text-sm sm:text-base">Total Impact</h3>
                <div className="text-lg sm:text-2xl font-bold text-red-700">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-xs sm:text-sm text-red-600">Additional annual cost</div>
              </div>
              
              <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-900 text-sm sm:text-base">Equipment Categories Affected</h3>
                <div className="text-lg sm:text-2xl font-bold text-orange-700">
                  {analysisData?.tariffData.length || 0}
                </div>
                <div className="text-xs sm:text-sm text-orange-600">Equipment categories</div>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                <h3 className="font-semibold text-sm sm:text-base">Most Exposed Equipment Categories</h3>
                <div className="max-h-32 sm:max-h-48 overflow-y-auto">
                  {analysisData?.tariffData.slice(0, 4).map((item, idx) => (
                    <div key={item.category} className="p-2 bg-gray-50 rounded text-xs sm:text-sm mb-2">
                      <div className="font-medium truncate">{item.category}</div>
                      <div className="text-red-600">+${(item.tariffCost / 1000000).toFixed(1)}M</div>
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

  // Slide 11: Short-Term Mitigation Options
  const shortTermMitigationSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>Short-Term Mitigation Options</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-3 gap-6 h-full">
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <Shield className="w-6 h-6 inline mr-2" />
              Immediate Actions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900">Increase Buffer Stock</h3>
                <p className="text-sm text-blue-700 mt-2">
                  Build 3-6 months additional inventory for US-sourced critical components
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Target: {analysisData?.tariffData.slice(0, 3).map(t => t.category).join(', ')}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900">Re-negotiate Contracts</h3>
                <p className="text-sm text-green-700 mt-2">
                  Include tariff protection clauses in existing US supplier agreements
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-900">Emergency Sourcing</h3>
                <p className="text-sm text-orange-700 mt-2">
                  Identify and pre-qualify alternative suppliers in Canada/Europe
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <Globe className="w-6 h-6 inline mr-2" />
              Alternative Sources
            </h2>
            <div className="space-y-3">
              {analysisData?.topCountries
                .filter(c => !c.country.toLowerCase().includes('united states') && 
                           !c.country.toLowerCase().includes('usa') && 
                           !c.country.toLowerCase().includes('us'))
                .slice(0, 5)
                .map((country, idx) => (
                  <div key={country.country} className="p-3 bg-gray-50 rounded border">
                    <div className="font-semibold text-gray-900">{country.country}</div>
                    <div className="text-sm text-gray-600">
                      Current spend: ${(country.spend / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Potential alternative source
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <Clock className="w-6 h-6 inline mr-2" />
              Implementation Timeline
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded">
                <h3 className="font-semibold text-red-900">Week 1-2</h3>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  <li>• Emergency inventory assessment</li>
                  <li>• Contract review for tariff clauses</li>
                </ul>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded">
                <h3 className="font-semibold text-yellow-900">Month 1</h3>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Increase critical inventory levels</li>
                  <li>• Initiate supplier diversification</li>
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900">Month 2-3</h3>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• Qualify new suppliers</li>
                  <li>• Implement dual sourcing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 12: Long-Term Strategic Levers
  const longTermStrategySlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>Long-Term Strategic Levers</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-3 gap-6 h-full">
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <Users className="w-6 h-6 inline mr-2" />
              Supplier Strategy
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Dual/Multi Sourcing Policy</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Minimum 2 suppliers per critical category</li>
                  <li>• Geographic diversification requirements</li>
                  <li>• No single country &gt;40% of category spend</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">Supplier Development</h3>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Canadian supplier capability building</li>
                  <li>• Joint investment in local capacity</li>
                  <li>• Long-term partnership agreements</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <Factory className="w-6 h-6 inline mr-2" />
              Operational Excellence
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900">Predictive Procurement</h3>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
                  <li>• AI-driven demand forecasting</li>
                  <li>• Supply risk early warning system</li>
                  <li>• Automated reordering optimization</li>
                </ul>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-lg">
                <h3 className="font-semibold text-teal-900">Supply Chain Visibility</h3>
                <ul className="text-sm text-teal-700 mt-2 space-y-1">
                  <li>• Real-time supplier performance tracking</li>
                  <li>• Tier-2 supplier mapping program</li>
                  <li>• Risk assessment automation</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
              <TrendingUp className="w-6 h-6 inline mr-2" />
              Investment Priorities
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-900">Technology Investment</h3>
                <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                  <li>• Supply chain management platform</li>
                  <li>• Supplier portal development</li>
                  <li>• Risk analytics capabilities</li>
                </ul>
              </div>
              
              <div className="p-4 bg-rose-50 rounded-lg">
                <h3 className="font-semibold text-rose-900">Market Development</h3>
                <ul className="text-sm text-rose-700 mt-2 space-y-1">
                  <li>• Canadian supplier ecosystem growth</li>
                  <li>• Strategic partnerships in stable regions</li>
                  <li>• Industry collaboration initiatives</li>
                </ul>
              </div>
              
              <div className="text-center mt-6">
                <div className="text-sm text-gray-600">Target Timeline:</div>
                <div className="text-lg font-semibold text-blue-600">3-5 Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 13: External Benchmarking
  const benchmarkingSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.light }}>
      <h1 className="text-5xl font-bold mb-8" style={{ color: colors.primary }}>External Benchmarking</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Industry Best Practices</h2>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">PG&E (Pacific Gas & Electric)</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Implemented 60/40 rule: No single country &gt;60% of spend</li>
                  <li>• Created supplier resilience scoring system</li>
                  <li>• Maintains 6-month strategic inventory buffer</li>
                  <li>• Annual supply chain stress testing</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Hydro-Québec</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• "Quebec First" supplier development program</li>
                  <li>• Mandatory dual sourcing for critical components</li>
                  <li>• Long-term contracts with Canadian manufacturers</li>
                  <li>• Joint R&D investments with local suppliers</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Ontario Power Generation</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• AI-powered supply risk monitoring</li>
                  <li>• Quarterly supplier financial health checks</li>
                  <li>• Cross-training of procurement teams</li>
                  <li>• Collaborative procurement with other utilities</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Lessons Learned</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900">Key Success Factors</h3>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Executive commitment to supply chain resilience</li>
                  <li>• Investment in supplier relationship management</li>
                  <li>• Regular scenario planning and stress testing</li>
                  <li>• Cross-functional collaboration</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900">Common Pitfalls</h3>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• Over-reliance on cost optimization</li>
                  <li>• Insufficient tier-2 visibility</li>
                  <li>• Reactive vs. proactive risk management</li>
                  <li>• Siloed procurement decisions</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900">BC Hydro Application</h3>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Adapt 60/40 rule to Canadian context</li>
                  <li>• Leverage provincial supplier network</li>
                  <li>• Collaborate with other Canadian utilities</li>
                  <li>• Implement quarterly risk assessments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 14: Recommendations Summary
  const recommendationsSlide = (
    <div className="h-full p-4 sm:p-8 lg:p-12" style={{ backgroundColor: colors.neutral }}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8" style={{ color: colors.primary }}>Equipment Procurement Recommendations</h1>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.danger }}>
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 sm:mr-3" />
              Short-Term (1-6 months)
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h3 className="font-semibold text-red-800 text-sm sm:text-base">1. Emergency Equipment Inventory Build</h3>
                <p className="text-xs sm:text-sm text-red-700 mt-1">
                  Increase safety stock by 50% for US-sourced {analysisData?.tariffData[0]?.category || 'critical equipment'}
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Impact: ${analysisData ? (analysisData.usaTariffImpact / 4 / 1000000).toFixed(1) : '0'}M investment
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <h3 className="font-semibold text-orange-800 text-sm sm:text-base">2. Equipment Contract Renegotiation</h3>
                <p className="text-xs sm:text-sm text-orange-700 mt-1">
                  Add tariff protection clauses to top 5 US equipment supplier contracts
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Timeline: 30-60 days
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">3. Alternative Equipment Sourcing</h3>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                  Pre-qualify Canadian/European equipment suppliers for critical categories
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Target: 2-3 alternatives per equipment category
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6" style={{ color: colors.accent }}>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 sm:mr-3" />
              Long-Term (6 months - 3 years)
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">1. Equipment Supply Chain Transformation</h3>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  Implement dual sourcing policy: No single country &gt;40% of equipment category spend
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Investment: $2-3M in systems and processes
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">2. Canadian Equipment Supplier Development</h3>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  Partner with Canadian equipment manufacturers to build local capacity
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  Target: 60% domestic equipment sourcing by 2027
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                <h3 className="font-semibold text-purple-800 text-sm sm:text-base">3. Predictive Equipment Analytics</h3>
                <p className="text-xs sm:text-sm text-purple-700 mt-1">
                  Deploy AI-powered equipment supply risk monitoring and demand forecasting
                </p>
                <div className="text-xs text-gray-600 mt-2">
                  ROI: 15-20% cost savings within 2 years
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 lg:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4" style={{ color: colors.primary }}>
            MOST URGENT RECOMMENDATION
          </h3>
          <div className="text-center">
            <p className="text-sm sm:text-lg font-medium text-gray-800">
              Immediately increase inventory for {analysisData?.vulnerableCategories[0]?.category || 'critical equipment'} 
              to mitigate ${analysisData ? (analysisData.vulnerableCategories[0]?.totalSpend / 1000000).toFixed(1) : '0'}M exposure
            </p>
          </div>
          <div className="text-center mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Analysis focuses on international electrical equipment procurement only (excludes Canadian suppliers - no domestic tariffs)
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 15: Q&A and Appendix
  const qnaSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.primary }}>
      <div className="h-full flex flex-col justify-center items-center text-center text-white">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">Questions & Discussion</h1>
          <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-2xl text-blue-200 mb-8">Thank you for your attention</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl">
          <div className="grid grid-cols-2 gap-8 text-left">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
              <ul className="space-y-2 text-lg">
                <li>• ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M annual cost risk from US tariffs</li>
                <li>• {analysisData?.vulnerableCategories.length || 0} high-risk categories identified</li>
                <li>• Immediate action required on inventory management</li>
                <li>• Long-term strategy shift toward domestic sourcing</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
              <ul className="space-y-2 text-lg">
                <li>• Form cross-functional risk committee</li>
                <li>• Develop detailed implementation plan</li>
                <li>• Secure budget for strategic initiatives</li>
                <li>• Begin supplier engagement immediately</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-lg text-blue-200">
          Appendix: Detailed data analysis and assumptions available upon request
        </div>
      </div>
    </div>
  );

  // Complete slides array with all 15 slides
  const slides = [
    { id: 'title', content: titleSlide },
    { id: 'executive-summary', content: executiveSummary },
    { id: 'methodology', content: methodologySlide },
    { id: 'spend-by-category', content: spendByCategorySlide },
    { id: 'risk-matrix', content: riskMatrixSlide },
    { id: 'lead-time-safety', content: leadTimeSlide },
    { id: 'spend-by-country', content: spendByCountrySlide },
    { id: 'top-vendors', content: topVendorsSlide },
    { id: 'tier2-mapping', content: tier2MappingSlide },
    { id: 'tariff-simulation', content: tariffSimulationSlide },
    { id: 'short-term-mitigation', content: shortTermMitigationSlide },
    { id: 'long-term-strategy', content: longTermStrategySlide },
    { id: 'benchmarking', content: benchmarkingSlide },
    { id: 'recommendations', content: recommendationsSlide },
    { id: 'qna', content: qnaSlide }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (vendorLoading || tradeLoading || !equipmentVendors.length) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-white text-2xl bg-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading BC Hydro Equipment Supply Chain Analysis...</p>
          {equipmentVendors.length === 0 && !vendorLoading && (
            <p className="text-sm text-gray-400 mt-2">Filtering equipment vendors from {vendorData.length} total records...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Slide Content */}
      <div className="h-full">
        {slides[currentSlide].content}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 border border-white/50 shadow-md"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        
        <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                index === currentSlide 
                  ? 'bg-blue-600 border-blue-700 shadow-md' 
                  : 'bg-white/60 border-gray-300 hover:bg-blue-200 hover:border-blue-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 border border-white/50 shadow-md"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 text-gray-800 font-semibold shadow-lg border border-white/50">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default BCHydroTier2SupplierSlideshow; 