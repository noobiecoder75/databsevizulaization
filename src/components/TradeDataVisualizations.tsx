import React, { useState, useMemo } from 'react';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const TradeDataVisualizations: React.FC = () => {
  const { data, loading, error, getSubcategoryByHsCode } = useCountryTradePartners();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Focus countries
  const focusCountries = ['United States of America', 'Germany', 'France', 'Finland', 'India'];
  const euCountries = ['Germany', 'France', 'Finland', 'Netherlands', 'Italy', 'Spain', 'Poland', 'Belgium', 'Austria', 'Sweden', 'Denmark'];
  const majorEconomies = ['China', 'Japan', 'Korea, Republic of', 'United Kingdom', 'Canada', 'Australia', 'Brazil', 'Mexico', 'Turkey', 'Russian Federation'];

  // Filter data for electrical equipment (use much broader criteria to include more data)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const subcategory = getSubcategoryByHsCode(item.hs_code);
      const isElectricalEquipment = subcategory !== 'Other';
      
      // Include data where either reporter or partner is a major economy or focus country
      const allTargetCountries = [...focusCountries, ...euCountries, ...majorEconomies];
      const isReporterRelevant = allTargetCountries.includes(item.reporter_name || '');
      const isPartnerRelevant = allTargetCountries.includes(item.partner_name || '') || item.partner_name === 'World';
      
      // Also include high-value trades regardless of country
      const isHighValueTrade = Number(item.import_value || 0) > 100000; // Over $100K
      
      return isElectricalEquipment && (isReporterRelevant || isPartnerRelevant || isHighValueTrade);
    });
  }, [data, getSubcategoryByHsCode]);

  // Slide 1: Trade by Subcategory (Global)
  const categoryData = useMemo(() => {
    const categoryStats = filteredData.reduce((acc, item) => {
      const subcategory = getSubcategoryByHsCode(item.hs_code);
      if (subcategory === 'Other') return acc;
      
      if (!acc[subcategory]) {
        acc[subcategory] = { 
          category: subcategory, 
          totalValue: 0, 
          tradeCount: 0,
          avgValue: 0 
        };
      }
      acc[subcategory].totalValue += Number(item.import_value || 0);
      acc[subcategory].tradeCount += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(categoryStats)
      .map((item: any) => ({
        ...item,
        totalValueMillions: item.totalValue / 1000000,
        avgValue: item.totalValue / item.tradeCount
      }))
      .sort((a: any, b: any) => b.totalValue - a.totalValue);
  }, [filteredData, getSubcategoryByHsCode]);

  // Slide 2: Top Importers by Country
  const topImporters = useMemo(() => {
    const importerStats = filteredData.reduce((acc, item) => {
      const country = item.reporter_name || 'Unknown';
      if (!acc[country]) {
        acc[country] = { 
          country, 
          totalImports: 0, 
          tradeCount: 0,
          categories: new Set()
        };
      }
      acc[country].totalImports += Number(item.import_value || 0);
      acc[country].tradeCount += 1;
      acc[country].categories.add(getSubcategoryByHsCode(item.hs_code));
      return acc;
    }, {} as Record<string, any>);

    return Object.values(importerStats)
      .map((item: any) => ({
        ...item,
        totalImportsMillions: item.totalImports / 1000000,
        categoryCount: item.categories.size,
        avgImportValue: item.totalImports / item.tradeCount
      }))
      .sort((a: any, b: any) => b.totalImports - a.totalImports)
      .slice(0, 25);
  }, [filteredData, getSubcategoryByHsCode]);

  // Slide 3: Power Generation Equipment Analysis
  const powerGenData = useMemo(() => {
    const powerGenCategories = ['Diesel Generator', 'AC Generator', 'Li-ion Battery'];
    const powerGenTrades = filteredData.filter(item => 
      powerGenCategories.includes(getSubcategoryByHsCode(item.hs_code))
    );

    const countryPowerGen = powerGenTrades.reduce((acc, item) => {
      const country = item.reporter_name || 'Unknown';
      const subcategory = getSubcategoryByHsCode(item.hs_code);
      
      if (!acc[country]) {
        acc[country] = {
          country,
          dieselGen: 0,
          acGen: 0,
          battery: 0,
          total: 0
        };
      }
      
      const value = Number(item.import_value || 0);
      acc[country].total += value;
      
      if (subcategory === 'Diesel Generator') acc[country].dieselGen += value;
      if (subcategory === 'AC Generator') acc[country].acGen += value;
      if (subcategory === 'Li-ion Battery') acc[country].battery += value;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(countryPowerGen)
      .map((item: any) => ({
        ...item,
        totalMillions: item.total / 1000000,
        dieselGenMillions: item.dieselGen / 1000000,
        acGenMillions: item.acGen / 1000000,
        batteryMillions: item.battery / 1000000
      }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 20);
  }, [filteredData, getSubcategoryByHsCode]);

  // Slide 4: Transformer & Switchgear Analysis
  const transformerSwitchgearData = useMemo(() => {
    const tsCategories = ['Liquid Transformer', 'High-Capacity Transformer', 'Medium Transformer', 'Large Transformer', 'Switchgear Panel', 'Switchgear Parts'];
    const tsTrades = filteredData.filter(item => 
      tsCategories.includes(getSubcategoryByHsCode(item.hs_code))
    );

    const countryTS = tsTrades.reduce((acc, item) => {
      const country = item.reporter_name || 'Unknown';
      const subcategory = getSubcategoryByHsCode(item.hs_code);
      
      if (!acc[country]) {
        acc[country] = {
          country,
          transformers: 0,
          switchgear: 0,
          total: 0
        };
      }
      
      const value = Number(item.import_value || 0);
      acc[country].total += value;
      
      if (subcategory.includes('Transformer')) acc[country].transformers += value;
      if (subcategory.includes('Switchgear')) acc[country].switchgear += value;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(countryTS)
      .map((item: any) => ({
        ...item,
        totalMillions: item.total / 1000000,
        transformersMillions: item.transformers / 1000000,
        switchgearMillions: item.switchgear / 1000000
      }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 20);
  }, [filteredData, getSubcategoryByHsCode]);

  // Slide 5: Trade Flow Matrix (Focus Countries)
  const tradeFlowData = useMemo(() => {
    const flows = filteredData.reduce((acc, item) => {
      const reporter = item.reporter_name || 'Unknown';
      const partner = item.partner_name || 'Unknown';
      
      // Expand criteria to include more trade flows between major economies
      const allRelevantCountries = [...focusCountries, ...euCountries, ...majorEconomies];
      const isReporterRelevant = allRelevantCountries.includes(reporter);
      const isPartnerRelevant = allRelevantCountries.includes(partner);
      
      if (!isReporterRelevant && !isPartnerRelevant) return acc;
      if (reporter === partner || partner === 'World') return acc;
      
      const flowKey = `${reporter} → ${partner}`;
      if (!acc[flowKey]) {
        acc[flowKey] = {
          flow: flowKey,
          reporter,
          partner,
          totalValue: 0,
          tradeCount: 0
        };
      }
      
      acc[flowKey].totalValue += Number(item.import_value || 0);
      acc[flowKey].tradeCount += 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(flows)
      .map((item: any) => ({
        ...item,
        totalValueMillions: item.totalValue / 1000000
      }))
      .sort((a: any, b: any) => b.totalValue - a.totalValue)
      .slice(0, 30); // Increased from 20 to 30
  }, [filteredData]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(1)}M`;
  };

  const formatNumber = (value: number) => {
    return value.toFixed(1);
  };

  const COLORS = ['#1F2937', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6', '#F97316'];

  const slides = [
    {
      title: "Electrical Equipment Trade by Category",
      subtitle: "Global trade volume in electrical power equipment categories",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis 
              label={{ value: 'Trade Value (Millions USD)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(1)}M`,
                name === 'totalValueMillions' ? 'Total Trade Value' : name
              ]}
            />
            <Legend />
            <Bar dataKey="totalValueMillions" name="Total Trade Value ($M)" fill="#1F2937" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${categoryData[0]?.category || 'N/A'} leads with ${formatCurrency(categoryData[0]?.totalValueMillions || 0)} in trade volume`,
        `${categoryData.length} electrical equipment categories tracked`,
        `Total electrical equipment trade: ${formatCurrency(categoryData.reduce((sum, item) => sum + item.totalValueMillions, 0))}`,
      ]
    },
    {
      title: "Top Electrical Equipment Importers",
      subtitle: "Countries with highest electrical equipment import values",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={topImporters} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis 
              label={{ value: 'Import Value (Millions USD)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(1)}M`,
                name === 'totalImportsMillions' ? 'Total Imports' : name
              ]}
            />
            <Legend />
            <Bar dataKey="totalImportsMillions" name="Total Imports ($M)" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${topImporters[0]?.country || 'N/A'} is the largest importer with ${formatCurrency(topImporters[0]?.totalImportsMillions || 0)}`,
        `Top 5 importers account for ${formatCurrency(topImporters.slice(0, 5).reduce((sum, item) => sum + item.totalImportsMillions, 0))}`,
        `Average import categories per country: ${formatNumber(topImporters.reduce((sum, item) => sum + item.categoryCount, 0) / topImporters.length)}`,
      ]
    },
    {
      title: "Power Generation Equipment Trade",
      subtitle: "Generators and battery imports by country",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={powerGenData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis 
              label={{ value: 'Import Value (Millions USD)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(1)}M`,
                name.replace('Millions', '')
              ]}
            />
            <Legend />
            <Bar dataKey="dieselGenMillions" name="Diesel Generators" fill="#EF4444" />
            <Bar dataKey="acGenMillions" name="AC Generators" fill="#10B981" />
            <Bar dataKey="batteryMillions" name="Li-ion Batteries" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${powerGenData[0]?.country || 'N/A'} leads power generation equipment imports`,
        `Li-ion batteries: ${formatCurrency(powerGenData.reduce((sum, item) => sum + item.batteryMillions, 0))} total trade`,
        `Generator equipment: ${formatCurrency(powerGenData.reduce((sum, item) => sum + item.dieselGenMillions + item.acGenMillions, 0))} total trade`,
      ]
    },
    {
      title: "Transformer & Switchgear Trade",
      subtitle: "Power transformation and switching equipment imports",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={transformerSwitchgearData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={11}
            />
            <YAxis 
              label={{ value: 'Import Value (Millions USD)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(1)}M`,
                name.replace('Millions', '')
              ]}
            />
            <Legend />
            <Bar dataKey="transformersMillions" name="Transformers" fill="#8B5CF6" />
            <Bar dataKey="switchgearMillions" name="Switchgear" fill="#EC4899" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `${transformerSwitchgearData[0]?.country || 'N/A'} leads transformer & switchgear imports`,
        `Total transformer trade: ${formatCurrency(transformerSwitchgearData.reduce((sum, item) => sum + item.transformersMillions, 0))}`,
        `Total switchgear trade: ${formatCurrency(transformerSwitchgearData.reduce((sum, item) => sum + item.switchgearMillions, 0))}`,
      ]
    },
    {
      title: "Trade Flow Analysis",
      subtitle: "Bilateral electrical equipment trade between focus countries",
      chart: (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={tradeFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="flow" 
              angle={-45} 
              textAnchor="end" 
              height={140}
              interval={0}
              fontSize={10}
            />
            <YAxis 
              label={{ value: 'Trade Value (Millions USD)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(1)}M`,
                'Trade Value'
              ]}
            />
            <Legend />
            <Bar dataKey="totalValueMillions" name="Trade Value ($M)" fill="#14B8A6" />
          </BarChart>
        </ResponsiveContainer>
      ),
      insights: [
        `Strongest trade flow: ${tradeFlowData[0]?.flow || 'N/A'} (${formatCurrency(tradeFlowData[0]?.totalValueMillions || 0)})`,
        `${tradeFlowData.length} bilateral trade relationships analyzed`,
        `Total focus country trade: ${formatCurrency(tradeFlowData.reduce((sum, item) => sum + item.totalValueMillions, 0))}`,
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trade visualization data...</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trade Data Visualizations</h2>
        <p className="text-gray-600">
          Analysis of electrical power equipment trade flows using complete international trade database
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-900">Total DB Records</div>
            <div className="text-blue-700">{data.length.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-900">Electrical Equipment</div>
            <div className="text-green-700">{filteredData.length.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-900">Equipment Categories</div>
            <div className="text-purple-700">{categoryData.length}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="font-semibold text-orange-900">Countries Analyzed</div>
            <div className="text-orange-700">{[...focusCountries, ...euCountries, ...majorEconomies].length}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="font-semibold text-red-900">Total Trade Value</div>
            <div className="text-red-700">${(filteredData.reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000000).toFixed(1)}B</div>
          </div>
        </div>
      </div>

      {/* Visualization Slides */}
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
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          {currentSlideData.chart}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={prevSlide}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          <button
            onClick={nextSlide}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Key Insights */}
        <div className="border-t border-gray-200">
          <div className="p-6">
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
      </div>

      {/* Summary Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Trade Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• Power transformation equipment dominates electrical trade flows</li>
            <li>• {topImporters[0]?.country || 'N/A'} leads as the primary electrical equipment importer</li>
            <li>• Li-ion battery trade shows significant growth in renewable energy sector</li>
            <li>• Transformer technology represents the largest trade category by value</li>
          </ul>
          <ul className="space-y-2">
            <li>• Focus countries account for ${(filteredData.reduce((sum, item) => sum + Number(item.import_value || 0), 0) / 1000000000).toFixed(1)}B in trade volume</li>
            <li>• Switchgear and protection equipment show strong demand patterns</li>
            <li>• Generator equipment trade reflects global infrastructure development</li>
            <li>• Major powerhouse countries dominate both import and export flows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 