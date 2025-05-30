import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'Custom Range'
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="bg-white border border-slate-200 rounded-md px-4 py-2 flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
      >
        <Calendar size={16} />
        <span>{value}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-md z-10 min-w-[180px]">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    option === value 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};