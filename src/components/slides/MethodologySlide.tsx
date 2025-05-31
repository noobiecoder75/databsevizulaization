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
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800">Objective & Methodology</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
              <Target className="w-8 h-8 inline mr-3" />
              Analysis Goal
            </h2>
            <div style={{ backgroundColor: colors.primary }} className="p-6 rounded-xl text-white mb-6 shadow-lg">
              <p className="text-lg font-semibold leading-relaxed">
                Identify vulnerabilities in electrical equipment vendor relationships to protect BC Hydro against supply chain disruptions
              </p>
            </div>
            
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>Key Metrics</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold text-blue-800 text-lg">• Annual spend analysis</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <div className="font-bold text-red-800 text-lg">• Risk assessment by category</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="font-bold text-orange-800 text-lg">• 25% US tariff simulation</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
              <Factory className="w-8 h-8 inline mr-3" />
              Data Sources
            </h2>
            <div className="space-y-4">
              <div style={{ backgroundColor: colors.info }} className="p-5 rounded-xl text-white shadow-md">
                <h4 className="font-bold text-xl mb-2">Equipment Vendor Inventory</h4>
                <p className="font-medium text-lg">Complete electrical equipment data</p>
                <div className="font-bold mt-2 text-xl">{equipmentVendorsLength} vendor records</div>
              </div>
              
              <div style={{ backgroundColor: colors.accent }} className="p-5 rounded-xl text-white shadow-md">
                <h4 className="font-bold text-xl mb-2">Global Trade Data</h4>
                <p className="font-medium text-lg">International supply chain mapping</p>
                <div className="font-bold mt-2 text-xl">{tradeDataLength} trade records</div>
              </div>
              
              <div style={{ backgroundColor: colors.warning }} className="p-5 rounded-xl text-white shadow-md">
                <h4 className="font-bold text-xl mb-2">Electrical Equipment Only</h4>
                <p className="font-bold">Transformers, switchgear, generators, batteries</p>
              </div>
              
              <div style={{ backgroundColor: colors.secondary }} className="p-5 rounded-xl text-white shadow-md">
                <h4 className="font-bold text-xl mb-2">Excludes Canadian Suppliers</h4>
                <p className="font-bold">No domestic tariffs - international focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Logo Space */}
      <div className="flex justify-end p-8 pt-4">
        <div className="w-32 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500 text-center font-semibold">BC Hydro<br/>Logo</span>
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide; 