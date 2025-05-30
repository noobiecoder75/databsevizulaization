import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface UsageSummaryCardProps {
  title: string;
  value: number;
  unit: string;
  change: number;
  changeLabel: string;
}

export const UsageSummaryCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  changeLabel 
}: UsageSummaryCardProps) => {
  const isPositive = change > 0;
  const formattedValue = value.toLocaleString('en-US', {
    maximumFractionDigits: 2
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-all hover:shadow-md">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-bold text-slate-800">{formattedValue}</p>
        <span className="ml-1 text-slate-500">{unit}</span>
      </div>
      <div className="mt-2 flex items-center">
        <span className={`inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
          isPositive ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'
        }`}>
          {isPositive ? (
            <ArrowUpRight size={14} className="mr-0.5" />
          ) : (
            <ArrowDownRight size={14} className="mr-0.5" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="ml-2 text-xs text-slate-500">{changeLabel}</span>
      </div>
    </div>
  );
};