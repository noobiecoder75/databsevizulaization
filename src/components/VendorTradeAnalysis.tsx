import React, { useState, useMemo } from 'react';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Treemap, Cell } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const VendorTradeAnalysis: React.FC = () => {
  const { data, loading, error, getSubcategoryByHsCode } = useCountryTradePartners();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Focus countries (excluding Canada as requested for analysis)
  const focusCountries = ['United States of America', 'Germany', 'Japan', 'India'];

  // Filter for electrical equipment data - flows TO Canada
  const canadaTradeFlows = useMemo(() => {
    return data.filter(item => {
      const subcategory = getSubcategoryByHsCode(item.hs_code);
      const isElectricalEquipment = subcategory !== 'Other';
      const isToCanada = item.reporter_name === 'Canada';
      const isFromFocusCountry = focusCountries.includes(item.partner_name || '');
      
      return isElectricalEquipment && isToCanada && isFromFocusCountry;
    });
  }, [data, getSubcategoryByHsCode]);

  // Analysis 1: Trade Flow Waterfall by Category
  const tradeFlowByCategory = useMemo(() => {
    const categories = [...new Set(canadaTradeFlows.map(item => getSubcategoryByHsCode(item.hs_code)))];
    
    return categories.map(category => {
      const categoryData = canadaTradeFlows.filter(item => getSubcategoryByHsCode(item.hs_code) === category);
      
      // Calculate flows from each focus country
      const countryFlows = focusCountries.map(country => {
        const countryValue = categoryData
          .filter(item => item.partner_name === country)
          .reduce((sum, item) => sum + Number(item.import_value || 0), 0);
        
        return {
          country: country.replace('United States of America', 'USA'),
          value: countryValue / 1000000,
          percentage: 0 // Will calculate below
        };
      }).filter(flow => flow.value > 0);

      const totalValue = countryFlows.reduce((sum, flow) => sum + flow.value, 0);
      
      // Calculate percentages
      countryFlows.forEach(flow => {
        flow.percentage = totalValue > 0 ? (flow.value / totalValue * 100) : 0;
      });

      return {
        category,
        totalValue,
        flows: countryFlows.sort((a, b) => b.value - a.value),
        transactions: categoryData.length
      };
    }).filter(cat => cat.totalValue > 0).sort((a, b) => b.totalValue - a.totalValue);
  }, [canadaTradeFlows, getSubcategoryByHsCode]);

  // Analysis 2: Country-to-Canada Flow Analysis
  const countryFlowAnalysis = useMemo(() => {
    return focusCountries.map(country => {
      const countryFlows = canadaTradeFlows.filter(item => item.partner_name === country);
      
      // Group by category
      const categoryBreakdown = [...new Set(countryFlows.map(item => getSubcategoryByHsCode(item.hs_code)))]
        .map(category => {
          const categoryValue = countryFlows
            .filter(item => getSubcategoryByHsCode(item.hs_code) === category)
            .reduce((sum, item) => sum + Number(item.import_value || 0), 0);
          
          return {
            category,
            value: categoryValue / 1000000,
            transactions: countryFlows.filter(item => getSubcategoryByHsCode(item.hs_code) === category).length
          };
        }).filter(cat => cat.value > 0).sort((a, b) => b.value - a.value);

      const totalValue = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0);

      return {
        country: country.replace('United States of America', 'USA'),
        totalValue,
        categories: categoryBreakdown,
        totalTransactions: countryFlows.length
      };
    }).filter(country => country.totalValue > 0).sort((a, b) => b.totalValue - a.totalValue);
  }, [canadaTradeFlows, getSubcategoryByHsCode]);

  // Analysis 3: Waterfall Flow for Selected Category
  const waterfallFlowData = useMemo(() => {
    const categoryFilter = selectedCategory === 'all' 
      ? canadaTradeFlows 
      : canadaTradeFlows.filter(item => getSubcategoryByHsCode(item.hs_code) === selectedCategory);

    // Create waterfall data showing Partner → Canada flow
    const waterfallSteps = [];
    let runningTotal = 0;

    // Add each country's contribution
    focusCountries.forEach((country, index) => {
      const countryValue = categoryFilter
        .filter(item => item.partner_name === country)
        .reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000;

      if (countryValue > 0) {
        waterfallSteps.push({
          name: country.replace('United States of America', 'USA'),
          value: countryValue,
          cumulative: runningTotal + countryValue,
          start: runningTotal,
          end: runningTotal + countryValue,
          type: 'source'
        });
        runningTotal += countryValue;
      }
    });

    // Add final total to Canada
    waterfallSteps.push({
      name: 'Total to Canada',
      value: runningTotal,
      cumulative: runningTotal,
      start: 0,
      end: runningTotal,
      type: 'total'
    });

    return waterfallSteps;
  }, [canadaTradeFlows, getSubcategoryByHsCode, selectedCategory]);

  // Analysis 4: Year-over-Year Flow Trends
  const yearlyFlowTrends = useMemo(() => {
    const years = [...new Set(canadaTradeFlows.map(item => item.year).filter(year => year !== null))].sort();
    
    return years.map(year => {
      const yearData = canadaTradeFlows.filter(item => item.year === year);
      
      const countryValues = focusCountries.map(country => {
        const value = yearData
          .filter(item => item.partner_name === country)
          .reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000;
        
        return {
          [`${country.replace('United States of America', 'USA')}`]: value
        };
      }).reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const totalValue = Object.values(countryValues).reduce((sum: number, val: any) => sum + val, 0);

      return {
        year,
        ...countryValues,
        total: totalValue
      };
    });
  }, [canadaTradeFlows]);

  const formatCurrency = (value: number) => `$${value.toFixed(1)}M`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const COLORS = ['#1F2937', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  const slides = [
    {
      title: "Trade Flow Waterfall by Equipment Category",
      subtitle: "Electrical equipment imports to Canada by category and source country",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={tradeFlowByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis label={{ value: 'Import Value to Canada (Millions USD)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value), 'Total Imports to Canada']}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar dataKey="totalValue" name="Total Imports to Canada" fill="#1F2937" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${tradeFlowByCategory[0]?.category || 'N/A'} leads Canada imports with ${formatCurrency(tradeFlowByCategory[0]?.totalValue || 0)}`,
        `${tradeFlowByCategory.length} equipment categories imported to Canada from focus countries`,
        `Total electrical equipment imports to Canada: ${formatCurrency(tradeFlowByCategory.reduce((sum, cat) => sum + cat.totalValue, 0))}`
      ]
    },
    {
      title: "Country-to-Canada Flow Analysis",
      subtitle: "Breakdown of electrical equipment flows from each focus country to Canada",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={countryFlowAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis label={{ value: 'Import Value to Canada (Millions USD)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: any) => [formatCurrency(value), 'Total Imports to Canada']}
              labelFormatter={(label) => `From: ${label}`}
            />
            <Legend />
            <Bar dataKey="totalValue" name="Total Imports to Canada" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${countryFlowAnalysis[0]?.country || 'N/A'} is Canada's largest electrical equipment source with ${formatCurrency(countryFlowAnalysis[0]?.totalValue || 0)}`,
        `${countryFlowAnalysis.reduce((sum, country) => sum + country.totalTransactions, 0)} total trade transactions to Canada`,
        `Average import value per country: ${formatCurrency(countryFlowAnalysis.reduce((sum, country) => sum + country.totalValue, 0) / countryFlowAnalysis.length)}`
      ]
    },
    {
      title: "Waterfall Flow Analysis",
      subtitle: "Step-by-step flow visualization showing cumulative imports to Canada",
      filterComponent: (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Equipment Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {[...new Set(canadaTradeFlows.map(item => getSubcategoryByHsCode(item.hs_code)))].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      ),
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={waterfallFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis label={{ value: 'Cumulative Import Value (Millions USD)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                formatCurrency(value), 
                name === 'cumulative' ? 'Cumulative Value' : 'Individual Contribution'
              ]}
            />
            <Legend />
            <Bar dataKey="value" name="Individual Contribution" fill="#10B981" />
            <Bar dataKey="cumulative" name="Cumulative Value" fill="#F59E0B" fillOpacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `Selected category: ${selectedCategory === 'all' ? 'All Equipment' : selectedCategory}`,
        `Total flow to Canada: ${formatCurrency(waterfallFlowData[waterfallFlowData.length - 1]?.value || 0)}`,
        `Largest single source: ${waterfallFlowData.find(d => d.type === 'source' && d.value === Math.max(...waterfallFlowData.filter(x => x.type === 'source').map(x => x.value)))?.name || 'N/A'}`
      ]
    },
    {
      title: "Year-over-Year Flow Trends",
      subtitle: "Historical trends of electrical equipment imports to Canada by source country",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={yearlyFlowTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Import Value to Canada (Millions USD)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any) => [formatCurrency(value), 'Import Value']} />
            <Legend />
            <Area type="monotone" dataKey="total" name="Total Imports" fill="#14B8A6" fillOpacity={0.3} stroke="#14B8A6" />
            <Bar dataKey="USA" name="USA" fill="#1F2937" />
            <Bar dataKey="Germany" name="Germany" fill="#3B82F6" />
            <Bar dataKey="Japan" name="Japan" fill="#EF4444" />
            <Bar dataKey="India" name="India" fill="#F59E0B" />
          </ComposedChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${yearlyFlowTrends.length} years of trade flow data to Canada analyzed`,
        `Peak import year: ${yearlyFlowTrends.find(d => d.total === Math.max(...yearlyFlowTrends.map(x => x.total)))?.year || 'N/A'}`,
        `Latest year total: ${formatCurrency(yearlyFlowTrends[yearlyFlowTrends.length - 1]?.total || 0)}`
      ]
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const currentSlideData = slides[currentSlide];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trade flow analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Canada Trade Flow Analysis</h2>
        <p className="text-gray-600 mb-4">
          Waterfall analysis of electrical equipment trade flows from USA, Japan, India, and Germany to Canada
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-900">Source Countries</div>
            <div className="text-blue-700">{focusCountries.length}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-900">Equipment Categories</div>
            <div className="text-green-700">{tradeFlowByCategory.length}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-900">Total Transactions</div>
            <div className="text-purple-700">{canadaTradeFlows.length.toLocaleString()}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="font-semibold text-orange-900">Years Analyzed</div>
            <div className="text-orange-700">{yearlyFlowTrends.length}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="font-semibold text-red-900">Total Import Value</div>
            <div className="text-red-700">${(canadaTradeFlows.reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      </div>

      {/* Flow Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Flow Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Germany</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Japan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">India</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total to Canada</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tradeFlowByCategory.map((category) => (
                <tr key={category.category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category}
                  </td>
                  {focusCountries.map(country => {
                    const flow = category.flows.find(f => f.country === country.replace('United States of America', 'USA'));
                    return (
                      <td key={country} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flow ? formatCurrency(flow.value) : '-'}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(category.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Slides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentSlideData.title}</h3>
              <p className="text-gray-600 mt-1">{currentSlideData.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{currentSlide + 1} of {slides.length}</span>
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentSlideData.filterComponent}
          {currentSlideData.chart}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={prevSlide}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {currentSlideData.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Trade Flow Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• {countryFlowAnalysis[0]?.country || 'N/A'} dominates electrical equipment exports to Canada</li>
            <li>• {tradeFlowByCategory[0]?.category || 'N/A'} represents the largest import category</li>
            <li>• Waterfall analysis reveals cumulative flow patterns by source</li>
            <li>• Historical trends show evolving trade relationships with Canada</li>
          </ul>
          <ul className="space-y-2">
            <li>• Total import value: ${(canadaTradeFlows.reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000).toFixed(1)}M to Canada</li>
            <li>• {canadaTradeFlows.length} individual trade transactions analyzed</li>
            <li>• Multi-year data reveals seasonal and cyclical patterns</li>
            <li>• Source country diversification provides supply chain insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 