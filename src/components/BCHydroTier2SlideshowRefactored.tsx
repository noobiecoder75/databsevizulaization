import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';

// Import slide components
import {
  TitleSlide,
  ExecutiveSummarySlide,
  MethodologySlide,
  SpendByCategorySlide,
  RiskMatrixSlide,
  LeadTimeSlide,
  SpendByCountrySlide,
  ImmediateActionsSlide,
  TariffSimulationSlide,
  StrategicTransformationSlide,
  RecommendationsSlide,
  QnASlide,
  Colors,
  AnalysisData
} from './slides';

const BCHydroTier2SlideshowRefactored = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: vendorData, loading: vendorLoading } = useVendorRiskInventory();
  const { data: tradeData, loading: tradeLoading } = useCountryTradePartners();

  const colors: Colors = {
    primary: '#003B71',    // BC Hydro Navy Blue
    secondary: '#E31837',  // BC Hydro Red
    accent: '#00A651',     // BC Hydro Green
    neutral: '#F5F5F5',    // Light Grey
    warning: '#FF6B35',    // Orange
    success: '#28A745',    // Green
    danger: '#DC3545',     // Red
    info: '#17A2B8',       // Teal
    dark: '#343A40',       // Dark Grey
    light: '#FFFFFF'       // White
  };

  // Equipment-only categories filter
  const isEquipmentCategory = (category: string) => {
    if (!category) return false;
    const categoryLower = category.toLowerCase();
    
    const electricalEquipmentKeywords = [
      'transformer', 'transformers',
      'switchgear', 'switch gear', 'switches',
      'generator', 'generators',
      'battery', 'batteries',
      'cable', 'cables',
      'conductor', 'conductors',
      'insulator', 'insulators',
      'relay', 'relays',
      'meter', 'meters', 'metering',
      'breaker', 'breakers', 'circuit breaker',
      'motor', 'motors',
      'pump', 'pumps',
      'valve', 'valves',
      'electrical equipment',
      'power equipment',
      'transmission equipment',
      'distribution equipment',
      'substation equipment'
    ];
    
    return electricalEquipmentKeywords.some(keyword => categoryLower.includes(keyword));
  };

  // Filter vendor data to equipment only AND exclude Canadian suppliers
  const equipmentVendors = useMemo(() => {
    return vendorData.filter(vendor => {
      const isEquipment = isEquipmentCategory(vendor.category || '');
      const isNotCanadian = !vendor.country_of_origin?.toLowerCase().includes('canada');
      return isEquipment && isNotCanadian;
    });
  }, [vendorData]);

  // Calculate comprehensive analysis data
  const analysisData: AnalysisData | null = useMemo(() => {
    if (!equipmentVendors.length) return null;

    // Calculate top categories by spend
    const categorySpend = equipmentVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      acc[category] = (acc[category] || 0) + Number(vendor.annual_spend || 0);
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpend)
      .map(([category, spend]) => ({ category, spend }))
      .sort((a, b) => b.spend - a.spend);

    // Calculate total spend
    const totalSpend = equipmentVendors.reduce((sum, v) => sum + Number(v.annual_spend || 0), 0);

    // Calculate risk matrix data
    const riskMatrixData = topCategories.map(cat => {
      const vendors = equipmentVendors.filter(v => v.category === cat.category);
      const avgLeadTime = vendors.reduce((sum, v) => sum + Number(v.average_lead_time_days || 0), 0) / vendors.length;
      const avgSafetyStock = vendors.reduce((sum, v) => sum + Number(v.safety_stock || 0), 0) / vendors.length;
      
      let riskLevel = 'Low';
      let riskScore = 0;

      // Calculate risk score based on lead time, safety stock, and vendor diversity
      const leadTimeScore = avgLeadTime > 60 ? 3 : avgLeadTime > 30 ? 2 : 1;
      const safetyStockScore = avgSafetyStock < 50 ? 3 : avgSafetyStock < 100 ? 2 : 1;
      const vendorDiversityScore = vendors.length <= 2 ? 3 : vendors.length <= 5 ? 2 : 1;
      
      riskScore = leadTimeScore + safetyStockScore + vendorDiversityScore;
      
      if (riskScore >= 8) riskLevel = 'Critical';
      else if (riskScore >= 6) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';

      return {
        category: cat.category,
        totalSpend: cat.spend,
        vendorCount: vendors.length,
        riskLevel,
        riskScore
      };
    });

    // Calculate lead time data
    const leadTimeData = equipmentVendors.map(vendor => ({
      leadTime: Number(vendor.average_lead_time_days || 0),
      safetyStock: Number(vendor.safety_stock || 0),
      category: vendor.category || 'Unknown',
      riskLevel: vendor.risk_tolerance_category === 'Low' ? 'High' : 'Low',
      vendor: vendor.vendor_number
    })).slice(0, 50);

    // Calculate top countries
    const countrySpend = equipmentVendors.reduce((acc, vendor) => {
      const country = vendor.country_of_origin || 'Unknown';
      acc[country] = (acc[country] || 0) + Number(vendor.annual_spend || 0);
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countrySpend)
      .map(([country, spend]) => ({ country, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 15);

    // Calculate top vendors
    const topVendors = [...equipmentVendors]
      .sort((a, b) => Number(b.annual_spend || 0) - Number(a.annual_spend || 0))
      .slice(0, 15)
      .map(vendor => ({
        vendor_number: vendor.vendor_number,
        category: vendor.category || 'Unknown',
        country_of_origin: vendor.country_of_origin || 'Unknown',
        annual_spend: vendor.annual_spend
      }));

    // Calculate risk vendors (top 5 by risk score)
    const riskVendors = equipmentVendors.map(vendor => {
      // Risk scoring based on multiple factors
      const leadTime = Number(vendor.average_lead_time_days || 0);
      const safetyStock = Number(vendor.safety_stock || 0);
      const annualSpend = Number(vendor.annual_spend || 0);
      const riskTolerance = vendor.risk_tolerance_category || 'Medium';

      // Calculate risk components
      const riskToleranceScore = riskTolerance === 'Low' ? 3 : riskTolerance === 'Medium' ? 2 : 1;
      const leadTimeScore = leadTime > 90 ? 3 : leadTime > 60 ? 2 : 1;
      const safetyStockScore = safetyStock < 50 ? 3 : safetyStock < 100 ? 2 : 1;
      const financialImpact = Math.log(annualSpend + 1) / 10;

      const riskScore = (riskToleranceScore + leadTimeScore + safetyStockScore) * (1 + financialImpact);

      let riskLevel = 'Low';
      if (riskScore >= 9) riskLevel = 'Critical';
      else if (riskScore >= 7) riskLevel = 'High';
      else if (riskScore >= 5) riskLevel = 'Medium';

      return {
        ...vendor,
        riskScore,
        riskLevel
      };
    }).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

    // Calculate tariff simulation (25% on US equipment)
    const usVendors = equipmentVendors.filter(v => 
      v.country_of_origin?.toLowerCase().includes('united states') || 
      v.country_of_origin?.toLowerCase().includes('usa') ||
      v.country_of_origin?.toLowerCase().includes('us')
    );

    const usCategorySpend = usVendors.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      acc[category] = (acc[category] || 0) + Number(vendor.annual_spend || 0);
      return acc;
    }, {} as Record<string, number>);

    const tariffData = Object.entries(usCategorySpend)
      .map(([category, currentSpend]) => ({
        category,
        currentSpend,
        tariffCost: currentSpend * 0.25,
        vendors: usVendors.filter(v => v.category === category).length
      }))
      .sort((a, b) => b.tariffCost - a.tariffCost)
      .slice(0, 15);

    const usaTariffImpact = tariffData.reduce((sum, item) => sum + item.tariffCost, 0);

    // Calculate vulnerable categories
    const vulnerableCategories = riskMatrixData
      .filter(cat => cat.riskLevel === 'Critical' || cat.riskLevel === 'High')
      .map(cat => ({
        category: cat.category,
        totalSpend: cat.totalSpend
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend);

    return {
      topCategories,
      riskMatrixData,
      leadTimeData,
      topCountries,
      topVendors,
      riskVendors,
      tariffData,
      vulnerableCategories,
      totalSpend,
      usaTariffImpact
    };
  }, [equipmentVendors]);

  // Define slides using the new components
  const slides = [
    {
      id: 'title',
      content: <TitleSlide colors={colors} />
    },
    {
      id: 'executive-summary',
      content: (
        <ExecutiveSummarySlide 
          colors={colors} 
          analysisData={analysisData} 
          equipmentVendorsLength={equipmentVendors.length}
        />
      )
    },
    {
      id: 'methodology',
      content: (
        <MethodologySlide 
          colors={colors} 
          equipmentVendorsLength={equipmentVendors.length}
          tradeDataLength={tradeData.length}
        />
      )
    },
    {
      id: 'spend-by-category',
      content: <SpendByCategorySlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'risk-matrix',
      content: <RiskMatrixSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'lead-time',
      content: <LeadTimeSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'spend-by-country',
      content: <SpendByCountrySlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'tariff-simulation',
      content: <TariffSimulationSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'immediate-actions',
      content: <ImmediateActionsSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'strategic-transformation',
      content: <StrategicTransformationSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'recommendations',
      content: <RecommendationsSlide colors={colors} analysisData={analysisData} />
    },
    {
      id: 'qna',
      content: <QnASlide colors={colors} analysisData={analysisData} />
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (vendorLoading || tradeLoading || !equipmentVendors.length) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-white text-2xl bg-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading BC Hydro Equipment Supply Chain Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Navigation Sidebar */}
      <div className="w-20 bg-gray-800 flex flex-col items-center py-6 space-y-4 border-r border-gray-700">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-all duration-300 shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Slide Navigation Buttons */}
        <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-10 h-10 rounded-lg transition-all duration-300 text-xs font-bold ${
                index === currentSlide 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
              }`}
              title={`Slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-all duration-300 shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Slide Counter */}
        <div className="mt-auto bg-gray-700 rounded-lg px-3 py-2 text-white text-xs font-semibold">
          {currentSlide + 1}/{slides.length}
        </div>
      </div>

      {/* Slide Content Area */}
      <div className="flex-1 h-full">
        {slides[currentSlide].content}
      </div>
    </div>
  );
};

export default BCHydroTier2SlideshowRefactored; 