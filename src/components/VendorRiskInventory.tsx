import React, { useState, useMemo } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorRiskInventory: React.FC = () => {
  const { data, loading, error } = useVendorRiskInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Get unique vendors by vendor_number to avoid duplicates
  const uniqueVendors = data.reduce((acc, vendor) => {
    if (vendor.vendor_number && !acc.find(v => v.vendor_number === vendor.vendor_number)) {
      acc.push(vendor);
    }
    return acc;
  }, [] as typeof data);

  const filteredData = useMemo(() => {
    return uniqueVendors.filter(vendor => {
      const matchesSearch = 
        vendor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.country_of_origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.portfolio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendor_performance?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendor_number?.toString().includes(searchTerm);

      // Use risk_tolerance_category if available, otherwise calculate from lead time
      let riskLevel = vendor.risk_tolerance_category || 'Unknown';
      if (riskLevel === 'Unknown' || !riskLevel) {
        const leadTime = vendor.average_lead_time_days || 0;
        if (leadTime > 30) riskLevel = 'High';
        else if (leadTime > 15) riskLevel = 'Medium';
        else riskLevel = 'Low';
      }

      const matchesRisk = 
        riskFilter === 'all' || 
        riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [uniqueVendors, searchTerm, riskFilter]);

  const getRiskColor = (vendor: any) => {
    let riskLevel = vendor.risk_tolerance_category || 'Unknown';
    if (riskLevel === 'Unknown' || !riskLevel) {
      const leadTime = vendor.average_lead_time_days || 0;
      if (leadTime > 30) riskLevel = 'High';
      else if (leadTime > 15) riskLevel = 'Medium';
      else riskLevel = 'Low';
    }
    
    if (riskLevel === 'High') return 'bg-red-100 text-red-800';
    if (riskLevel === 'Medium') return 'bg-yellow-100 text-yellow-800';
    if (riskLevel === 'Low') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRiskLevel = (vendor: any) => {
    let riskLevel = vendor.risk_tolerance_category || 'Unknown';
    if (riskLevel === 'Unknown' || !riskLevel) {
      const leadTime = vendor.average_lead_time_days || 0;
      if (leadTime > 30) riskLevel = 'High';
      else if (leadTime > 15) riskLevel = 'Medium';
      else riskLevel = 'Low';
    }
    return riskLevel;
  };

  const formatNumber = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toLocaleString();
  };

  const formatDecimal = (value: any, decimals: number = 1) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(decimals);
  };

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `$${num.toLocaleString()}`;
  };

  const duplicateCount = data.length - uniqueVendors.length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor data...</p>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vendor Risk Inventory</h2>
        
        {/* Data Quality Alert */}
        {duplicateCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-orange-800">
              <strong>Data Quality Notice:</strong> {duplicateCount} duplicate vendor numbers detected. 
              Showing {uniqueVendors.length} unique vendors from {data.length} total records.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search vendor numbers, categories, countries, portfolios, or performance..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-600">
          Showing {filteredData.length} of {uniqueVendors.length} unique vendors
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Time (Days)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Annual Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfolio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vendor.vendor_number || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vendor.category || 'Uncategorized'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(vendor)}`}>
                    {getRiskLevel(vendor)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDecimal(vendor.average_lead_time_days)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(vendor.annual_spend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.vendor_performance || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.portfolio || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.country_of_origin || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No vendors found matching your criteria
        </div>
      )}
    </div>
  );
}; 