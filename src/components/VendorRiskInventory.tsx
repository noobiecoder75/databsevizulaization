import React, { useState, useMemo } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorRiskInventory: React.FC = () => {
  const { data, loading, error } = useVendorRiskInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Get unique vendors by vendor_number, prioritizing highest risk level
  const uniqueVendors = data.reduce((acc, vendor) => {
    if (!vendor.vendor_number) return acc;
    
    const existingVendorIndex = acc.findIndex(v => v.vendor_number === vendor.vendor_number);
    
    if (existingVendorIndex === -1) {
      // No duplicate found, add the vendor
      acc.push(vendor);
    } else {
      // Duplicate found, keep the one with higher risk
      const existingRisk = acc[existingVendorIndex].risk_tolerance_category || 'Unknown';
      const currentRisk = vendor.risk_tolerance_category || 'Unknown';
      
      // Risk priority: Low tolerance (High risk) > Med tolerance (Medium risk) > High tolerance (Low risk) > Unknown
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
        // Replace with higher risk vendor
        acc[existingVendorIndex] = vendor;
      }
      // If current risk is lower or equal, keep existing vendor
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

      // Map filter selections to database tolerance values
      const tolerance = vendor.risk_tolerance_category || 'Unknown';
      
      const matchesRisk = 
        riskFilter === 'all' || 
        (riskFilter === 'High' && tolerance === 'Low') ||     // "Low Risk Tolerance" maps to Low tolerance
        (riskFilter === 'Medium' && (tolerance === 'Med' || tolerance === 'Medium')) ||
        (riskFilter === 'Low' && tolerance === 'High');      // "High Risk Tolerance" maps to High tolerance

      return matchesSearch && matchesRisk;
    });
  }, [uniqueVendors, searchTerm, riskFilter]);

  const getRiskColor = (vendor: any) => {
    const riskLevel = vendor.risk_tolerance_category || 'Unknown';
    
    // Low risk tolerance = High risk to us (Red)
    if (riskLevel === 'Low') return 'bg-red-100 text-red-800';
    // Medium risk tolerance = Medium risk to us (Yellow)
    if (riskLevel === 'Medium' || riskLevel === 'Med') return 'bg-yellow-100 text-yellow-800';
    // High risk tolerance = Low risk to us (Green)
    if (riskLevel === 'High') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRiskLevel = (vendor: any) => {
    const tolerance = vendor.risk_tolerance_category || 'Unknown';
    // Convert tolerance to clear risk level labels
    if (tolerance === 'Low') return 'Low Risk Tolerance';
    if (tolerance === 'Med' || tolerance === 'Medium') return 'Medium Risk Tolerance';
    if (tolerance === 'High') return 'High Risk Tolerance';
    return 'Unknown';
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
              <br />
              <span className="text-xs mt-1 block">
                For vendors with multiple risk levels, displaying the highest risk classification.
              </span>
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
              <option value="all">All Risk Tolerance Levels</option>
              <option value="High">Low Risk Tolerance</option>
              <option value="Medium">Medium Risk Tolerance</option>
              <option value="Low">High Risk Tolerance</option>
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
                Risk Tolerance Level
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