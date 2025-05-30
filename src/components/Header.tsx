import React from 'react';
import { Bell, HelpCircle, Settings, User } from 'lucide-react';
import { Logo } from './Logo';

export const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Logo />
        <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Energy Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} />
        </button>
        <button className="text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
          <HelpCircle size={20} />
        </button>
        <button className="text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
          <Settings size={20} />
        </button>
        <button className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-colors">
          <div className="bg-blue-600 text-white rounded-full p-1">
            <User size={18} />
          </div>
          <span className="text-sm font-medium hidden md:block">John Smith</span>
        </button>
      </div>
    </header>
  );
};