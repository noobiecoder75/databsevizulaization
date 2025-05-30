import React from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorAnalytics: React.FC = () => {
  const { data } = useVendorRiskInventory();

  // Filter for equipment vendors only - same logic as visualizations
  const excludeKeywords = [
    'services',
    'service',
    'consulting',
    'management',
    'construction equipment',
    'engineering design',
    'engineering specialty',
    'technical & specialized',
    'corporate',
    'environment',
    'field waste',
    'marketing',
    'legal',
    'training',
    'contingent labour',
    'resource augmentation',
    'properties',
    'facilities',
    'communication',
    'protection & control',
    'security & safety',
    'installation',
    'maintenance',
    'general construction',
    'line services',
    'civil underground',
    'vegetation',
    'traffic',
    'site safety'
  ];

  const equipmentData = data.filter(vendor => {
    const category = vendor.fuzzy_matched_category?.toLowerCase() || '';
    
    // Exclude if category contains any service-related keywords
    const isService = excludeKeywords.some(keyword => category.includes(keyword));
    if (isService) return false;
    
    // Include if category contains equipment keywords
    const isEquipment = category.includes('equipment') ||
                       category.includes('transformer') ||
                       category.includes('electrical') ||
                       category.includes('generator') ||
                       category.includes('switchgear') ||
                       category.includes('wire') ||
                       category.includes('cable') ||
                       category.includes('fleet') ||
                       category.includes('vehicle') ||
                       category.includes('turbine') ||
                       category.includes('crane') ||
                       category.includes('auxiliary');
    
    return isEquipment;
  });

  // Calculate key metrics using filtered equipment data
  const totalVendors = equipmentData.length;
  
  const riskDistribution = equipmentData.reduce((acc, vendor) => {
    const risk = vendor.risk_tolerance_x || 'Unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryDistribution = equipmentData.reduce((acc, vendor) => {
    const country = vendor.country_of_origin_x || vendor.country_of_origin || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgLeadTime = equipmentData.reduce((sum, vendor) => {
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    return sum + Number(leadTime);
  }, 0) / (equipmentData.length || 1);

  const totalSafetyStock = equipmentData.reduce((sum, vendor) => {
    const stock = vendor.safety_stock || vendor.safety_stock_y || 0;
    return sum + Number(stock);
  }, 0);

  const totalAnnualSpend = equipmentData.reduce((sum, vendor) => {
    const spend = vendor.annual_spend || 0;
    return sum + Number(spend);
  }, 0);

  const categoryDistribution = equipmentData.reduce((acc, vendor) => {
    const category = vendor.fuzzy_matched_category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const portfolioDistribution = equipmentData.reduce((acc, vendor) => {
    const portfolio = vendor.portfolio || 'Unknown';
    acc[portfolio] = (acc[portfolio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const performanceDistribution = equipmentData.reduce((acc, vendor) => {
    const performance = vendor.vendor_performance || 'Unknown';
    acc[performance] = (acc[performance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top countries by vendor count
  const topCountries = Object.entries(countryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get top categories by vendor count (using fuzzy_matched_category)
  const topCategories = Object.entries(categoryDistribution)
    .filter(([category]) => category !== 'Uncategorized')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get top portfolios by vendor count
  const topPortfolios = Object.entries(portfolioDistribution)
    .filter(([portfolio]) => portfolio !== 'Unknown')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Calculate performance stats
  const performanceStats = Object.entries(performanceDistribution)
    .filter(([performance]) => performance !== 'Unknown')
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Equipment Vendors</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalVendors}</p>
          <p className="mt-1 text-xs text-gray-600">Physical equipment suppliers only</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Equipment Lead Time</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{avgLeadTime.toFixed(1)} days</p>
          <p className="mt-1 text-xs text-gray-600">Procurement timeline</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Equipment Annual Spend</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalAnnualSpend > 0 ? `$${(totalAnnualSpend / 1000000).toFixed(1)}M` : 'N/A'}
          </p>
          <p className="mt-1 text-xs text-gray-600">Total equipment procurement</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">High Risk Equipment</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{riskDistribution['High'] || 0}</p>
          <p className="mt-1 text-xs text-gray-600">Vendors with supply risk</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Vendor Risk Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{riskDistribution['Low'] || 0}</div>
            <div className="text-sm text-gray-500">Low Risk</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${((riskDistribution['Low'] || 0) / totalVendors) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{riskDistribution['Medium'] || 0}</div>
            <div className="text-sm text-gray-500">Medium Risk</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${((riskDistribution['Medium'] || 0) / totalVendors) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{riskDistribution['High'] || 0}</div>
            <div className="text-sm text-gray-500">High Risk</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${((riskDistribution['High'] || 0) / totalVendors) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Country, Category, and Portfolio Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment by Country</h3>
          <div className="space-y-3">
            {topCountries.map(([country, count]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{country}</span>
                <span className="text-sm text-gray-500">{count} equipment vendors</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Categories</h3>
          <div className="space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate pr-2" title={category}>{category}</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{count} vendors</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No category data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Portfolio</h3>
          <div className="space-y-3">
            {topPortfolios.length > 0 ? (
              topPortfolios.map(([portfolio, count]) => (
                <div key={portfolio} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{portfolio}</span>
                  <span className="text-sm text-gray-500">{count} vendors</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No portfolio data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      {performanceStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Vendor Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceStats.map(([performance, count]) => (
              <div key={performance} className="text-center">
                <div className="text-xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{performance}</div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      performance.toLowerCase().includes('excellent') ? 'bg-green-500' :
                      performance.toLowerCase().includes('good') ? 'bg-blue-500' :
                      performance.toLowerCase().includes('average') ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${(count / totalVendors) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Key Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Equipment Supply Chain Insights</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• {((riskDistribution['High'] || 0) / totalVendors * 100).toFixed(1)}% of equipment vendors are classified as high risk</li>
          <li>• Average equipment lead time is {avgLeadTime.toFixed(1)} days</li>
          <li>• Equipment vendors are distributed across {Object.keys(countryDistribution).length} countries</li>
          <li>• {topCountries[0]?.[0] || 'N/A'} supplies the most equipment vendors ({topCountries[0]?.[1] || 0})</li>
          {totalAnnualSpend > 0 && (
            <li>• Total annual equipment procurement spend: ${(totalAnnualSpend / 1000000).toFixed(1)}M</li>
          )}
          {topCategories[0] && (
            <li>• {topCategories[0][0]} is the largest equipment category with {topCategories[0][1]} vendors</li>
          )}
        </ul>
      </div>
    </div>
  );
}; 