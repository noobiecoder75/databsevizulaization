import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

// Import slide components
import {
  TitleSlide,
  ContextSlide,
  ChallengesSlide,
  ObjectiveSlide,
  VulnerabilitySlide,
  TariffSlide,
  AlternativesSlide,
  SelectionSlide,
  MethodologySlide,
  ConclusionSlide,
  AppendixSlide,
  ThankYouSlide,
  Colors,
  VendorData
} from './hackathonSlides';

const BCHydroHackathonSlideshowRefactored = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: rawVendorData } = useVendorRiskInventory();

  // BC Hydro official colors
  const colors: Colors = {
    darkGreen: '#00A651',    // BC Hydro Green
    navy: '#003B71',         // BC Hydro Navy Blue  
    lightGrey: '#F5F5F5',    // Light Grey
    teal: '#17A2B8',         // Teal
    lightGreen: '#28A745',   // Success Green
    chartRed: '#E31837',     // BC Hydro Red
    chartOrange: '#FF6B35',  // Orange
    chartYellow: '#FFC107',  // Yellow
    chartBlue: '#007BFF',    // Blue
    chartPurple: '#6F42C1',  // Purple
  };

  const CHART_COLORS = [colors.teal, colors.lightGreen, colors.chartOrange, colors.chartBlue, colors.chartPurple, colors.chartRed];

  const vendorData: VendorData[] = useMemo(() => rawVendorData || [], [rawVendorData]);

  const slides = [
    {
      id: 'title',
      content: <TitleSlide colors={colors} />
    },
    {
      id: 'context',
      content: <ContextSlide colors={colors} />
    },
    {
      id: 'challenges',
      content: <ChallengesSlide colors={colors} />
    },
    {
      id: 'objective',
      content: <ObjectiveSlide colors={colors} />
    },
    {
      id: 'vulnerability',
      content: <VulnerabilitySlide colors={colors} vendorData={vendorData} />
    },
    {
      id: 'tariff',
      content: <TariffSlide colors={colors} vendorData={vendorData} CHART_COLORS={CHART_COLORS} />
    },
    {
      id: 'alternatives',
      content: <AlternativesSlide colors={colors} vendorData={vendorData} CHART_COLORS={CHART_COLORS} />
    },
    {
      id: 'selection',
      content: <SelectionSlide colors={colors} vendorData={vendorData} CHART_COLORS={CHART_COLORS} />
    },
    {
      id: 'methodology',
      content: <MethodologySlide colors={colors} />
    },
    {
      id: 'conclusion',
      content: <ConclusionSlide colors={colors} />
    },
    {
      id: 'appendix',
      content: <AppendixSlide colors={colors} vendorData={vendorData} />
    },
    {
      id: 'thank-you',
      content: <ThankYouSlide colors={colors} />
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

  if (vendorData.length === 0 && !rawVendorData) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-white text-2xl bg-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading BC Hydro Supply Chain Risk Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Slide Content */}
      <div className="h-full">
        {slides[currentSlide].content}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-50">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 border border-white/50 shadow-md"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        
        <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                index === currentSlide 
                  ? 'bg-blue-600 border-blue-700 shadow-md' 
                  : 'bg-white/60 border-gray-300 hover:bg-blue-200 hover:border-blue-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 border border-white/50 shadow-md"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 text-gray-800 font-semibold shadow-lg border border-white/50 z-50">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default BCHydroHackathonSlideshowRefactored; 