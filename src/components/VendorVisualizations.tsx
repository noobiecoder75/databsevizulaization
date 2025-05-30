import React, { useState } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const VendorVisualizations: React.FC = () => {
  const { data } = useVendorRiskInventory();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter for equipment vendors only
  const excludeKeywords = [
    'services', 'service', 'consulting', 'management', 'construction equipment',
    'engineering design', 'engineering specialty', 'technical & specialized',
    'corporate', 'environment', 'field waste', 'marketing', 'legal', 'training',
    'contingent labour', 'resource augmentation', 'properties', 'facilities',
    'communication', 'protection & control', 'security & safety', 'installation',
    'maintenance', 'general construction', 'line services', 'civil underground',
    'vegetation', 'traffic', 'site safety'
  ];

  const equipmentData = data.filter(vendor => {
    const category = vendor.fuzzy_matched_category?.toLowerCase() || '';
    const isService = excludeKeywords.some(keyword => category.includes(keyword));
    if (isService) return false;
    
    const isEquipment = category.includes('equipment') || category.includes('transformer') ||
                       category.includes('electrical') || category.includes('generator') ||
                       category.includes('switchgear') || category.includes('wire') ||
                       category.includes('cable') || category.includes('fleet') ||
                       category.includes('vehicle') || category.includes('turbine') ||
                       category.includes('crane') || category.includes('auxiliary');
    
    return isEquipment;
  });

  // Slide 1: Lead Time Risk by Equipment Category (Bar Chart)
  const leadTimeAnalysis = equipmentData.reduce((acc, vendor) => {
    const category = vendor.fuzzy_matched_category || 'Other';
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    
    if (!acc[category]) {
      acc[category] = { totalLeadTime: 0, count: 0, vendors: [] };
    }
    acc[category].totalLeadTime += Number(leadTime);
    acc[category].count += 1;
    acc[category].vendors.push(vendor);
    return acc;
  }, {} as Record<string, any>);

  const leadTimeChartData = Object.entries(leadTimeAnalysis)
    .map(([category, data]) => ({
      category: category.length > 25 ? category.substring(0, 25) + '...' : category,
      fullCategory: category,
      avgLeadTime: Number((data.totalLeadTime / data.count).toFixed(1)),
      vendorCount: data.count,
      riskLevel: (data.totalLeadTime / data.count) > 30 ? 'High' : 
                 (data.totalLeadTime / data.count) > 15 ? 'Medium' : 'Low'
    }))
    .sort((a, b) => b.avgLeadTime - a.avgLeadTime)
    .slice(0, 10);

  // Slide 2: Risk Distribution (Pie Chart)
  const riskDistribution = equipmentData.reduce((acc, vendor) => {
    const risk = vendor.risk_tolerance_x || 'Unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskChartData = Object.entries(riskDistribution).map(([risk, count]) => ({
    name: risk,
    value: count,
    percentage: ((count / equipmentData.length) * 100).toFixed(1)
  }));

  // Slide 3: Geographic Distribution (Bar Chart)
  const geographicData = equipmentData.reduce((acc, vendor) => {
    const country = vendor.country_of_origin_x || vendor.country_of_origin || 'Unknown';
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    
    if (!acc[country]) {
      acc[country] = { count: 0, totalLeadTime: 0, highRiskVendors: 0 };
    }
    acc[country].count += 1;
    acc[country].totalLeadTime += Number(leadTime);
    if (Number(leadTime) > 30) acc[country].highRiskVendors += 1;
    return acc;
  }, {} as Record<string, any>);

  const geographicChartData = Object.entries(geographicData)
    .map(([country, data]) => ({
      country,
      vendorCount: data.count,
      avgLeadTime: Number((data.totalLeadTime / data.count).toFixed(1)),
      highRiskVendors: data.highRiskVendors
    }))
    .sort((a, b) => b.vendorCount - a.vendorCount)
    .slice(0, 8);

  // Slide 4: Inventory Risk Scatter Plot
  const inventoryRiskData = equipmentData
    .filter(vendor => {
      const daysOfSupply = vendor.days_of_supply_current || vendor.days_of_supply_current_y || 0;
      const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
      return Number(daysOfSupply) > 0 && Number(leadTime) > 0;
    })
    .map(vendor => {
      const daysOfSupply = Number(vendor.days_of_supply_current || vendor.days_of_supply_current_y || 0);
      const leadTime = Number(vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0);
      const frequency = Number(vendor.frequency_of_use || vendor.frequency_of_use_y || 0);
      
      let riskLevel = 'Low';
      if (daysOfSupply < leadTime && frequency > 5) riskLevel = 'Critical';
      else if (daysOfSupply < leadTime * 1.5) riskLevel = 'High';
      else if (daysOfSupply < leadTime * 2) riskLevel = 'Medium';
      
      return {
        vendor: vendor.vendor_name || 'Unknown',
        category: vendor.fuzzy_matched_category || 'Unknown',
        daysOfSupply,
        leadTime,
        frequency,
        riskLevel,
        x: leadTime,
        y: daysOfSupply,
        z: frequency
      };
    })
    .slice(0, 50);

  // Chart colors
  const RISK_COLORS = {
    'Low': '#10B981',
    'Medium': '#F59E0B', 
    'High': '#EF4444',
    'Critical': '#DC2626',
    'Unknown': '#6B7280'
  };

  const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  const formatNumber = (num: number) => {
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  const slides = [
    {
      title: "Equipment Lead Time Risk Analysis",
      subtitle: "Average Lead Times by Equipment Category",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={leadTimeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={120}
              interval={0}
              fontSize={12}
            />
            <YAxis label={{ value: 'Lead Time (Days)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value} days`,
                name === 'avgLeadTime' ? 'Average Lead Time' : name
              ]}
              labelFormatter={(label) => {
                const item = leadTimeChartData.find(d => d.category === label);
                return item?.fullCategory || label;
              }}
            />
            <Legend />
            <Bar 
              dataKey="avgLeadTime" 
              name="Average Lead Time"
            >
              {leadTimeChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.riskLevel as keyof typeof RISK_COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
      tableData: leadTimeChartData,
      tableColumns: [
        { key: 'fullCategory', label: 'Equipment Category' },
        { key: 'avgLeadTime', label: 'Avg Lead Time (Days)' },
        { key: 'vendorCount', label: 'Vendor Count' },
        { key: 'riskLevel', label: 'Risk Level' }
      ]
    },
    {
      title: "Equipment Vendor Risk Distribution",
      subtitle: "Risk Level Distribution Across Equipment Vendors",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={riskChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {riskChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} vendors`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ),
      tableData: riskChartData,
      tableColumns: [
        { key: 'name', label: 'Risk Level' },
        { key: 'value', label: 'Vendor Count' },
        { key: 'percentage', label: 'Percentage' }
      ]
    },
    {
      title: "Geographic Equipment Vendor Distribution",
      subtitle: "Equipment Vendors by Country of Origin",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={geographicChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis label={{ value: 'Number of Vendors', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="vendorCount" name="Equipment Vendors" fill="#3B82F6" />
            <Bar dataKey="highRiskVendors" name="High Risk Vendors" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      ),
      tableData: geographicChartData,
      tableColumns: [
        { key: 'country', label: 'Country' },
        { key: 'vendorCount', label: 'Total Vendors' },
        { key: 'avgLeadTime', label: 'Avg Lead Time (Days)' },
        { key: 'highRiskVendors', label: 'High Risk Vendors' }
      ]
    },
    {
      title: "Equipment Inventory Risk Matrix",
      subtitle: "Lead Time vs. Days of Supply Analysis",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Lead Time" 
              unit=" days"
              label={{ value: 'Lead Time (Days)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Days of Supply" 
              unit=" days"
              label={{ value: 'Days of Supply', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                      <p className="font-semibold">{data.vendor}</p>
                      <p className="text-sm text-gray-600">{data.category}</p>
                      <p>Lead Time: {data.leadTime} days</p>
                      <p>Days of Supply: {data.daysOfSupply} days</p>
                      <p>Usage Frequency: {data.frequency}/month</p>
                      <p className={`font-semibold ${
                        data.riskLevel === 'Critical' ? 'text-red-600' :
                        data.riskLevel === 'High' ? 'text-orange-600' :
                        data.riskLevel === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>Risk: {data.riskLevel}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              data={inventoryRiskData.filter(d => d.riskLevel === 'Low')} 
              fill="#10B981" 
              name="Low Risk"
            />
            <Scatter 
              data={inventoryRiskData.filter(d => d.riskLevel === 'Medium')} 
              fill="#F59E0B" 
              name="Medium Risk"
            />
            <Scatter 
              data={inventoryRiskData.filter(d => d.riskLevel === 'High')} 
              fill="#EF4444" 
              name="High Risk"
            />
            <Scatter 
              data={inventoryRiskData.filter(d => d.riskLevel === 'Critical')} 
              fill="#DC2626" 
              name="Critical Risk"
            />
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      ),
      tableData: inventoryRiskData.slice(0, 15),
      tableColumns: [
        { key: 'vendor', label: 'Equipment Vendor' },
        { key: 'category', label: 'Category' },
        { key: 'leadTime', label: 'Lead Time (Days)' },
        { key: 'daysOfSupply', label: 'Days of Supply' },
        { key: 'frequency', label: 'Usage Frequency' },
        { key: 'riskLevel', label: 'Risk Level' }
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Equipment Risk Visualizations</h2>
        <p className="text-gray-600">
          Interactive analysis of {equipmentData.length} equipment vendors. Use the navigation to explore different aspects of equipment supply chain risk.
        </p>
      </div>

      {/* Slideshow Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Slide Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentSlideData.title}</h3>
              <p className="text-gray-600 mt-1">{currentSlideData.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-6">
          {currentSlideData.chart}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-4">
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={currentSlide === 0}
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </button>

            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={currentSlide === slides.length - 1}
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border-t border-gray-200">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Supporting Data</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {currentSlideData.tableColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSlideData.tableData.map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {currentSlideData.tableColumns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {column.key === 'riskLevel' ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              row[column.key] === 'Critical' ? 'bg-red-100 text-red-800' :
                              row[column.key] === 'High' ? 'bg-orange-100 text-orange-800' :
                              row[column.key] === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {row[column.key]}
                            </span>
                          ) : (
                            row[column.key] || 'N/A'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Equipment Supply Chain Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• {leadTimeChartData.filter(cat => cat.riskLevel === 'High').length} equipment categories have high lead time risk (&gt;30 days)</li>
            <li>• {((riskDistribution['High'] || 0) / equipmentData.length * 100).toFixed(1)}% of equipment vendors are high risk</li>
            <li>• {geographicChartData.filter(geo => geo.highRiskVendors > 0).length} countries have high-risk equipment vendors</li>
          </ul>
          <ul className="space-y-2">
            <li>• {inventoryRiskData.filter(item => item.riskLevel === 'Critical').length} equipment items require immediate attention</li>
            <li>• Average equipment lead time: {formatNumber(equipmentData.reduce((sum, v) => sum + Number(v.avg_lead_time_days_x || v.avg_lead_time_days || 0), 0) / equipmentData.length)} days</li>
            <li>• Equipment vendors span {Object.keys(geographicData).length} countries globally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 