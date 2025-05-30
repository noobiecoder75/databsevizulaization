import React, { useState } from 'react';
import { VendorAnalytics } from './components/VendorAnalytics';
import { VendorRiskInventory } from './components/VendorRiskInventory';
import { VendorVisualizations } from './components/VendorVisualizations';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'visualizations'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Vendor Risk Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive vendor risk assessment and supply chain analytics for strategic decision making
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview & Inventory
            </button>
            <button
              onClick={() => setActiveTab('visualizations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'visualizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Equipment Risk Visualizations
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <VendorAnalytics />
              <VendorRiskInventory />
            </>
          )}
          {activeTab === 'visualizations' && (
            <VendorVisualizations />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;