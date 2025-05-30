import React, { useState } from 'react';
import { BarChart3, Calendar, CreditCard, Home, Menu, MessageSquare, PieChart, Settings, X } from 'lucide-react';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <BarChart3 size={20} />, label: 'Usage Analytics' },
    { icon: <CreditCard size={20} />, label: 'Billing' },
    { icon: <PieChart size={20} />, label: 'Consumption' },
    { icon: <Calendar size={20} />, label: 'History' },
    { icon: <MessageSquare size={20} />, label: 'Support' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed z-50 bottom-4 right-4 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:static inset-y-0 z-40`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {!isCollapsed && <span className="font-semibold text-slate-800">Menu</span>}
          <button 
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 hidden md:block"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                    ${item.active 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};