import React from 'react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

export const VendorVisualizations: React.FC = () => {
  const { data } = useVendorRiskInventory();

  // Filter for equipment vendors only - EXCLUDE all services and construction equipment
  const equipmentCategories = [
    'Auxiliary Electrical Equipment',
    'Major Generation Powerhouse Equipment', 
    'Other Generation Station Equipment',
    'Other Generators – Gas, Diesel & Service',
    'Instrument Transformers',
    'Metering Transformers',
    'Distribution Switchgear',
    'OEM Equipment',
    'Generators',
    'Governing Systems',
    'Excitation Systems',
    'Fixed Cranes',
    'Hydro Turbine Systems',
    'Distribution Transformers',
    'Wire & Cable',
    'Conductor Support Structures',
    'Electrical Components',
    'Fleet',
    'Aviation Services',
    'Electric Vehicle Equipment & Services'
  ];

  // Exclude categories with these keywords
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
    
    // Include if category matches equipment categories or contains equipment keywords
    const isEquipment = equipmentCategories.some(cat => category.includes(cat.toLowerCase())) ||
                       category.includes('equipment') ||
                       category.includes('transformer') ||
                       category.includes('electrical') ||
                       category.includes('generator') ||
                       category.includes('switchgear') ||
                       category.includes('wire') ||
                       category.includes('cable') ||
                       category.includes('fleet') ||
                       category.includes('vehicle');
    
    return isEquipment;
  });

  // Lead Time Analysis
  const leadTimeAnalysis = equipmentData.reduce((acc, vendor) => {
    const category = vendor.fuzzy_matched_category || 'Other';
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    const stdDev = vendor.std_dev_lead_time_days_x || vendor.std_dev_lead_time_days || 0;
    
    if (!acc[category]) {
      acc[category] = { totalLeadTime: 0, count: 0, totalStdDev: 0, vendors: [] };
    }
    acc[category].totalLeadTime += Number(leadTime);
    acc[category].totalStdDev += Number(stdDev);
    acc[category].count += 1;
    acc[category].vendors.push(vendor);
    return acc;
  }, {} as Record<string, any>);

  const leadTimeByCategory = Object.entries(leadTimeAnalysis)
    .map(([category, data]) => ({
      category,
      avgLeadTime: data.totalLeadTime / data.count,
      avgStdDev: data.totalStdDev / data.count,
      vendorCount: data.count,
      riskLevel: (data.totalLeadTime / data.count) > 30 ? 'High' : 
                 (data.totalLeadTime / data.count) > 15 ? 'Medium' : 'Low'
    }))
    .sort((a, b) => b.avgLeadTime - a.avgLeadTime)
    .slice(0, 10);

  // Supply Chain Risk Analysis
  const supplyChainRisk = equipmentData.map(vendor => {
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    const daysOfSupply = vendor.days_of_supply_current || vendor.days_of_supply_current_y || 0;
    const frequency = vendor.frequency_of_use || vendor.frequency_of_use_y || 0;
    const safetyStock = vendor.safety_stock || vendor.safety_stock_y || 0;
    const activeStock = vendor.active_stock_unassigned || vendor.active_stock_unassigned_y || 0;
    
    let riskScore = 0;
    if (Number(leadTime) > 30) riskScore += 3;
    else if (Number(leadTime) > 15) riskScore += 2;
    else riskScore += 1;
    
    if (Number(daysOfSupply) < 30) riskScore += 3;
    else if (Number(daysOfSupply) < 60) riskScore += 2;
    else riskScore += 1;
    
    if (Number(frequency) > 10) riskScore += 2;
    else if (Number(frequency) > 5) riskScore += 1;

    return {
      ...vendor,
      riskScore,
      leadTime: Number(leadTime),
      daysOfSupply: Number(daysOfSupply),
      frequency: Number(frequency),
      safetyStock: Number(safetyStock),
      activeStock: Number(activeStock)
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  // Critical Equipment Analysis
  const criticalEquipment = supplyChainRisk
    .filter(vendor => vendor.riskScore >= 6)
    .slice(0, 15);

  // Geographic Risk Concentration
  const geographicRisk = equipmentData.reduce((acc, vendor) => {
    const country = vendor.country_of_origin_x || vendor.country_of_origin || 'Unknown';
    const leadTime = vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0;
    
    if (!acc[country]) {
      acc[country] = { count: 0, totalLeadTime: 0, highRiskVendors: 0 };
    }
    acc[country].count += 1;
    acc[country].totalLeadTime += Number(leadTime);
    if (Number(leadTime) > 30) acc[country].highRiskVendors += 1;
    return acc;
  }, {} as Record<string, any>);

  const geographicAnalysis = Object.entries(geographicRisk)
    .map(([country, data]) => ({
      country,
      vendorCount: data.count,
      avgLeadTime: data.totalLeadTime / data.count,
      highRiskVendors: data.highRiskVendors,
      concentrationRisk: data.count > equipmentData.length * 0.2 ? 'High' : 
                        data.count > equipmentData.length * 0.1 ? 'Medium' : 'Low'
    }))
    .sort((a, b) => b.vendorCount - a.vendorCount)
    .slice(0, 8);

  // Inventory Risk Matrix
  const inventoryRisk = equipmentData
    .filter(vendor => {
      const daysOfSupply = vendor.days_of_supply_current || vendor.days_of_supply_current_y || 0;
      const frequency = vendor.frequency_of_use || vendor.frequency_of_use_y || 0;
      return Number(daysOfSupply) > 0 && Number(frequency) > 0;
    })
    .map(vendor => {
      const daysOfSupply = Number(vendor.days_of_supply_current || vendor.days_of_supply_current_y || 0);
      const frequency = Number(vendor.frequency_of_use || vendor.frequency_of_use_y || 0);
      const leadTime = Number(vendor.avg_lead_time_days_x || vendor.avg_lead_time_days || 0);
      
      let urgency = 'Low';
      if (daysOfSupply < leadTime && frequency > 5) urgency = 'Critical';
      else if (daysOfSupply < leadTime * 1.5) urgency = 'High';
      else if (daysOfSupply < leadTime * 2) urgency = 'Medium';
      
      return {
        ...vendor,
        daysOfSupply,
        frequency,
        leadTime,
        urgency
      };
    })
    .sort((a, b) => {
      const urgencyOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
    })
    .slice(0, 20);

  const formatNumber = (num: number) => {
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Equipment Risk Visualizations</h2>
        <p className="text-gray-600">
          Analysis focused on equipment vendors only. Service vendors and construction equipment vendors are excluded.
          Displaying insights for {equipmentData.length} equipment vendors.
        </p>
      </div>

      {/* Lead Time Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Lead Time Risk by Equipment Category</h3>
        <p className="text-sm text-gray-600 mb-6">
          Equipment categories with longer lead times typically require product customization (power transformers, switchgear, major generation equipment)
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variability (Std Dev)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leadTimeByCategory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(item.avgLeadTime)} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ±{formatNumber(item.avgStdDev)} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.vendorCount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Equipment Risk */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Critical Equipment Supply Risk</h3>
        <p className="text-sm text-gray-600 mb-6">
          Equipment with high lead times, low inventory levels, and high frequency of use pose the greatest supply risk
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days of Supply</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {criticalEquipment.map((vendor, index) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {vendor.vendor_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vendor.fuzzy_matched_category || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(vendor.leadTime)} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={vendor.daysOfSupply < vendor.leadTime ? 'text-red-600 font-semibold' : ''}>
                      {formatNumber(vendor.daysOfSupply)} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(vendor.frequency)}/month
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.riskScore >= 8 ? 'bg-red-100 text-red-800' :
                      vendor.riskScore >= 6 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.riskScore}/9
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Risk Analysis - Equipment Focus */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment Supply Geographic Risk</h3>
        <p className="text-sm text-gray-600 mb-6">
          Analysis of equipment vendor concentration and lead time risks by country of origin
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Equipment Vendor Concentration</h4>
            <div className="space-y-3">
              {geographicAnalysis.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{country.country}</span>
                    <div className="text-sm text-gray-600">
                      Avg Equipment Lead Time: {formatNumber(country.avgLeadTime)} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{country.vendorCount} equipment vendors</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      country.concentrationRisk === 'High' ? 'bg-red-100 text-red-800' :
                      country.concentrationRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {country.concentrationRisk} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">High Risk Equipment by Country</h4>
            <div className="space-y-3">
              {geographicAnalysis
                .filter(country => country.highRiskVendors > 0)
                .map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-gray-900">{country.country}</span>
                  <span className="text-red-600 font-semibold">
                    {country.highRiskVendors} high-risk equipment vendors
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Risk Matrix - Equipment Only */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment Inventory Risk Matrix</h3>
        <p className="text-sm text-gray-600 mb-6">
          Critical equipment where current stock levels are insufficient relative to lead times and usage frequency
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Supply</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryRisk.map((vendor, index) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {vendor.vendor_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vendor.fuzzy_matched_category || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(vendor.daysOfSupply)} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(vendor.leadTime)} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(vendor.frequency)}/month
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                      vendor.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                      vendor.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {vendor.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights Summary - Equipment Focus */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Strategic Equipment Supply Chain Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• {leadTimeByCategory.filter(cat => cat.riskLevel === 'High').length} equipment categories have high lead time risk (&gt;30 days)</li>
            <li>• {criticalEquipment.length} equipment vendors pose critical supply chain risks</li>
            <li>• {geographicAnalysis.filter(geo => geo.concentrationRisk === 'High').length} countries show high equipment vendor concentration</li>
          </ul>
          <ul className="space-y-2">
            <li>• {inventoryRisk.filter(item => item.urgency === 'Critical').length} equipment items require immediate reordering</li>
            <li>• Average lead time for critical equipment: {formatNumber(criticalEquipment.reduce((sum, v) => sum + v.leadTime, 0) / (criticalEquipment.length || 1))} days</li>
            <li>• Geographic diversification needed for equipment supply chains</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 