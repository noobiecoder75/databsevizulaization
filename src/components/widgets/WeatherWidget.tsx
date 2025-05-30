import React from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'drizzle';
  humidity: number;
  wind: number;
  impact: string;
  forecast: Array<{
    day: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'drizzle';
  }>;
}

interface WeatherWidgetProps {
  data: WeatherData;
}

export const WeatherWidget = ({ data }: WeatherWidgetProps) => {
  const weatherIcons = {
    sunny: <Sun size={24} className="text-amber-500" />,
    cloudy: <Cloud size={24} className="text-slate-500" />,
    rainy: <CloudRain size={24} className="text-blue-500" />,
    snowy: <CloudSnow size={24} className="text-blue-300" />,
    stormy: <CloudLightning size={24} className="text-amber-500" />,
    drizzle: <CloudDrizzle size={24} className="text-blue-400" />
  };

  const getWeatherIcon = (condition: keyof typeof weatherIcons, size = 24) => {
    const Icon = weatherIcons[condition];
    return React.cloneElement(Icon, { size });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-500 mb-3">Weather Impact</h3>
        
        {/* Current weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 rounded-full p-2">
              {getWeatherIcon(data.condition, 28)}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{data.temperature}°</p>
              <p className="text-xs text-slate-500 capitalize">{data.condition}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs text-slate-500">Humidity:</span>
              <span className="text-xs font-medium text-slate-700">{data.humidity}%</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs text-slate-500">Wind:</span>
              <span className="text-xs font-medium text-slate-700">{data.wind} km/h</span>
            </div>
          </div>
        </div>
        
        {/* Weather impact */}
        <div className="mt-3 text-xs text-slate-600">
          <p>{data.impact}</p>
        </div>
        
        {/* Forecast */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex justify-between">
            {data.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-xs text-slate-500">{day.day}</span>
                <div className="my-1">
                  {getWeatherIcon(day.condition, 18)}
                </div>
                <span className="text-xs font-medium text-slate-700">{day.temperature}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};