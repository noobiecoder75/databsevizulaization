import React, { useState, useMemo } from 'react';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';

export const TradeDataTable: React.FC = () => {
  const { data, loading, error, getSubcategoryByHsCode, filterByYear, searchByReporter, fetchData } = useCountryTradePartners();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('all');
  const [reporterCountryFilter, setReporterCountryFilter] = useState<string>('all');
  const [partnerCountryFilter, setPartnerCountryFilter] = useState<string>('all');
  const [minImportValue, setMinImportValue] = useState<string>('');
  const [maxImportValue, setMaxImportValue] = useState<string>('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const years = [...new Set(data.map(item => item.year).filter(year => year !== null))].sort((a, b) => (b as number) - (a as number));
    const subcategories = [...new Set(data.map(item => getSubcategoryByHsCode(item.hs_code)))].sort();
    const reporterCountries = [...new Set(data.map(item => item.reporter_name).filter(country => country !== null))].sort();
    const partnerCountries = [...new Set(data.map(item => item.partner_name).filter(country => country !== null))].sort();
    
    return {
      years,
      subcategories,
      reporterCountries: reporterCountries.slice(0, 100), // Limit to first 100 for performance
      partnerCountries: partnerCountries.slice(0, 100)
    };
  }, [data, getSubcategoryByHsCode]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = 
        item.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hs_code?.includes(searchTerm) ||
        getSubcategoryByHsCode(item.hs_code).toLowerCase().includes(searchTerm.toLowerCase());

      // Year filter
      const matchesYear = 
        yearFilter === 'all' || 
        item.year?.toString() === yearFilter;

      // Subcategory filter
      const matchesSubcategory = 
        subcategoryFilter === 'all' || 
        getSubcategoryByHsCode(item.hs_code) === subcategoryFilter;

      // Reporter country filter
      const matchesReporter = 
        reporterCountryFilter === 'all' || 
        item.reporter_name === reporterCountryFilter;

      // Partner country filter
      const matchesPartner = 
        partnerCountryFilter === 'all' || 
        item.partner_name === partnerCountryFilter;

      // Import value range filter
      const importValue = Number(item.import_value || 0);
      const matchesMinValue = minImportValue === '' || importValue >= Number(minImportValue);
      const matchesMaxValue = maxImportValue === '' || importValue <= Number(maxImportValue);

      return matchesSearch && matchesYear && matchesSubcategory && 
             matchesReporter && matchesPartner && matchesMinValue && matchesMaxValue;
    });
  }, [data, searchTerm, yearFilter, subcategoryFilter, reporterCountryFilter, 
      partnerCountryFilter, minImportValue, maxImportValue, getSubcategoryByHsCode]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, subcategoryFilter, reporterCountryFilter, partnerCountryFilter, minImportValue, maxImportValue]);

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `$${num.toLocaleString()}`;
  };

  const formatNumber = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toLocaleString();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setYearFilter('all');
    setSubcategoryFilter('all');
    setReporterCountryFilter('all');
    setPartnerCountryFilter('all');
    setMinImportValue('');
    setMaxImportValue('');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trade data...</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">International Trade Data</h2>
        
        {/* Data Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Complete Dataset:</strong> All international trade flows by product category (HS codes) between countries. 
            Total records: {data.length.toLocaleString()} | 
            Filtered records: {filteredData.length.toLocaleString()}
          </p>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4 mb-4">
          {/* Search and Clear */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search countries, HS codes, or subcategories..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year?.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {filterOptions.subcategories.map(subcategory => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Reporter Country</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={reporterCountryFilter}
                onChange={(e) => setReporterCountryFilter(e.target.value)}
              >
                <option value="all">All Countries</option>
                {filterOptions.reporterCountries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Partner Country</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={partnerCountryFilter}
                onChange={(e) => setPartnerCountryFilter(e.target.value)}
              >
                <option value="all">All Countries</option>
                {filterOptions.partnerCountries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Row 2 - Import Value Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Import Value (USD)</label>
              <input
                type="number"
                placeholder="e.g., 1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={minImportValue}
                onChange={(e) => setMinImportValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Import Value (USD)</label>
              <input
                type="number"
                placeholder="e.g., 1000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={maxImportValue}
                onChange={(e) => setMaxImportValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Items per Page</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
                <option value={200}>200 per page</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length.toLocaleString()} filtered records
            ({data.length.toLocaleString()} total)
          </div>
          <div>
            Page {currentPage} of {totalPages.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HS Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Import Value (USD)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {trade.reporter_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {trade.partner_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {trade.hs_code || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    getSubcategoryByHsCode(trade.hs_code) === 'Other' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getSubcategoryByHsCode(trade.hs_code)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {trade.year || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(trade.import_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            {/* Mobile pagination */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
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
                <span className="font-medium">{filteredData.length.toLocaleString()}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* First page */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                
                {/* Previous page */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next page */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>

                {/* Last page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No trade records found matching your criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}; 