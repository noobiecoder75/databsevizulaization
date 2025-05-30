import React, { useState } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const VendorVisualizations: React.FC = () => {
  const { data } = useVendorRiskInventory();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get unique vendors by vendor_number to avoid duplicates
  const uniqueVendors = data.reduce((acc, vendor) => {
    if (vendor.vendor_number && !acc.find(v => v.vendor_number === vendor.vendor_number)) {
      acc.push(vendor);
    }
    return acc;
  }, [] as typeof data);

  console.log(`Total records: ${data.length}, Unique vendors: ${uniqueVendors.length}`);

  // Slide 1: Lead Time Risk by Category (Bar Chart)
  const leadTimeAnalysis = uniqueVendors.reduce((acc, vendor) => {
    const category = vendor.category || 'Other';
    const leadTime = vendor.average_lead_time_days || 0;
    
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
    .slice(0, 15);

  // Slide 2: Risk Distribution (Pie Chart)
  const riskDistribution = uniqueVendors.reduce((acc, vendor) => {
    let risk = vendor.risk_tolerance_category || 'Unknown';
    
    // If no risk category, calculate from lead time
    if (risk === 'Unknown' || !risk) {
      const leadTime = vendor.average_lead_time_days || 0;
      if (leadTime > 30) risk = 'High';
      else if (leadTime > 15) risk = 'Medium';
      else risk = 'Low';
    }
    
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskChartData = Object.entries(riskDistribution).map(([risk, count]) => ({
    name: risk,
    value: count,
    percentage: ((count / uniqueVendors.length) * 100).toFixed(1)
  }));

  // Slide 3: Geographic Distribution (Bar Chart)
  const geographicData = uniqueVendors.reduce((acc, vendor) => {
    const country = vendor.country_of_origin || 'Unknown';
    const leadTime = vendor.average_lead_time_days || 0;
    
    if (!acc[country]) {
      acc[country] = { count: 0, totalLeadTime: 0, highRiskVendors: 0, totalSpend: 0 };
    }
    acc[country].count += 1;
    acc[country].totalLeadTime += Number(leadTime);
    acc[country].totalSpend += Number(vendor.annual_spend || 0);
    if (Number(leadTime) > 30) acc[country].highRiskVendors += 1;
    return acc;
  }, {} as Record<string, any>);

  const geographicChartData = Object.entries(geographicData)
    .map(([country, data]) => ({
      country,
      vendorCount: data.count,
      avgLeadTime: Number((data.totalLeadTime / data.count).toFixed(1)),
      highRiskVendors: data.highRiskVendors,
      totalSpend: data.totalSpend
    }))
    .sort((a, b) => b.vendorCount - a.vendorCount)
    .slice(0, 10);

  // Slide 4: Portfolio Performance Matrix
  const portfolioData = uniqueVendors
    .filter(vendor => vendor.portfolio && vendor.annual_spend)
    .reduce((acc, vendor) => {
      const portfolio = vendor.portfolio || 'Unknown';
      const spend = Number(vendor.annual_spend || 0);
      const leadTime = Number(vendor.average_lead_time_days || 0);
      
      if (!acc[portfolio]) {
        acc[portfolio] = {
          portfolio,
          totalSpend: 0,
          avgLeadTime: 0,
          vendorCount: 0,
          performances: []
        };
      }
      
      acc[portfolio].totalSpend += spend;
      acc[portfolio].avgLeadTime += leadTime;
      acc[portfolio].vendorCount += 1;
      if (vendor.vendor_performance) {
        acc[portfolio].performances.push(vendor.vendor_performance);
      }
      
      return acc;
    }, {} as Record<string, any>);

  const portfolioChartData = Object.values(portfolioData)
    .map((portfolio: any) => ({
      portfolio: portfolio.portfolio,
      avgSpend: portfolio.totalSpend / portfolio.vendorCount,
      avgLeadTime: portfolio.avgLeadTime / portfolio.vendorCount,
      vendorCount: portfolio.vendorCount,
      x: portfolio.avgLeadTime / portfolio.vendorCount,
      y: portfolio.totalSpend / portfolio.vendorCount / 1000, // Convert to thousands
      riskLevel: (portfolio.avgLeadTime / portfolio.vendorCount) > 30 ? 'High' : 
                 (portfolio.avgLeadTime / portfolio.vendorCount) > 15 ? 'Medium' : 'Low'
    }))
    .filter(p => p.vendorCount > 0)
    .slice(0, 20);

  // Slide 5: Annual Spend by Country (Bar Chart)
  const spendByCountryData = Object.entries(geographicData)
    .map(([country, data]) => ({
      country: country.length > 15 ? country.substring(0, 15) + '...' : country,
      fullCountry: country,
      totalSpend: data.totalSpend,
      vendorCount: data.count,
      avgSpendPerVendor: data.totalSpend / data.count,
      spendInMillions: data.totalSpend / 1000000
    }))
    .filter(item => item.totalSpend > 0) // Only show countries with spend data
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 12);

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

  const formatCurrency = (num: number) => {
    return isNaN(num) ? 'N/A' : `$${(num / 1000).toFixed(0)}K`;
  };

  const formatCurrencyMillions = (num: number) => {
    return isNaN(num) ? 'N/A' : `$${(num / 1000000).toFixed(1)}M`;
  };

  const slides = [
    {
      title: "Vendor Lead Time Risk Analysis",
      subtitle: "Average Lead Times by Vendor Category",
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
        { key: 'fullCategory', label: 'Vendor Category' },
        { key: 'avgLeadTime', label: 'Avg Lead Time (Days)' },
        { key: 'vendorCount', label: 'Vendor Count' },
        { key: 'riskLevel', label: 'Risk Level' }
      ]
    },
    {
      title: "Vendor Risk Distribution",
      subtitle: "Risk Level Distribution Based on Lead Time and Categories",
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
      title: "Geographic Vendor Distribution",
      subtitle: "Vendors by Country with Risk and Spend Analysis",
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
            <Bar dataKey="vendorCount" name="Total Vendors" fill="#3B82F6" />
            <Bar dataKey="highRiskVendors" name="High Risk Vendors" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      ),
      tableData: geographicChartData,
      tableColumns: [
        { key: 'country', label: 'Country' },
        { key: 'vendorCount', label: 'Total Vendors' },
        { key: 'avgLeadTime', label: 'Avg Lead Time (Days)' },
        { key: 'highRiskVendors', label: 'High Risk Vendors' },
        { key: 'totalSpend', label: 'Total Annual Spend' }
      ]
    },
    {
      title: "Portfolio Performance Analysis",
      subtitle: "Portfolio Lead Time vs. Average Annual Spend",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Lead Time" 
              unit=" days"
              label={{ value: 'Average Lead Time (Days)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Annual Spend" 
              unit="K"
              label={{ value: 'Average Annual Spend ($K)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                      <p className="font-semibold">{data.portfolio}</p>
                      <p>Lead Time: {data.avgLeadTime.toFixed(1)} days</p>
                      <p>Avg Spend: {formatCurrency(data.avgSpend)}</p>
                      <p>Vendor Count: {data.vendorCount}</p>
                      <p className={`font-semibold ${
                        data.riskLevel === 'High' ? 'text-red-600' :
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
              data={portfolioChartData.filter(d => d.riskLevel === 'Low')} 
              fill="#10B981" 
              name="Low Risk"
            />
            <Scatter 
              data={portfolioChartData.filter(d => d.riskLevel === 'Medium')} 
              fill="#F59E0B" 
              name="Medium Risk"
            />
            <Scatter 
              data={portfolioChartData.filter(d => d.riskLevel === 'High')} 
              fill="#EF4444" 
              name="High Risk"
            />
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      ),
      tableData: portfolioChartData.slice(0, 10),
      tableColumns: [
        { key: 'portfolio', label: 'Portfolio' },
        { key: 'vendorCount', label: 'Vendor Count' },
        { key: 'avgLeadTime', label: 'Avg Lead Time (Days)' },
        { key: 'avgSpend', label: 'Avg Annual Spend' },
        { key: 'riskLevel', label: 'Risk Level' }
      ]
    },
    {
      title: "Annual Spend by Country",
      subtitle: "Total Annual Procurement Spend by Vendor Country",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={spendByCountryData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Annual Spend (Millions $)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'spendInMillions' ? `$${Number(value).toFixed(1)}M` : value,
                name === 'spendInMillions' ? 'Total Annual Spend' : name
              ]}
              labelFormatter={(label) => {
                const item = spendByCountryData.find(d => d.country === label);
                return item?.fullCountry || label;
              }}
            />
            <Legend />
            <Bar 
              dataKey="spendInMillions" 
              name="Annual Spend ($M)"
              fill="#1F2937"
            />
          </BarChart>
        </ResponsiveContainer>
      ),
      tableData: spendByCountryData,
      tableColumns: [
        { key: 'fullCountry', label: 'Country' },
        { key: 'totalSpend', label: 'Total Annual Spend' },
        { key: 'vendorCount', label: 'Vendor Count' },
        { key: 'avgSpendPerVendor', label: 'Avg Spend per Vendor' }
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Vendor Risk Visualizations</h2>
        <p className="text-gray-600">
          Interactive analysis of {uniqueVendors.length} unique vendors ({data.length} total records). 
          {data.length - uniqueVendors.length > 0 && (
            <span className="text-orange-600 font-medium">
              {' '}Note: {data.length - uniqueVendors.length} duplicate vendor numbers detected.
            </span>
          )}
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
                          ) : column.key === 'avgSpend' || column.key === 'totalSpend' || column.key === 'avgSpendPerVendor' ? (
                            formatCurrencyMillions(row[column.key])
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
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Vendor Supply Chain Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• {leadTimeChartData.filter(cat => cat.riskLevel === 'High').length} vendor categories have high lead time risk (&gt;30 days)</li>
            <li>• {((riskDistribution['High'] || 0) / uniqueVendors.length * 100).toFixed(1)}% of vendors are high risk</li>
            <li>• {geographicChartData.filter(geo => geo.highRiskVendors > 0).length} countries have high-risk vendors</li>
            <li>• {spendByCountryData[0]?.fullCountry || 'N/A'} has the highest annual spend ({formatCurrencyMillions(spendByCountryData[0]?.totalSpend || 0)})</li>
          </ul>
          <ul className="space-y-2">
            <li>• {portfolioChartData.filter(item => item.riskLevel === 'High').length} portfolios require immediate attention</li>
            <li>• Average vendor lead time: {formatNumber(uniqueVendors.reduce((sum, v) => sum + Number(v.average_lead_time_days || 0), 0) / uniqueVendors.length)} days</li>
            <li>• Vendors span {Object.keys(geographicData).length} countries globally</li>
            <li>• Total annual procurement spend: {formatCurrencyMillions(spendByCountryData.reduce((sum, country) => sum + country.totalSpend, 0))}</li>
          </ul>
        </div>
      </div>

      {/* Duplicate Warning */}
      {data.length - uniqueVendors.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-3">Data Quality Alert</h3>
          <p className="text-orange-800">
            <strong>{data.length - uniqueVendors.length} duplicate vendor numbers detected</strong> in your dataset. 
            Consider cleaning the data to remove duplicates for more accurate analysis. 
            Total records: {data.length}, Unique vendors: {uniqueVendors.length}
          </p>
        </div>
      )}
    </div>
  );
}; 