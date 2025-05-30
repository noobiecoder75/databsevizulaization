import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LightbulbOff, ThermometerSnowflake, Timer, Zap } from 'lucide-react';

interface SavingTip {
  id: number;
  title: string;
  description: string;
  savingsEstimate: string;
  icon: 'light' | 'thermostat' | 'timer' | 'power';
}

interface SavingTipsWidgetProps {
  tips: SavingTip[];
}

export const SavingTipsWidget = ({ tips }: SavingTipsWidgetProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTip = () => {
    setActiveIndex((current) => (current + 1) % tips.length);
  };
  
  const prevTip = () => {
    setActiveIndex((current) => (current - 1 + tips.length) % tips.length);
  };
  
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'light':
        return <LightbulbOff className="text-amber-500" />;
      case 'thermostat':
        return <ThermometerSnowflake className="text-blue-500" />;
      case 'timer':
        return <Timer className="text-purple-500" />;
      case 'power':
        return <Zap className="text-red-500" />;
      default:
        return <LightbulbOff className="text-amber-500" />;
    }
  };
  
  const activeTip = tips[activeIndex];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-800">Energy Saving Tips</h3>
        
        <div className="flex gap-1">
          <button 
            onClick={prevTip}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextTip}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-start gap-4">
        <div className="bg-slate-100 p-3 rounded-full">
          {getIcon(activeTip.icon)}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-slate-800">{activeTip.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{activeTip.description}</p>
          
          <div className="mt-3 bg-green-50 border border-green-100 rounded-md p-2 inline-block">
            <span className="text-xs font-medium text-green-700">Potential savings: {activeTip.savingsEstimate}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};