import React from 'react';
import { Target, Factory } from 'lucide-react';
import { Colors } from './types';

interface MethodologySlideProps {
  colors: Colors;
  equipmentVendorsLength: number;
  tradeDataLength: number;
}

const MethodologySlide: React.FC<MethodologySlideProps> = ({ colors, equipmentVendorsLength, tradeDataLength }) => {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800">Objective & Methodology</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 space-y-4 overflow-hidden">
        {/* Data Preparation Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">1</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Data Preparation</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ backgroundColor: colors.primary }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">Identify & Isolate Categories</div>
              <div className="text-xs">Categories relevant to physical supply chain</div>
            </div>
            <div style={{ backgroundColor: colors.primary }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">Clean Data</div>
              <div className="text-xs">Match category names across BC Hydro sheets and countries between BC Hydro and external data</div>
            </div>
          </div>
        </div>

        {/* Filtering & Analysis Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">2</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Filtering & Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ backgroundColor: colors.accent }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">Create Filters</div>
              <div className="text-xs">For risk categories, only consider supply chain categories (ignored services)</div>
            </div>
            <div style={{ backgroundColor: colors.accent }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">Isolate Vendor Countries</div>
              <div className="text-xs">For most vulnerable components and identify possible alternatives</div>
            </div>
          </div>
        </div>

        {/* Risk Assessment Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">3</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Risk Assessment</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ backgroundColor: colors.info }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">USA Tariffs</div>
              <div className="text-xs">Create calculation to increase current tariffs to potential 25%</div>
            </div>
            <div style={{ backgroundColor: colors.info }} className="text-white p-3 rounded-lg">
              <div className="font-bold text-sm mb-1">Review Tariff Risk</div>
              <div className="text-xs">For potential supplier countries</div>
            </div>
          </div>
        </div>

        {/* Visualization Section */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">4</span>
            </div>
            <span className="text-xl font-semibold text-gray-700">Visualization</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div style={{ backgroundColor: colors.secondary }} className="text-white p-3 rounded-lg text-center">
              <div className="font-bold text-sm mb-1">Built Dashboard</div>
              <div className="text-xs">Built dashboard on top of datasets to extract insights</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end px-8 py-4">
        <div className="w-32 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide; 