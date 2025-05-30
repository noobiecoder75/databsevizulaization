import React, { useState, useMemo } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorRiskInventory: React.FC = () => {
  const { data, loading, error } = useVendorRiskInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Filter for equipment vendors only - same logic as analytics
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

  const filteredData = useMemo(() => {
    return equipmentData.filter(vendor => {
      const matchesSearch = 
        vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendor_number_clean?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.fuzzy_matched_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.portfolio?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = 
        riskFilter === 'all' || 
        vendor.risk_tolerance_x === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [equipmentData, searchTerm, riskFilter]);

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading equipment vendor data...</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Vendor Risk Inventory</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search equipment vendors, categories, or portfolios..."
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
          Showing {filteredData.length} of {equipmentData.length} equipment vendors
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Annual Spend
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {vendor.vendor_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {vendor.vendor_number_clean || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vendor.fuzzy_matched_category || 'Uncategorized'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(vendor.risk_tolerance_x)}`}>
                    {vendor.risk_tolerance_x || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDecimal(vendor.avg_lead_time_days_x || vendor.avg_lead_time_days)} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.vendor_performance || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.annual_spend ? `$${formatNumber(vendor.annual_spend)}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.portfolio || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.country_of_origin_x || vendor.country_of_origin || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No equipment vendors found matching your criteria
        </div>
      )}
    </div>
  );
}; 