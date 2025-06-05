import React, { useState, useMemo } from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const VendorRiskInventory: React.FC = () => {
  const { data, loading, error } = useVendorRiskInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

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

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, riskFilter, pageSize]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Pagination helper functions
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

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

        {/* Filters and Page Size */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search vendor numbers, categories, countries, portfolios, or performance..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risk Tolerance Levels</option>
              <option value="High">Low Risk Tolerance</option>
              <option value="Medium">Medium Risk Tolerance</option>
              <option value="Low">High Risk Tolerance</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} vendors
            {filteredData.length !== uniqueVendors.length && ` (filtered from ${uniqueVendors.length} total)`}
          </p>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>
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
            {paginatedData.map((vendor) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => goToPage(pageNum as number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No vendors found matching your criteria
        </div>
      )}
    </div>
  );
}; 