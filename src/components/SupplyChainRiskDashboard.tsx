import React, { useState, useMemo } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const SupplyChainRiskDashboard: React.FC = () => {
  const { data } = useVendorRiskInventory();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get unique vendors by vendor_number, prioritizing highest risk level
  const uniqueVendors = data.reduce((acc, vendor) => {
    if (!vendor.vendor_number) return acc;
    
    const existingVendorIndex = acc.findIndex(v => v.vendor_number === vendor.vendor_number);
    
    if (existingVendorIndex === -1) {
      acc.push(vendor);
    } else {
      const existingRisk = acc[existingVendorIndex].risk_tolerance_category || 'Unknown';
      const currentRisk = vendor.risk_tolerance_category || 'Unknown';
      
      const getRiskPriority = (risk: string) => {
        switch (risk) {
          case 'Low': return 4;  // Low risk tolerance = High risk to us
          case 'Med': 
          case 'Medium': return 3; // Medium risk tolerance = Medium risk to us
          case 'High': return 2;   // High risk tolerance = Low risk to us
          default: return 1; // Unknown
        }
      };
      
      if (getRiskPriority(currentRisk) > getRiskPriority(existingRisk)) {
        acc[existingVendorIndex] = vendor;
      }
    }
    
    return acc;
  }, [] as typeof data);

  // Analysis 1: Category Risk Profile - Which categories are most vulnerable?
  const categoryRiskAnalysis = useMemo(() => {
    const analysis = uniqueVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const risk = vendor.risk_tolerance_category || 'Unknown';
      const leadTime = Number(vendor.average_lead_time_days || 0);
      const country = vendor.country_of_origin || 'Unknown';
      
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          high: 0,
          medium: 0,
          low: 0,
          avgLeadTime: 0,
          totalLeadTime: 0,
          countries: new Set(),
          totalSpend: 0,
          avgDaysOfSupply: 0,
          totalDaysOfSupply: 0,
          criticalVendors: 0
        };
      }
      
      acc[category].total++;
      acc[category].totalLeadTime += leadTime;
      acc[category].totalSpend += Number(vendor.annual_spend || 0);
      acc[category].totalDaysOfSupply += Number(vendor.days_of_supply_current || 0);
      acc[category].countries.add(country);
      
      if (risk === 'Low') acc[category].high++;  // Low tolerance = High risk
      else if (risk === 'Med' || risk === 'Medium') acc[category].medium++;
      else if (risk === 'High') acc[category].low++;  // High tolerance = Low risk
      
      // Critical vendor: Low risk tolerance OR long lead time (>60 days) OR low days of supply (<30)
      if (risk === 'Low' || leadTime > 60 || Number(vendor.days_of_supply_current || 0) < 30) {
        acc[category].criticalVendors++;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.entries(analysis)
      .map(([category, data]) => ({
        category: category.length > 20 ? category.substring(0, 20) + '...' : category,
        fullCategory: category,
        totalVendors: data.total,
        highRiskPct: (data.high / data.total * 100),
        mediumRiskPct: (data.medium / data.total * 100),
        avgLeadTime: data.totalLeadTime / data.total,
        geoConcentration: data.total / data.countries.size, // vendors per country
        avgSpend: data.totalSpend / data.total,
        avgDaysOfSupply: data.totalDaysOfSupply / data.total,
        criticalVendorPct: (data.criticalVendors / data.total * 100),
        vulnerabilityScore: (
          (data.high / data.total * 40) + // High risk weight: 40%
          (data.totalLeadTime / data.total / 100 * 30) + // Lead time weight: 30%
          ((data.total / data.countries.size) / 10 * 20) + // Geo concentration weight: 20%
          ((30 - Math.min(30, data.totalDaysOfSupply / data.total)) / 30 * 10) // Low inventory weight: 10%
        )
      }))
      .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
  }, [uniqueVendors]);

  // Analysis 2: Geographic Risk Assessment
  const geographicRiskAnalysis = useMemo(() => {
    const analysis = uniqueVendors.reduce((acc, vendor) => {
      const country = vendor.country_of_origin || 'Unknown';
      const risk = vendor.risk_tolerance_category || 'Unknown';
      const leadTime = Number(vendor.average_lead_time_days || 0);
      
      if (!acc[country]) {
        acc[country] = {
          totalVendors: 0,
          highRisk: 0,
          mediumRisk: 0,
          lowRisk: 0,
          totalLeadTime: 0,
          totalSpend: 0,
          categories: new Set(),
          criticalCategories: new Set()
        };
      }
      
      acc[country].totalVendors++;
      acc[country].totalLeadTime += leadTime;
      acc[country].totalSpend += Number(vendor.annual_spend || 0);
      acc[country].categories.add(vendor.category);
      
      if (risk === 'Low') {  // Low tolerance = High risk
        acc[country].highRisk++;
        acc[country].criticalCategories.add(vendor.category);
      } else if (risk === 'Med' || risk === 'Medium') {
        acc[country].mediumRisk++;
      } else if (risk === 'High') {  // High tolerance = Low risk
        acc[country].lowRisk++;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.entries(analysis)
      .map(([country, data]) => ({
        country,
        totalVendors: data.totalVendors,
        highRiskPct: (data.highRisk / data.totalVendors * 100),
        avgLeadTime: data.totalLeadTime / data.totalVendors,
        totalSpend: data.totalSpend,
        categoryDiversity: data.categories.size,
        criticalCategories: data.criticalCategories.size,
        riskScore: (
          (data.highRisk / data.totalVendors * 50) + // High risk vendor percentage
          (data.totalLeadTime / data.totalVendors / 100 * 30) + // Average lead time
          ((10 - Math.min(10, data.categories.size)) / 10 * 20) // Low category diversity
        )
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [uniqueVendors]);

  // Analysis 3: Lead Time & Inventory Risk
  const inventoryRiskAnalysis = useMemo(() => {
    return uniqueVendors
      .filter(v => v.average_lead_time_days && v.days_of_supply_current)
      .map(vendor => {
        const leadTime = Number(vendor.average_lead_time_days);
        const daysOfSupply = Number(vendor.days_of_supply_current);
        const safetyStock = Number(vendor.safety_stock || 0);
        const activeStock = Number(vendor.active_stock_unassigned || 0);
        
        // Risk factors
        const stockoutRisk = leadTime > daysOfSupply ? 'High' : leadTime > daysOfSupply * 0.5 ? 'Medium' : 'Low';
        const bufferCoverage = safetyStock > 0 ? activeStock / safetyStock : 0;
        
        return {
          vendor: vendor.vendor_number,
          category: vendor.category || 'Unknown',
          country: vendor.country_of_origin || 'Unknown',
          leadTime,
          daysOfSupply,
          stockoutRisk,
          bufferCoverage,
          criticalityScore: (
            (leadTime / 100 * 40) + // Lead time weight
            ((100 - Math.min(100, daysOfSupply)) / 100 * 40) + // Low inventory weight
            (stockoutRisk === 'High' ? 20 : stockoutRisk === 'Medium' ? 10 : 0) // Stockout risk weight
          )
        };
      })
      .sort((a, b) => b.criticalityScore - a.criticalityScore);
  }, [uniqueVendors]);

  // Analysis 4: Portfolio Risk Summary
  const portfolioAnalysis = useMemo(() => {
    const portfolioMap: Record<string, string> = {
      'Distribution Transf': 'Major Equipment',
      'Power Transformer': 'Major Equipment',
      'Switchgear': 'Major Equipment',
      'Major Gen Powerhouse': 'Major Equipment',
      'Protect/ControlEquip': 'Major Equipment',
      'IT': 'Engineering and Technology Services',
      'Telecom Equip': 'Engineering and Technology Services',
      'Wire And Cable': 'Material and Logistics',
      'Electrical Component': 'Material and Logistics',
      'Aux Elec Equip': 'Material and Logistics',
      'Fuel, Oil, Lubricant': 'Material and Logistics',
      'MRO-Gen Indus/Safety': 'Field Support Services',
      'Construct Material': 'Field Support Services'
    };
    
    const analysis = uniqueVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const portfolio = vendor.portfolio || portfolioMap[category] || 'Unknown';
      const risk = vendor.risk_tolerance_category || 'Unknown';
      
      if (!acc[portfolio]) {
        acc[portfolio] = {
          total: 0,
          highRisk: 0,
          mediumRisk: 0,
          lowRisk: 0,
          totalSpend: 0,
          avgLeadTime: 0,
          totalLeadTime: 0,
          countries: new Set(),
          categories: new Set()
        };
      }
      
      acc[portfolio].total++;
      acc[portfolio].totalSpend += Number(vendor.annual_spend || 0);
      acc[portfolio].totalLeadTime += Number(vendor.average_lead_time_days || 0);
      acc[portfolio].countries.add(vendor.country_of_origin);
      acc[portfolio].categories.add(category);
      
      if (risk === 'Low') acc[portfolio].highRisk++;  // Low tolerance = High risk
      else if (risk === 'Med' || risk === 'Medium') acc[portfolio].mediumRisk++;
      else if (risk === 'High') acc[portfolio].lowRisk++;  // High tolerance = Low risk
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.entries(analysis)
      .map(([portfolio, data]) => ({
        portfolio,
        totalVendors: data.total,
        highRiskPct: (data.highRisk / data.total * 100),
        mediumRiskPct: (data.mediumRisk / data.total * 100),
        lowRiskPct: (data.lowRisk / data.total * 100),
        avgLeadTime: data.totalLeadTime / data.total,
        totalSpend: data.totalSpend,
        geoConcentration: data.total / data.countries.size,
        categoryCount: data.categories.size
      }))
      .filter(p => p.portfolio !== 'Unknown');
  }, [uniqueVendors]);

  // Colors
  const RISK_COLORS = {
    'Low': '#10B981',
    'Medium': '#F59E0B',
    'High': '#EF4444'
  };
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const slides = [
    {
      title: "Executive Summary: Supply Chain Vulnerability Assessment",
      subtitle: "Key Risk Indicators and Strategic Priorities",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Critical Risk Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Unique Vendors</span>
                <span className="font-bold text-lg">{uniqueVendors.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Risk Tolerance Vendors</span>
                <span className="font-bold text-lg text-red-600">
                  {uniqueVendors.filter(v => v.risk_tolerance_category === 'Low').length}
                  ({((uniqueVendors.filter(v => v.risk_tolerance_category === 'Low').length / uniqueVendors.length) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Lead Time</span>
                <span className="font-bold text-lg">
                  {(uniqueVendors.reduce((sum, v) => sum + Number(v.average_lead_time_days || 0), 0) / uniqueVendors.length).toFixed(1)} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Geographic Concentration</span>
                <span className="font-bold text-lg">
                  {new Set(uniqueVendors.map(v => v.country_of_origin)).size} countries
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Most Vulnerable Categories</h3>
            <div className="space-y-2">
              {categoryRiskAnalysis.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700" title={cat.fullCategory}>
                    {idx + 1}. {cat.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${cat.vulnerabilityScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {cat.vulnerabilityScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Strategic Risk Factors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {inventoryRiskAnalysis.filter(v => v.stockoutRisk === 'High').length}
                </div>
                <div className="text-sm text-gray-600">High Stockout Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {uniqueVendors.filter(v => Number(v.average_lead_time_days || 0) > 60).length}
                </div>
                <div className="text-sm text-gray-600">Long Lead Time (greater than 60 days)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {uniqueVendors.filter(v => Number(v.days_of_supply_current || 0) < 30).length}
                </div>
                <div className="text-sm text-gray-600">Low Inventory (less than 30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${(uniqueVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Annual Spend</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Category Vulnerability Analysis",
      subtitle: "Identifying Equipment Categories Most at Risk of Supply Disruption",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryRiskAnalysis.slice(0, 12)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" fontSize={12} />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="font-semibold">{data.fullCategory}</p>
                      <p className="text-sm">Vulnerability Score: {data.vulnerabilityScore.toFixed(1)}%</p>
                      <p className="text-sm">Avg Lead Time: {data.avgLeadTime.toFixed(1)} days</p>
                      <p className="text-sm">High Risk: {data.highRiskPct.toFixed(1)}%</p>
                      <p className="text-sm">Critical Vendors: {data.criticalVendorPct.toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="vulnerabilityScore" fill="#EF4444" name="Vulnerability Score %" />
            <Bar dataKey="avgLeadTime" fill="#F59E0B" name="Avg Lead Time (days)" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Key Findings:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {categoryRiskAnalysis[0]?.fullCategory} shows highest vulnerability with {categoryRiskAnalysis[0]?.vulnerabilityScore.toFixed(1)}% risk score</li>
            <li>• Categories with lead times exceeding 60 days: {categoryRiskAnalysis.filter(c => c.avgLeadTime > 60).length}</li>
            <li>• {categoryRiskAnalysis.filter(c => c.highRiskPct > 20).length} categories have more than 20% high-risk vendors</li>
            <li>• Geographic concentration is a key risk factor for {categoryRiskAnalysis.filter(c => c.geoConcentration > 5).length} categories</li>
          </ul>
        </div>
      )
    },
    {
      title: "Geographic Risk Concentration",
      subtitle: "Supply Chain Risk by Country of Origin",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={geographicRiskAnalysis.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" angle={-30} textAnchor="end" fontSize={12} />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="font-semibold">{data.country}</p>
                      <p className="text-sm">Risk Score: {data.riskScore.toFixed(1)}%</p>
                      <p className="text-sm">Total Vendors: {data.totalVendors}</p>
                      <p className="text-sm">High Risk: {data.highRiskPct.toFixed(1)}%</p>
                      <p className="text-sm">Avg Lead Time: {data.avgLeadTime.toFixed(1)} days</p>
                      <p className="text-sm">Category Diversity: {data.categoryDiversity}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="riskScore" fill="#DC2626" name="Risk Score %" />
            <Bar dataKey="totalVendors" fill="#3B82F6" name="Total Vendors" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Geographic Risk Insights:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• {geographicRiskAnalysis[0]?.country} presents highest risk with {geographicRiskAnalysis[0]?.riskScore.toFixed(1)}% score</li>
            <li>• Countries with more than 50 day avg lead time: {geographicRiskAnalysis.filter(c => c.avgLeadTime > 50).length}</li>
            <li>• Total annual spend at risk from top 3 countries: ${(geographicRiskAnalysis.slice(0, 3).reduce((sum, c) => sum + c.totalSpend, 0) / 1000000).toFixed(1)}M</li>
            <li>• Recommendation: Diversify sourcing from {geographicRiskAnalysis.filter(c => c.categoryDiversity < 3).length} single-category countries</li>
          </ul>
        </div>
      )
    },
    {
      title: "Inventory & Lead Time Risk Matrix",
      subtitle: "Critical Vendors Requiring Immediate Attention",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="leadTime" 
              name="Lead Time (days)" 
              label={{ value: 'Lead Time (days)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="daysOfSupply" 
              name="Days of Supply"
              label={{ value: 'Days of Supply', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="font-semibold">Vendor: {data.vendor}</p>
                      <p className="text-sm">{data.category}</p>
                      <p className="text-sm">Lead Time: {data.leadTime} days</p>
                      <p className="text-sm">Days of Supply: {data.daysOfSupply}</p>
                      <p className="text-sm font-semibold">Stockout Risk: {data.stockoutRisk}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              name="Vendors" 
              data={inventoryRiskAnalysis.slice(0, 100)} 
              fill="#8884d8"
            >
              {inventoryRiskAnalysis.slice(0, 100).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.stockoutRisk === 'High' ? '#EF4444' : 
                    entry.stockoutRisk === 'Medium' ? '#F59E0B' : 
                    '#10B981'
                  } 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      ),
      insights: (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">Critical Inventory Risks:</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• {inventoryRiskAnalysis.filter(v => v.stockoutRisk === 'High').length} vendors have high stockout risk</li>
            <li>• {inventoryRiskAnalysis.filter(v => v.leadTime > v.daysOfSupply).length} vendors have lead time exceeding current inventory</li>
            <li>• Immediate action required for vendors with less than 30 days supply and more than 60 days lead time</li>
            <li>• Consider increasing safety stock for critical long-lead items</li>
          </ul>
        </div>
      )
    },
    {
      title: "Portfolio Risk Distribution",
      subtitle: "Risk Profile by Equipment Portfolio",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={portfolioAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="portfolio" angle={-45} textAnchor="end" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="highRiskPct" stackId="a" fill="#EF4444" name="Low Risk Tolerance %" />
            <Bar dataKey="mediumRiskPct" stackId="a" fill="#F59E0B" name="Medium Risk Tolerance %" />
            <Bar dataKey="lowRiskPct" stackId="a" fill="#10B981" name="High Risk Tolerance %" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Portfolio Strategic Insights:</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Major Equipment portfolio shows highest risk concentration requiring focused mitigation</li>
            <li>• Total spend across portfolios: ${(portfolioAnalysis.reduce((sum, p) => sum + p.totalSpend, 0) / 1000000).toFixed(1)}M</li>
            <li>• Average lead times vary significantly: {Math.min(...portfolioAnalysis.map(p => p.avgLeadTime)).toFixed(0)}-{Math.max(...portfolioAnalysis.map(p => p.avgLeadTime)).toFixed(0)} days</li>
            <li>• Geographic diversification needed most in portfolios with high geo-concentration ratios</li>
          </ul>
        </div>
      )
    },
    {
      title: "Strategic Recommendations",
      subtitle: "Data-Driven Actions to Mitigate Supply Chain Risks",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Immediate Actions (0-3 months)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">1.</span>
                <span>Increase safety stock for {inventoryRiskAnalysis.filter(v => v.stockoutRisk === 'High').length} high-risk vendors with lead times exceeding current inventory</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">2.</span>
                <span>Expedite orders for categories with less than 30 days of supply: {uniqueVendors.filter(v => Number(v.days_of_supply_current || 0) < 30).length} vendors affected</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">3.</span>
                <span>Establish alternative suppliers for single-sourced critical categories in high-risk countries</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-yellow-700">Short-term Actions (3-6 months)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-500 font-bold mr-2">1.</span>
                <span>Diversify sourcing from {geographicRiskAnalysis.filter(c => c.riskScore > 50).length} high-risk countries</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 font-bold mr-2">2.</span>
                <span>Implement vendor performance improvement plans for {uniqueVendors.filter(v => v.vendor_performance === 'Developing').length} developing vendors</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 font-bold mr-2">3.</span>
                <span>Negotiate long-term contracts for {categoryRiskAnalysis.filter(c => c.avgLeadTime > 60).length} long-lead categories</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Strategic Initiatives (6-12 months)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">1.</span>
                <span>Develop regional sourcing strategy to reduce average lead time from {(uniqueVendors.reduce((sum, v) => sum + Number(v.average_lead_time_days || 0), 0) / uniqueVendors.length).toFixed(1)} days</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">2.</span>
                <span>Implement predictive analytics for demand forecasting in volatile categories</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">3.</span>
                <span>Establish strategic inventory hubs for critical Major Equipment items</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Risk Mitigation Priorities</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm">Top Categories for Action:</p>
                <ul className="mt-1 text-xs space-y-1">
                  {categoryRiskAnalysis.slice(0, 3).map((cat, idx) => (
                    <li key={idx}>• {cat.fullCategory} (Risk: {cat.vulnerabilityScore.toFixed(0)}%)</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm">Geographic Diversification Targets:</p>
                <ul className="mt-1 text-xs space-y-1">
                  {geographicRiskAnalysis.slice(0, 3).map((geo, idx) => (
                    <li key={idx}>• Reduce exposure to {geo.country} ({geo.totalVendors} vendors)</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Supply Chain Risk Assessment Dashboard</h2>
            <p className="text-gray-600 mt-1">BC Hydro Equipment & Materials Supply Chain Analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{slides[currentSlide].title}</h3>
          <p className="text-gray-600">{slides[currentSlide].subtitle}</p>
        </div>

        {slides[currentSlide].chart && slides[currentSlide].chart}
        {slides[currentSlide].content && slides[currentSlide].content}
        {slides[currentSlide].insights && slides[currentSlide].insights}
        
        {/* Navigation dots */}
        <div className="flex justify-center mt-6 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 