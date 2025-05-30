import React from 'react';

interface EnergyDistributionItem {
  label: string;
  value: number;
  color: string;
}

interface EnergyDistributionChartProps {
  data: EnergyDistributionItem[];
}

export const EnergyDistributionChart = ({ data }: EnergyDistributionChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate the cumulative percentages for the segments
  let cumulativePercentage = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage;
    cumulativePercentage += percentage;
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: cumulativePercentage
    };
  });

  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-full flex items-center justify-center gap-8">
        {/* Donut chart */}
        <div className="relative w-[160px] h-[160px]">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((segment, index) => {
              // Convert percentages to SVG arc parameters
              const startAngle = (segment.startAngle / 100) * 2 * Math.PI;
              const endAngle = (segment.endAngle / 100) * 2 * Math.PI;
              
              // Calculate the SVG arc path
              const x1 = 50 + 40 * Math.cos(startAngle);
              const y1 = 50 + 40 * Math.sin(startAngle);
              const x2 = 50 + 40 * Math.cos(endAngle);
              const y2 = 50 + 40 * Math.sin(endAngle);
              
              // Determine if the arc should be drawn as a large arc
              const largeArcFlag = segment.percentage > 50 ? 1 : 0;
              
              const pathData = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
            {/* Inner circle for donut effect */}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-lg font-bold text-slate-800">{total} kWh</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-col gap-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }}></div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-slate-700">{segment.label}</span>
                <span className="text-sm font-medium text-slate-800">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};