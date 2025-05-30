import React from 'react';

interface UsageTrendItem {
  date: string;
  value: number;
}

interface UsageTrendProps {
  data: UsageTrendItem[];
}

export const UsageTrend = ({ data }: UsageTrendProps) => {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
  const minValue = Math.min(...data.map(d => d.value)) * 0.9;
  const range = maxValue - minValue;
  
  // Create a normalized path for the line chart
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (((item.value - minValue) / range) * 100);
    return `${x},${y}`;
  });
  
  const linePath = `M ${points.join(' L ')}`;
  
  // Create area fill below the line
  const areaPath = `
    ${linePath} 
    L ${(data.length - 1) / (data.length - 1) * 100},100 
    L 0,100 
    Z
  `;

  return (
    <div className="h-[200px] relative">
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((position) => (
          <line 
            key={position}
            x1="0" 
            y1={position} 
            x2="100%" 
            y2={position}
            stroke="#e2e8f0" 
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        
        {/* Area fill */}
        <path 
          d={areaPath} 
          fill="url(#gradient)" 
          opacity="0.2" 
        />
        
        {/* Line */}
        <path 
          d={linePath} 
          stroke="#2563eb" 
          strokeWidth="2" 
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (((item.value - minValue) / range) * 100);
          
          return (
            <g key={index} className="group cursor-pointer">
              {/* Tooltip */}
              <foreignObject 
                x={x - 50} 
                y={y - 40} 
                width="100" 
                height="30"
                className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="bg-slate-800 text-white text-xs rounded py-1 px-2 text-center">
                  {item.date}: {item.value} kWh
                </div>
              </foreignObject>
              
              {/* Point */}
              <circle 
                cx={x + "%"} 
                cy={y + "%"} 
                r="4"
                className="fill-white stroke-blue-600 stroke-2 group-hover:fill-blue-600 transition-colors"
              />
            </g>
          );
        })}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((item, i) => (
          <span key={i} className="text-xs text-slate-500">{item.date}</span>
        ))}
      </div>
    </div>
  );
};