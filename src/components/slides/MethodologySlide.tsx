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
    <div className="h-full p-6 lg:p-8" style={{ backgroundColor: colors.dark }}>
      <h1 className="text-3xl lg:text-5xl font-black mb-4 text-center text-white">OBJECTIVE & METHODOLOGY</h1>
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl h-4/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black mb-4" style={{ color: colors.accent }}>
              <Target className="w-8 h-8 inline mr-3" />
              ANALYSIS GOAL
            </h2>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white mb-4 shadow-lg">
              <p className="text-lg lg:text-xl font-bold leading-relaxed">
                Identify vulnerabilities in electrical equipment vendor relationships to protect BC Hydro against supply chain disruptions
              </p>
            </div>
            
            <h3 className="text-xl lg:text-2xl font-black mb-3" style={{ color: colors.secondary }}>KEY METRICS</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold text-blue-800">• Annual spend analysis</div>
              </div>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                <div className="font-bold text-red-800">• Risk assessment by category</div>
              </div>
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
                <div className="font-bold text-orange-800">• 25% US tariff simulation</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl lg:text-4xl font-black mb-4" style={{ color: colors.accent }}>
              <Factory className="w-8 h-8 inline mr-3" />
              DATA SOURCES
            </h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl border-2 border-blue-300 shadow-md">
                <h4 className="font-black text-blue-900 text-lg">Equipment Vendor Inventory</h4>
                <p className="text-blue-700 font-medium">Complete electrical equipment data</p>
                <div className="text-blue-600 font-bold mt-1">{equipmentVendorsLength} vendor records</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl border-2 border-green-300 shadow-md">
                <h4 className="font-black text-green-900 text-lg">Global Trade Data</h4>
                <p className="text-green-700 font-medium">International supply chain mapping</p>
                <div className="text-green-600 font-bold mt-1">{tradeDataLength} trade records</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-4 rounded-xl border-2 border-yellow-400 shadow-md">
                <h4 className="font-black text-yellow-900 text-lg">ELECTRICAL EQUIPMENT ONLY</h4>
                <p className="text-yellow-700 font-bold">Transformers, switchgear, generators, batteries</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-xl border-2 border-red-400 shadow-md">
                <h4 className="font-black text-red-900 text-lg">EXCLUDES CANADIAN SUPPLIERS</h4>
                <p className="text-red-700 font-bold">No domestic tariffs - international focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide; 