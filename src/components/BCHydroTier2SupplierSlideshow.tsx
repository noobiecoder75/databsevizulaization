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
    <div className="h-full flex flex-col justify-center items-center text-center relative px-4 sm:px-6" style={{ backgroundColor: colors.primary }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 opacity-90"></div>
      <div className="relative z-10 max-w-4xl">
        <div className="mb-4 sm:mb-6">
          <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-3 sm:mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">International Electrical Equipment Supply Chain Risk & Vendor Analysis</h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-blue-200 mb-2 sm:mb-3">BC Hydro</h2>
          <div className="w-20 sm:w-24 h-1 bg-white mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base lg:text-lg text-blue-100">Strategic Analysis Team | {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
      const riskTolerance = vendor.risk_tolerance_category || 'Medium';
      
      // Invert logic: Low tolerance = High risk, High tolerance = Low risk
      let riskLevel = 'Medium';
      let riskScore = 2;
      if (riskTolerance === 'Low') {
        riskLevel = 'High'; // Low tolerance means high risk for BC Hydro
        riskScore = 3;
      } else if (riskTolerance === 'High') {
        riskLevel = 'Low'; // High tolerance means low risk for BC Hydro  
        riskScore = 1;
      }
      
      if (!acc[category]) {
        acc[category] = {
        category,
          totalSpend: 0,
          vendorCount: 0,
          riskLevel,
          riskScore
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
      .map(vendor => {
        const riskTolerance = vendor.risk_tolerance_category || 'Medium';
        // Invert logic: Low tolerance = High risk, High tolerance = Low risk
        let riskLevel = 'Medium';
        if (riskTolerance === 'Low') {
          riskLevel = 'High';
        } else if (riskTolerance === 'High') {
          riskLevel = 'Low';
        }
        
        return {
          leadTime: Number(vendor.average_lead_time_days || 0),
          safetyStock: Number(vendor.safety_stock || 0),
          category: vendor.category,
          riskLevel,
          vendor: vendor.vendor_number
        };
      });

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

    // Top risk vendors - calculate risk score based on multiple factors
    const riskVendors = Object.values(vendorMap)
      .map(vendor => {
        const riskTolerance = vendor.risk_tolerance_category || 'Medium';
        const leadTime = Number(vendor.average_lead_time_days || 0);
        const spend = Number(vendor.annual_spend || 0);
        const safetyStock = Number(vendor.safety_stock || 0);
        
        // Risk tolerance score (inverted: Low tolerance = High risk for BC Hydro)
        let toleranceScore = 2;
        if (riskTolerance === 'Low') toleranceScore = 3; // High risk
        else if (riskTolerance === 'High') toleranceScore = 1; // Low risk
        
        // Lead time score (longer = riskier)
        let leadTimeScore = 1;
        if (leadTime > 90) leadTimeScore = 3;
        else if (leadTime > 60) leadTimeScore = 2;
        
        // Safety stock score (lower stock = riskier)
        let stockScore = 1;
        if (safetyStock < 50) stockScore = 3;
        else if (safetyStock < 100) stockScore = 2;
        
        // Spend impact factor (higher spend = higher impact if disrupted)
        const spendFactor = spend > 5000000 ? 1.5 : spend > 1000000 ? 1.2 : 1.0;
        
        // Combined risk score
        const riskScore = (toleranceScore + leadTimeScore + stockScore) * spendFactor;
        
        return {
          ...vendor,
          riskScore,
          toleranceScore,
          leadTimeScore,
          stockScore,
          riskLevel: riskScore > 8 ? 'Critical' : riskScore > 6 ? 'High' : riskScore > 4 ? 'Medium' : 'Low'
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

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

    // Most vulnerable categories (high risk + low buffer) - these are Low tolerance categories
    const vulnerableCategories = Object.values(riskMatrix)
      .filter(cat => cat.riskLevel === 'High') // High risk (low tolerance)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 3);

    return {
      topCategories,
      riskMatrixData,
      leadTimeData,
      topCountries,
      topVendors,
      riskVendors,
      tariffData,
      vulnerableCategories,
      totalSpend: equipmentVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0),
      usaTariffImpact: tariffData.reduce((sum, t) => sum + t.tariffCost, 0)
    };
  }, [equipmentVendors]);

  // Slide 2: Executive Summary
  const executiveSummary = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">EXECUTIVE SUMMARY</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        
        {/* Top Impact Numbers - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">TARIFF RISK</div>
            <div className="text-xs opacity-75 mt-1">Annual cost exposure from US tariffs</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              {analysisData?.vulnerableCategories.length || 0}
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">HIGH RISK</div>
            <div className="text-xs opacity-75 mt-1">Critical equipment categories</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white text-center shadow-lg">
            <div className="text-3xl lg:text-4xl font-black mb-2">
              ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
            </div>
            <div className="text-base lg:text-lg font-bold opacity-90">TOTAL VALUE</div>
            <div className="text-xs opacity-75 mt-1">International equipment portfolio</div>
          </div>
        </div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.danger }}>
              CRITICAL RISKS
            </h2>
            <div className="space-y-3">
              <div className="bg-red-50 border-l-8 border-red-500 p-3 rounded-r-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="text-lg lg:text-xl font-black text-red-600 mr-3">
                    {analysisData?.vulnerableCategories?.[0]?.category && analysisData.vulnerableCategories[0].category.length > 20 ? 
                      analysisData.vulnerableCategories[0].category.substring(0, 20) + '...' : 
                      analysisData?.vulnerableCategories?.[0]?.category || 'Loading...'}
                  </div>
                </div>
                <div className="text-lg font-bold text-red-700">
                  ${analysisData ? (analysisData.vulnerableCategories?.[0]?.totalSpend / 1000000).toFixed(1) : '0'}M AT RISK
                </div>
                <div className="text-xs text-red-600 font-medium">Most vulnerable equipment category</div>
              </div>
              
              <div className="bg-orange-50 border-l-8 border-orange-500 p-3 rounded-r-lg shadow-md">
                <div className="text-lg lg:text-xl font-black text-orange-600 mb-1">
                  US TARIFF IMPACT
                </div>
                <div className="text-base font-bold text-orange-700">
                  {analysisData?.tariffData.length || 0} CATEGORIES AFFECTED
                </div>
                <div className="text-xs text-orange-600 font-medium">25% tariff simulation results</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>
              ACTION PLAN
            </h2>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">1</div>
                  <div className="text-base font-black text-red-800">IMMEDIATE</div>
                </div>
                <div className="text-xs font-bold text-red-700">Increase buffer stock for US-sourced equipment</div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">2</div>
                  <div className="text-base font-black text-orange-800">SHORT-TERM</div>
                </div>
                <div className="text-xs font-bold text-orange-700">Diversify suppliers across stable regions</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 rounded-xl p-3">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-black mr-2">3</div>
                  <div className="text-base font-black text-blue-800">STRATEGIC</div>
                </div>
                <div className="text-xs font-bold text-blue-700">Negotiate tariff protection clauses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call-to-Action */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-3 text-center shadow-2xl">
          <div className="text-lg lg:text-xl font-black text-white mb-1">
            FOCUS: ELECTRICAL EQUIPMENT ONLY
          </div>
          <div className="text-sm text-gray-300 font-bold">
            {equipmentVendors.length} international vendor records analyzed | Canadian suppliers excluded (no tariffs)
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 3: Objective & Methodology
  const methodologySlide = (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">OBJECTIVE & METHODOLOGY</h1>
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black mb-4" style={{ color: colors.accent }}>
              <Target className="w-8 h-8 inline mr-3" />
              ANALYSIS GOAL
            </h2>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white mb-4 shadow-lg">
              <p className="text-lg lg:text-xl font-bold leading-relaxed">
                Identify vulnerabilities in electrical equipment vendor relationships to protect BC Hydro against supply chain disruptions
              </p>
            </div>
            
            <h3 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.secondary }}>KEY METRICS</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold text-blue-800">• Annual spend analysis</div>
              </div>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                <div className="font-bold text-red-800">• Risk assessment by category</div>
              </div>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
                <div className="font-bold text-orange-800">• 25% US tariff simulation</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl lg:text-4xl font-black mb-4" style={{ color: colors.accent }}>
              <Factory className="w-8 h-8 inline mr-3" />
              DATA SOURCES
            </h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl border-2 border-blue-300 shadow-md">
                <h4 className="font-black text-blue-900 text-lg">Equipment Vendor Inventory</h4>
                <p className="text-blue-700 font-medium">Complete electrical equipment data</p>
                <div className="text-blue-600 font-bold mt-1">{equipmentVendors.length} vendor records</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl border-2 border-green-300 shadow-md">
                <h4 className="font-black text-green-900 text-lg">Global Trade Data</h4>
                <p className="text-green-700 font-medium">International supply chain mapping</p>
                <div className="text-green-600 font-bold mt-1">{tradeData.length} trade records</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 rounded-xl border-2 border-yellow-400 shadow-md">
                <h4 className="font-black text-yellow-900 text-lg">ELECTRICAL EQUIPMENT ONLY</h4>
                <p className="text-yellow-700 font-bold">Transformers, switchgear, generators, batteries</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-xl border-2 border-red-400 shadow-md">
                <h4 className="font-black text-red-900 text-lg">EXCLUDES CANADIAN SUPPLIERS</h4>
                <p className="text-red-700 font-bold">No domestic tariffs - international focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 4: Spend by Product Category
  const spendByCategorySlide = (
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">ELECTRICAL EQUIPMENT SPEND</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.accent }}>ANNUAL SPENDING BY CATEGORY</h2>
            <div className="h-80 lg:h-96">
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
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>KEY INSIGHTS</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">TOP CATEGORY</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  {analysisData?.topCategories?.[0]?.category && analysisData.topCategories[0].category.length > 15 ? 
                    analysisData.topCategories[0].category.substring(0, 15) + '...' : 
                    analysisData?.topCategories?.[0]?.category || 'Loading...'}
                </div>
                <div className="text-lg font-bold opacity-90">
                  ${analysisData ? (analysisData.topCategories?.[0]?.spend / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">TOTAL PORTFOLIO</h3>
                <div className="text-2xl lg:text-3xl font-black">
                  ${analysisData ? (analysisData.totalSpend / 1000000).toFixed(0) : '0'}M
                </div>
                <div className="text-sm font-bold opacity-90">
                  {analysisData?.topCategories.length || 0} equipment categories
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">TOP 5 CATEGORIES</h3>
                <div className="space-y-1 mt-2">
                  {analysisData?.topCategories.slice(0, 5).map((cat, idx) => (
                    <div key={cat.category} className="flex justify-between text-xs">
                      <span className="font-bold truncate pr-2">{idx + 1}. {cat.category.length > 12 ? cat.category.substring(0, 12) + '...' : cat.category}</span>
                      <span className="text-blue-300 font-black">${(cat.spend / 1000000).toFixed(1)}M</span>
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
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">RISK MATRIX</h1>
      <div className="bg-white rounded-2xl p-6 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-black mb-4" style={{ color: colors.accent }}>RISK vs SPEND ANALYSIS</h2>
            <div className="h-80 lg:h-96">
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
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>RISK LEVELS</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-100 to-red-50 border-l-8 border-red-500 p-4 rounded-r-xl shadow-md">
                <h3 className="font-black text-red-900 text-sm">HIGH RISK (Low Tolerance)</h3>
                <p className="text-red-700 font-bold text-xs mt-1">BC Hydro has low tolerance for risk</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-8 border-yellow-500 p-4 rounded-r-xl shadow-md">
                <h3 className="font-black text-yellow-900 text-sm">MEDIUM RISK</h3>
                <p className="text-yellow-700 font-bold text-xs mt-1">Moderate risk tolerance</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-green-50 border-l-8 border-green-500 p-4 rounded-r-xl shadow-md">
                <h3 className="font-black text-green-900 text-sm">LOW RISK (High Tolerance)</h3>
                <p className="text-green-700 font-bold text-xs mt-1">BC Hydro can tolerate risk</p>
              </div>
              
              {['High', 'Medium', 'Low'].map(riskLevel => {
                const categories = analysisData?.riskMatrixData.filter(cat => cat.riskLevel === riskLevel) || [];
                const totalSpend = categories.reduce((sum, cat) => sum + cat.totalSpend, 0);
                
                // Don't show if there are 0 categories
                if (categories.length === 0) return null;
                
                return (
                  <div key={riskLevel} className={`p-3 rounded-xl shadow-md ${
                    riskLevel === 'High' ? 'bg-gradient-to-r from-red-500 to-red-700 text-white' :
                    riskLevel === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white' :
                    'bg-gradient-to-r from-green-500 to-green-700 text-white'
                  }`}>
                    <h3 className="font-black text-sm">
                      {riskLevel.toUpperCase()} RISK CATEGORIES: {categories.length}
                    </h3>
                    <div className="text-xs font-bold mt-1 space-y-1">
                      <div>${(totalSpend / 1000000).toFixed(1)}M Total Spend</div>
                      <div>{categories.reduce((sum, cat) => sum + cat.vendorCount, 0)} Vendors</div>
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

  // Slide 6: Lead Time vs Safety Stock
  const leadTimeSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">LEAD TIME vs SAFETY STOCK</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>BUFFER VULNERABILITY ANALYSIS</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analysisData?.leadTimeData || []} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="leadTime" 
                    name="Lead Time (Days)"
                    tickFormatter={(value) => `${value}d`}
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="safetyStock" 
                    name="Safety Stock"
                    tickFormatter={(value) => `${value.toFixed(0)}`}
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-300 rounded shadow text-sm">
                            <p className="font-semibold">Vendor {data.vendor}</p>
                            <p>Category: {data.category}</p>
                            <p>Lead Time: {data.leadTime} days</p>
                            <p>Safety Stock: {data.safetyStock}</p>
                            <p>Risk Level: {data.riskLevel}</p>
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
          
          <div className="overflow-y-auto">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.accent }}>RISK ZONES</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">RISK LOGIC</h3>
                <div className="text-xs font-bold mt-1">
                  • High Risk = Low tolerance<br/>
                  • Low Risk = High tolerance
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">CRITICAL ZONE</h3>
                <div className="text-xs font-bold mt-1">High lead + Low stock</div>
                <div className="text-xl lg:text-2xl font-black">
                  {analysisData?.leadTimeData.filter(d => d.leadTime > 90 && d.safetyStock < 50).length || 0}
                </div>
                <div className="text-xs font-bold opacity-90">vendors at risk</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">MEDIUM RISK</h3>
                <div className="text-xs font-bold mt-1">Moderate risk</div>
                <div className="text-xl lg:text-2xl font-black">
                  {analysisData?.leadTimeData.filter(d => 
                    (d.leadTime > 60 && d.leadTime <= 90) || 
                    (d.safetyStock >= 50 && d.safetyStock < 100)
                  ).length || 0}
                </div>
                <div className="text-xs font-bold opacity-90">vendors</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">WELL BUFFERED</h3>
                <div className="text-xs font-bold mt-1">Adequate stock</div>
                <div className="text-xl lg:text-2xl font-black">
                  {analysisData?.leadTimeData.filter(d => d.leadTime <= 60 && d.safetyStock >= 100).length || 0}
                </div>
                <div className="text-xs font-bold opacity-90">vendors secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 7: Spend by Country of Origin
  const spendByCountrySlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">INTERNATIONAL PROCUREMENT</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>BC HYDRO EQUIPMENT SOURCING</h2>
            <div className="h-80 lg:h-96">
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
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'BC Hydro Procurement']}
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
          
          <div className="overflow-y-auto">
            <h2 className="text-lg lg:text-xl font-black mb-3" style={{ color: colors.accent }}>RISK ASSESSMENT</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-sm">SCOPE</h3>
                <div className="text-xs font-bold mt-2">
                  International electrical equipment only. Canadian suppliers excluded.
                </div>
              </div>
              
              {analysisData?.topCountries.slice(0, 4).map((country, idx) => {
                const countryName = country.country?.toLowerCase() || '';
                let riskLevel = 'Low';
                let riskColor = 'from-green-500 to-green-700';
                
                if (countryName.includes('united states') || countryName.includes('usa') || countryName.includes('us')) {
                  riskLevel = 'HIGH TARIFF';
                  riskColor = 'from-red-500 to-red-700';
                } else if (countryName.includes('china') || countryName.includes('russia')) {
                  riskLevel = 'HIGH GEOPOLITICAL';
                  riskColor = 'from-red-500 to-red-700';
                } else if (countryName.includes('india') || countryName.includes('mexico')) {
                  riskLevel = 'MEDIUM';
                  riskColor = 'from-yellow-500 to-yellow-700';
                }
                
                return (
                  <div key={country.country} className={`bg-gradient-to-br ${riskColor} p-3 rounded-xl text-white shadow-lg`}>
                    <h3 className="font-black text-sm">
                      #{idx + 1} {country.country.length > 15 ? country.country.substring(0, 15) + '...' : country.country}
                    </h3>
                    <div className="text-lg lg:text-xl font-black">
                      ${(country.spend / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs font-bold opacity-90">
                      Risk: {riskLevel}
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

  // Slide 8: Top Risk Vendors (Updated to show highest risk vendors)
  const topVendorsSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-3 text-center text-white">TOP 5 VENDORS AT RISK</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-[calc(100%-5rem)] max-h-[calc(100vh-11rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          
          {/* Risk Vendor Rankings */}
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-2" style={{ color: colors.accent }}>HIGHEST RISK VENDORS</h2>
            <div className="space-y-1 h-[calc(100%-2.5rem)] flex flex-col justify-between">
              {analysisData?.riskVendors.map((vendor, idx) => {
                const riskColorMap = {
                  'Critical': 'border-red-600 bg-red-100',
                  'High': 'border-red-500 bg-red-50',
                  'Medium': 'border-yellow-500 bg-yellow-50',
                  'Low': 'border-green-500 bg-green-50'
                };
                const textColorMap = {
                  'Critical': 'text-red-900',
                  'High': 'text-red-800',
                  'Medium': 'text-yellow-800',
                  'Low': 'text-green-800'
                };
                
                const riskColor = riskColorMap[vendor.riskLevel as keyof typeof riskColorMap] || 'border-gray-500 bg-gray-50';
                const textColor = textColorMap[vendor.riskLevel as keyof typeof textColorMap] || 'text-gray-800';
                
                return (
                  <div key={vendor.vendor_number} className={`p-2 rounded-lg border-2 ${riskColor} shadow-md flex-grow flex flex-col justify-center`}>
                    {/* Header with rank and risk level */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-black text-sm text-gray-900">
                        #{idx + 1} RISK VENDOR
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-black ${textColor} bg-white/70`}>
                        {vendor.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                    
                    {/* Vendor details */}
                    <div className="grid grid-cols-2 gap-2 mb-1">
                      <div>
                        <div className="text-xs text-gray-600 font-medium">Country</div>
                        <div className="text-xs font-bold text-gray-900">{vendor.country_of_origin}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-medium">Annual Spend</div>
                        <div className="text-xs font-bold text-blue-700">
                          ${(Number(vendor.annual_spend || 0) / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk factors */}
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Lead Time</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {Number(vendor.average_lead_time_days || 0)}d
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Safety Stock</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {Number(vendor.safety_stock || 0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600 text-xs">Risk Score</div>
                        <div className={`font-bold ${textColor} text-xs`}>
                          {vendor.riskScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 truncate mt-1 italic">
                      {vendor.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Risk Analysis */}
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-2" style={{ color: colors.accent }}>RISK BREAKDOWN</h2>
            <div className="space-y-2 h-[calc(100%-2.5rem)] flex flex-col justify-between">
              
              {/* Risk Level Distribution */}
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-xl text-white shadow-lg flex-grow flex flex-col justify-center">
                <h3 className="font-black text-sm mb-1 text-center">RISK LEVEL DISTRIBUTION</h3>
                <div className="space-y-0.5 text-xs font-bold">
                  <div className="flex justify-between">
                    <span>Critical Risk:</span>
                    <span className="text-red-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'Critical').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk:</span>
                    <span className="text-orange-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'High').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk:</span>
                    <span className="text-yellow-200">
                      {analysisData?.riskVendors.filter(v => v.riskLevel === 'Medium').length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Risk Factors */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-2 rounded-xl text-white shadow-lg flex-grow flex flex-col justify-center">
                <h3 className="font-black text-sm mb-1 text-center">KEY RISK FACTORS</h3>
                <div className="space-y-0.5 text-xs font-bold">
                  <div className="flex justify-between">
                    <span>Long Lead Times (&gt;90d):</span>
                    <span className="text-red-200">
                      {analysisData?.riskVendors.filter(v => Number(v.average_lead_time_days || 0) > 90).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Safety Stock (&lt;50):</span>
                    <span className="text-yellow-200">
                      {analysisData?.riskVendors.filter(v => Number(v.safety_stock || 0) < 50).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Risk Tolerance:</span>
                    <span className="text-orange-200">
                      {analysisData?.riskVendors.filter(v => v.risk_tolerance_category === 'Low').length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Exposure */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl text-white shadow-lg flex-grow flex flex-col justify-center">
                <h3 className="font-black text-sm text-center">HIGH-RISK EXPOSURE</h3>
                <div className="text-lg lg:text-xl font-black mt-1 text-center">
                  ${analysisData ? (analysisData.riskVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0) / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90 text-center">
                  Combined annual spend at risk
                </div>
              </div>

              {/* Risk Methodology */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded-xl text-white shadow-lg flex-grow flex flex-col justify-center">
                <h3 className="font-black text-sm mb-1 text-center">RISK SCORING</h3>
                <div className="text-xs font-bold space-y-0.5">
                  <div>• Risk Tolerance (BC Hydro perspective)</div>
                  <div>• Lead Time (delivery delays)</div>
                  <div>• Safety Stock (buffer capacity)</div>
                  <div>• Financial Impact (spend multiplier)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 9: Tier-2 Supply Mapping
  const tier2MappingSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">SUPPLY CHAIN MAPPING</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>NETWORK OVERVIEW</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-2">BC HYDRO SUPPLIERS</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-black">{analysisData?.topVendors.length || 0}</div>
                    <div className="text-xs font-bold opacity-90">VENDORS</div>
                  </div>
                  <div>
                    <div className="text-xl font-black">{[...new Set(analysisData?.topVendors.map(v => v.country_of_origin))].length || 0}</div>
                    <div className="text-xs font-bold opacity-90">COUNTRIES</div>
                  </div>
                  <div>
                    <div className="text-xl font-black">{[...new Set(analysisData?.topVendors.map(v => v.category))].length || 0}</div>
                    <div className="text-xs font-bold opacity-90">CATEGORIES</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 overflow-y-auto h-40">
                <h3 className="text-lg font-black" style={{ color: colors.primary }}>TOP RELATIONSHIPS</h3>
                {analysisData?.topCountries.slice(0, 4).map((country, idx) => (
                  <div key={country.country} className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-xl border-l-4 border-blue-500 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-gray-900 text-sm">#{idx + 1} {country.country}</div>
                        <div className="text-xs font-bold text-gray-700">
                          ${(country.spend / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="text-blue-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>RISK INSIGHTS</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-2">HIGH RISK</h3>
                <div className="text-2xl font-black mb-1">{analysisData?.vulnerableCategories.length || 0}</div>
                <div className="text-xs font-bold opacity-90">categories with low tolerance</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-2">US TARIFF RISK</h3>
                <div className="text-2xl font-black mb-1">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-xs font-bold opacity-90">potential annual impact</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-2">DIVERSIFICATION</h3>
                <div className="text-xs font-bold mt-1">
                  Multiple regions available
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 text-xs font-bold">
                  <div className="bg-white/20 p-1 rounded text-center">EUR</div>
                  <div className="bg-white/20 p-1 rounded text-center">ASIA</div>
                  <div className="bg-white/20 p-1 rounded text-center">NAFTA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-gradient-to-r from-gray-900 to-black rounded-xl p-3 text-center shadow-2xl">
          <div className="text-lg font-black text-white">
            ELECTRICAL EQUIPMENT ONLY: {equipmentVendors.length} vendors
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 10: Tariff Simulation
  const tariffSimulationSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">25% US TARIFF SIMULATION</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>COST IMPACT BY CATEGORY</h2>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData?.tariffData || []} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
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
                  <Bar dataKey="currentSpend" fill={colors.primary} name="Current Spend" />
                  <Bar dataKey="tariffCost" fill={colors.danger} name="25% Tariff Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="overflow-y-auto">
            <h2 className="text-lg lg:text-xl font-black mb-4" style={{ color: colors.accent }}>IMPACT SUMMARY</h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">TOTAL ANNUAL IMPACT</h3>
                <div className="text-2xl lg:text-3xl font-black mt-2">
                  ${analysisData ? (analysisData.usaTariffImpact / 1000000).toFixed(1) : '0'}M
                </div>
                <div className="text-sm font-bold opacity-90">25% tariff on US equipment</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg mb-3">MOST AFFECTED</h3>
                <div className="space-y-2">
                  {analysisData?.tariffData.slice(0, 4).map((cat, idx) => (
                    <div key={cat.category} className="bg-white/20 p-2 rounded text-sm">
                      <div className="font-bold">{idx + 1}. {cat.category.length > 20 ? cat.category.substring(0, 20) + '...' : cat.category}</div>
                      <div className="text-xs font-bold opacity-90">
                        +${(cat.tariffCost / 1000000).toFixed(1)}M annually
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg">CATEGORIES AT RISK</h3>
                <div className="text-2xl lg:text-3xl font-black mt-2">
                  {analysisData?.tariffData.length || 0}
                </div>
                <div className="text-sm font-bold opacity-90">Equipment categories affected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 11: Short-term Mitigation
  const shortTermMitigationSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">IMMEDIATE ACTIONS (0-6 MONTHS)</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-[calc(100%-6rem)] max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>INVENTORY MANAGEMENT</h2>
            <div className="space-y-2 h-full flex flex-col justify-around">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center text-base font-black mr-2">1</div>
                  <h3 className="font-black text-base text-white">INCREASE US EQUIPMENT BUFFERS</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Boost safety stock for vulnerable categories by 50-100% before tariffs take effect
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Target: {analysisData?.tariffData.length || 0} categories</div>
                  <div className="font-bold">Timeline: 60 days</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-yellow-600 rounded-full flex items-center justify-center text-base font-black mr-2">2</div>
                  <h3 className="font-black text-base text-white">ACCELERATE PENDING ORDERS</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Fast-track Q1-Q2 procurement to avoid tariff impact
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Potential savings: $2-4M</div>
                  <div className="font-bold">Priority: US sourced equipment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-base font-black mr-2">3</div>
                  <h3 className="font-black text-base text-white">CONTRACT RENEGOTIATION</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Add tariff protection clauses to existing agreements
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Priority: Top 10 vendors</div>
                  <div className="font-bold">Cost protection mechanisms</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.accent }}>SUPPLIER ENGAGEMENT</h2>
            <div className="space-y-2 h-full flex flex-col justify-around">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center text-base font-black mr-2">4</div>
                  <h3 className="font-black text-base text-white">ALTERNATIVE SOURCING</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Activate backup suppliers in Europe and Asia for critical items
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Lead time: 60-90 days</div>
                  <div className="font-bold">Focus: High-risk categories</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center text-base font-black mr-2">5</div>
                  <h3 className="font-black text-base text-white">RISK COMMUNICATION</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Notify all US suppliers of potential supply disruptions
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Timeline: Within 2 weeks</div>
                  <div className="font-bold">Stakeholder alignment</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-white text-orange-600 rounded-full flex items-center justify-center text-base font-black mr-2">6</div>
                  <h3 className="font-black text-base text-white">MONITORING SYSTEM</h3>
                </div>
                <p className="text-xs font-bold mb-1">
                  Implement daily tracking of tariff policy developments
                </p>
                <div className="bg-white/20 p-1 rounded-lg text-xs">
                  <div className="font-bold">Resource: 1 FTE analyst</div>
                  <div className="font-bold">Real-time alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 12: Long-term Strategy
  const longTermStrategySlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.accent }}>
      <h1 className="text-5xl font-bold mb-8 text-white text-center">Strategic Transformation (6-24 Months)</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Diversification</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-900 text-sm">European Partnerships</h3>
                <p className="text-xs text-blue-700 mt-1">Establish relationships with German and Nordic suppliers</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900 text-sm">Asian Market Entry</h3>
                <p className="text-xs text-green-700 mt-1">Qualify Japanese and South Korean manufacturers</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <h3 className="font-semibold text-purple-900 text-sm">Regional Hubs</h3>
                <p className="text-xs text-purple-700 mt-1">Leverage Mexico and Canadian manufacturing</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Innovation</h2>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded">
                <h3 className="font-semibold text-yellow-900 text-sm">Local Manufacturing</h3>
                <p className="text-xs text-yellow-700 mt-1">Partner with Canadian firms for equipment assembly</p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <h3 className="font-semibold text-red-900 text-sm">Technology Upgrade</h3>
                <p className="text-xs text-red-700 mt-1">Invest in digital twin and predictive maintenance</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded">
                <h3 className="font-semibold text-indigo-900 text-sm">Joint Ventures</h3>
                <p className="text-xs text-indigo-700 mt-1">Co-develop next-gen equipment with partners</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Operations</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-semibold text-gray-900 text-sm">Flexible Contracts</h3>
                <p className="text-xs text-gray-700 mt-1">Multi-source agreements with automatic switching</p>
              </div>
              <div className="p-3 bg-teal-50 rounded">
                <h3 className="font-semibold text-teal-900 text-sm">Risk Analytics</h3>
                <p className="text-xs text-teal-700 mt-1">AI-powered supply chain risk monitoring</p>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900 text-sm">Scenario Planning</h3>
                <p className="text-xs text-orange-700 mt-1">Quarterly stress testing of supply strategies</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg text-white text-center">
          <h3 className="font-bold text-lg">Target: Reduce US dependency from 35% to 15% by 2026</h3>
          <p className="text-sm mt-1">Estimated investment: $8-12M | Potential savings: $15-25M annually</p>
        </div>
      </div>
    </div>
  );

  // Slide 13: Benchmarking
  const benchmarkingSlide = (
    <div className="h-full p-6 lg:p-8 pb-24" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">INDUSTRY BENCHMARKING</h1>
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-2xl h-4/5 max-h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>UTILITY PEERS</h2>
            <div className="space-y-3 overflow-y-auto h-4/5">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">Hydro-Québec</h3>
                <div className="mt-2 space-y-1 text-xs font-bold">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>70% domestic sourcing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>3-year diversification</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Regional partnerships</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">Ontario Power</h3>
                <div className="mt-2 space-y-1 text-xs font-bold">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Multi-source contracts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>6-month buffer policy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Quarterly assessments</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-white shadow-lg">
                <h3 className="font-black text-lg text-white">PG&E</h3>
                <div className="mt-2 space-y-1 text-xs font-bold">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Tariff hedging contracts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Strategic partnerships</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>25% local content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-4" style={{ color: colors.accent }}>BEST PRACTICES</h2>
            <div className="space-y-3 overflow-y-auto h-4/5">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-lg">
                <h3 className="font-black text-blue-900 text-sm">Risk-Adjusted Sourcing</h3>
                <p className="text-xs font-bold text-blue-700 mt-1">
                  40-60% from stable regions
                </p>
                <div className="mt-2 bg-blue-500 text-white p-1 rounded text-center font-black text-xs">
                  STANDARD
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-lg">
                <h3 className="font-black text-green-900 text-sm">Dynamic Contracts</h3>
                <p className="text-xs font-bold text-green-700 mt-1">
                  Flexible pricing mechanisms
                </p>
                <div className="mt-2 bg-green-500 text-white p-1 rounded text-center font-black text-xs">
                  EMERGING
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl shadow-lg">
                <h3 className="font-black text-yellow-900 text-sm">Predictive Analytics</h3>
                <p className="text-xs font-bold text-yellow-700 mt-1">
                  AI early warning systems
                </p>
                <div className="mt-2 bg-yellow-500 text-white p-1 rounded text-center font-black text-xs">
                  INNOVATION
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-lg">
                <h3 className="font-black text-purple-900 text-sm">Collaborative Networks</h3>
                <p className="text-xs font-bold text-purple-700 mt-1">
                  Joint procurement initiatives
                </p>
                <div className="mt-2 bg-purple-500 text-white p-1 rounded text-center font-black text-xs">
                  COST SAVINGS
                </div>
              </div>
            </div>
            
            <div className="mt-3 bg-gradient-to-r from-red-500 to-red-700 p-4 rounded-xl text-white shadow-lg">
              <h3 className="font-black text-lg">BC HYDRO POSITION</h3>
              <p className="text-xs font-bold mt-1 mb-2">
                Below industry average for resilience.
              </p>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="text-sm font-black">BECOME LEADER</div>
                <div className="text-xs font-bold">With investment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 14: Recommendations
  const recommendationsSlide = (
    <div className="h-full p-12" style={{ backgroundColor: colors.primary }}>
      <h1 className="text-5xl font-bold mb-8 text-white text-center">Strategic Recommendations</h1>
      <div className="bg-white rounded-lg p-6 shadow-lg h-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Priority Actions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border-l-4 border-red-500">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">1</div>
                  <h3 className="font-semibold text-red-900">IMMEDIATE BUFFER INCREASE</h3>
                </div>
                <p className="text-sm text-red-700">
                  Increase safety stock for US-sourced equipment by 75% within 60 days
                </p>
                <div className="text-xs text-gray-600 mt-1">Investment: $5-8M | Timeline: 2 months</div>
              </div>
              
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">2</div>
                  <h3 className="font-semibold text-orange-900">SUPPLIER DIVERSIFICATION</h3>
                </div>
                <p className="text-sm text-orange-700">
                  Qualify alternate suppliers for top 5 risk categories
                </p>
                <div className="text-xs text-gray-600 mt-1">Target: 3-6 months | Risk reduction: 40%</div>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">3</div>
                  <h3 className="font-semibold text-yellow-900">CONTRACT RESTRUCTURING</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  Renegotiate agreements with tariff protection clauses
                </p>
                <div className="text-xs text-gray-600 mt-1">Savings potential: $3-5M annually</div>
              </div>
              
              <div className="p-4 bg-green-50 border-l-4 border-green-500">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">4</div>
                  <h3 className="font-semibold text-green-900">MONITORING SYSTEM</h3>
                </div>
                <p className="text-sm text-green-700">
                  Deploy AI-powered supply chain risk analytics platform
                </p>
                <div className="text-xs text-gray-600 mt-1">ROI: 200% within 18 months</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.accent }}>Success Metrics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">6-Month Targets</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>US dependency reduction:</span>
                    <span className="font-bold">35% → 25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average safety stock:</span>
                    <span className="font-bold">90 → 120 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qualified backup suppliers:</span>
                    <span className="font-bold">+15 vendors</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">18-Month Goals</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cost risk reduction:</span>
                    <span className="font-bold">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supply chain resilience score:</span>
                    <span className="font-bold">Industry leading</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual savings:</span>
                    <span className="font-bold">$12-18M</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-3">Investment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total investment (24 months):</span>
                    <span className="font-bold">$15-22M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected annual savings:</span>
                    <span className="font-bold">$18-28M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback period:</span>
                    <span className="font-bold text-green-600">10-14 months</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg text-center">
              <h3 className="font-bold text-lg">Net Present Value: $45-65M over 5 years</h3>
            </div>
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