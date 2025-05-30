import React from 'react';
import { Zap } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-blue-600 text-white p-1.5 rounded">
        <Zap size={20} className="fill-white" />
      </div>
      <span className="font-bold text-blue-600">BC Hydro</span>
    </div>
  );
};