import React from 'react';
import { Database } from 'lucide-react';
import { Colors } from './types';

interface MethodologySlideProps {
  colors: Colors;
}

const MethodologySlide: React.FC<MethodologySlideProps> = ({ colors }) => {
  return (
    <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
      <h1 className="text-5xl font-bold mb-8 text-white">Data & Methodology</h1>
      <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div>
            <Database className="w-12 h-12 mb-4" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Data Sources</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <h4 className="font-semibold">BC Hydro Vendor Data</h4>
                <p className="text-sm text-gray-600">Internal procurement records, vendor performance</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-semibold">WTO Tariff Database</h4>
                <p className="text-sm text-gray-600">HS code-specific tariff rates (Conceptual)</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-semibold">World Bank LPI</h4>
                <p className="text-sm text-gray-600">Logistics performance indicators (Conceptual)</p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-semibold">UN Comtrade</h4>
                <p className="text-sm text-gray-600">International trade statistics (Conceptual)</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Processing Steps</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Data Harmonization</h4>
                  <p className="text-sm text-gray-600">Standardized category names across datasets</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Product Filtering</h4>
                  <p className="text-sm text-gray-600">Focused on physical products, excluded services</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Risk Calculation</h4>
                  <p className="text-sm text-gray-600">Multi-factor risk scoring algorithm</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Scenario Modeling</h4>
                  <p className="text-sm text-gray-600">Tariff impact simulations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide; 