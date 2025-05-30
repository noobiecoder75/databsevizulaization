import React from 'react';

interface EnergyUsageData {
  day: string;
  usage: number;
  average: number;
}

interface EnergyUsageChartProps {
  data: EnergyUsageData[];
}

export const EnergyUsageChart = ({ data }: EnergyUsageChartProps) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.usage, d.average))) * 1.1;
  
  return (
    <div className="h-[300px] relative">
      <div className="absolute inset-0 flex items-end pb-6">
        <div className="w-full h-full flex">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col h-full justify-end items-center group">
              <div className="relative w-full px-1 flex flex-col items-center">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {item.day}: {item.usage} kWh
                </div>
                
                {/* Average line */}
                <div 
                  className="absolute w-full border-t border-dashed border-slate-300"
                  style={{ 
                    bottom: `${(item.average / maxValue) * 100}%`,
                  }}
                />
                
                {/* Bar */}
                <div 
                  className="w-2/3 bg-blue-500 rounded-t transition-all duration-300 ease-in-out group-hover:bg-blue-600"
                  style={{ 
                    height: `${(item.usage / maxValue) * 100}%`,
                  }}
                />
              </div>
              
              {/* Day label */}
              <span className="text-xs text-slate-500 mt-2">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-slate-500">Current Usage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0 border-t border-dashed border-slate-300"></div>
          <span className="text-xs text-slate-500">Average</span>
        </div>
      </div>
    </div>
  );
};