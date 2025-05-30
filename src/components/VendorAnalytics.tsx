import React from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorAnalytics: React.FC = () => {
  const { data } = useVendorRiskInventory();

  // Get unique vendors by vendor_number to avoid duplicates
  const uniqueVendors = data.reduce((acc, vendor) => {
    if (vendor.vendor_number && !acc.find(v => v.vendor_number === vendor.vendor_number)) {
      acc.push(vendor);
    }
    return acc;
  }, [] as typeof data);

  // Calculate key metrics using unique vendors
  const totalVendors = uniqueVendors.length;
  const duplicateCount = data.length - uniqueVendors.length;
  
  // Use risk_tolerance_category if available, otherwise calculate from lead time
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

  const countryDistribution = uniqueVendors.reduce((acc, vendor) => {
    const country = vendor.country_of_origin || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgLeadTime = uniqueVendors.reduce((sum, vendor) => {
    const leadTime = vendor.average_lead_time_days || 0;
    return sum + Number(leadTime);
  }, 0) / (uniqueVendors.length || 1);

  const totalSafetyStock = uniqueVendors.reduce((sum, vendor) => {
    const stock = vendor.safety_stock || 0;
    return sum + Number(stock);
  }, 0);

  const avgDaysOfSupply = uniqueVendors.reduce((sum, vendor) => {
    const daysOfSupply = vendor.days_of_supply_current || 0;
    return sum + Number(daysOfSupply);
  }, 0) / (uniqueVendors.length || 1);

  const totalAnnualSpend = uniqueVendors.reduce((sum, vendor) => {
    const spend = vendor.annual_spend || 0;
    return sum + Number(spend);
  }, 0);

  const categoryDistribution = uniqueVendors.reduce((acc, vendor) => {
    const category = vendor.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const portfolioDistribution = uniqueVendors.reduce((acc, vendor) => {
    const portfolio = vendor.portfolio || 'Unknown';
    acc[portfolio] = (acc[portfolio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const performanceDistribution = uniqueVendors.reduce((acc, vendor) => {
    const performance = vendor.vendor_performance || 'Unknown';
    acc[performance] = (acc[performance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top countries by vendor count
  const topCountries = Object.entries(countryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get top categories by vendor count
  const topCategories = Object.entries(categoryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get top portfolios by vendor count
  const topPortfolios = Object.entries(portfolioDistribution)
    .filter(([portfolio]) => portfolio !== 'Unknown')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Vendor Analytics</h2>
        <p className="text-gray-600">
          Comprehensive analysis of {totalVendors} unique vendors in the supply chain
          {duplicateCount > 0 && (
            <span className="text-orange-600 font-medium">
              {' '}({duplicateCount} duplicate vendor numbers detected)
            </span>
          )}
        </p>
      </div>

      {/* Data Quality Alert */}
      {duplicateCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900">Data Quality Notice</h3>
          <p className="text-sm text-orange-800 mt-1">
            {duplicateCount} duplicate vendor numbers found in {data.length} total records. 
            Metrics below reflect unique vendors only.
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Vendors</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalVendors}</p>
          <p className="mt-1 text-xs text-gray-600">Unique suppliers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Lead Time</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{avgLeadTime.toFixed(1)}</p>
          <p className="mt-1 text-xs text-gray-600">Days average</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Annual Spend</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalAnnualSpend > 0 ? `$${(totalAnnualSpend / 1000000).toFixed(1)}M` : 'N/A'}
          </p>
          <p className="mt-1 text-xs text-gray-600">Total vendor spend</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">High Risk Vendors</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{riskDistribution['High'] || 0}</p>
          <p className="mt-1 text-xs text-gray-600">Vendors with supply risk</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Risk Distribution</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendor Source Countries</h3>
          <div className="space-y-3">
            {topCountries.map(([country, count], index) => (
              <div key={country} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                  <span className="ml-2 text-sm text-gray-900">{country}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / totalVendors) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendor Categories</h3>
          <div className="space-y-3">
            {topCategories.map(([category, count], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                  <span className="ml-2 text-sm text-gray-900 truncate" title={category}>
                    {category.length > 20 ? category.substring(0, 20) + '...' : category}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / totalVendors) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Portfolio Distribution</h3>
          <div className="space-y-3">
            {topPortfolios.length > 0 ? (
              topPortfolios.map(([portfolio, count]) => (
                <div key={portfolio} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 truncate">{portfolio}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(count / totalVendors) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No portfolio data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Distribution */}
      {Object.keys(performanceDistribution).filter(p => p !== 'Unknown').length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(performanceDistribution)
              .filter(([performance]) => performance !== 'Unknown')
              .sort(([, a], [, b]) => b - a)
              .map(([performance, count]) => (
                <div key={performance} className="text-center">
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-500 capitalize">{performance}</div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${(count / totalVendors) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Vendor Supply Chain Insights</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• {((riskDistribution['High'] || 0) / totalVendors * 100).toFixed(1)}% of vendors are classified as high risk</li>
          <li>• Average vendor lead time is {avgLeadTime.toFixed(1)} days</li>
          <li>• Vendors are distributed across {Object.keys(countryDistribution).length} countries</li>
          <li>• {topCountries[0]?.[0] || 'N/A'} supplies the most vendors ({topCountries[0]?.[1] || 0})</li>
          {totalAnnualSpend > 0 && (
            <li>• Total annual procurement spend: ${(totalAnnualSpend / 1000000).toFixed(1)}M</li>
          )}
          {topCategories[0] && (
            <li>• {topCategories[0][0]} is the largest vendor category with {topCategories[0][1]} vendors</li>
          )}
          {duplicateCount > 0 && (
            <li>• Data quality issue: {duplicateCount} duplicate vendor numbers need cleanup</li>
          )}
        </ul>
      </div>
    </div>
  );
}; 