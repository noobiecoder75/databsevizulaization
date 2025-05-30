import React from 'react';
import { Leaf } from 'lucide-react';

interface GreenImpactCardProps {
  renewablePercentage: number;
  co2Reduction: number;
}

export const GreenImpactCard = ({ 
  renewablePercentage, 
  co2Reduction 
}: GreenImpactCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">Green Impact</h3>
        <div className="bg-green-100 rounded-full p-1">
          <Leaf size={16} className="text-green-600" />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-500">Renewable Energy</span>
            <span className="text-xs font-medium text-slate-700">{renewablePercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${renewablePercentage}%` }}
            />
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            Your clean energy usage has reduced CO<sub>2</sub> emissions by
          </p>
          <p className="text-lg font-semibold text-slate-800 mt-1">
            {co2Reduction.toLocaleString()} kg
          </p>
        </div>
      </div>
    </div>
  );
};