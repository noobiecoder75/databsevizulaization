import React, { useState } from 'react';
import { VendorAnalytics } from './components/VendorAnalytics';
import { VendorRiskInventory } from './components/VendorRiskInventory';
import { VendorVisualizations } from './components/VendorVisualizations';
import { TradeDataTable } from './components/TradeDataTable';
import { TradeDataVisualizations } from './components/TradeDataVisualizations';
import { VendorTradeAnalysis } from './components/VendorTradeAnalysis';
import { SupplyChainRiskDashboard } from './components/SupplyChainRiskDashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'visualizations' | 'trade' | 'trade-viz' | 'vendor-trade' | 'risk-dashboard'>('overview');

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
              Vendor Risk Visualizations
            </button>
            <button
              onClick={() => setActiveTab('trade')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trade'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              International Trade Data
            </button>
            <button
              onClick={() => setActiveTab('trade-viz')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trade-viz'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Trade Visualizations
            </button>
            <button
              onClick={() => setActiveTab('vendor-trade')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vendor-trade'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              BC Hydro Vendor Analysis
            </button>
            <button
              onClick={() => setActiveTab('risk-dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'risk-dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Supply Chain Risk Dashboard
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
          {activeTab === 'trade' && (
            <TradeDataTable />
          )}
          {activeTab === 'trade-viz' && (
            <TradeDataVisualizations />
          )}
          {activeTab === 'vendor-trade' && (
            <VendorTradeAnalysis />
          )}
          {activeTab === 'risk-dashboard' && (
            <SupplyChainRiskDashboard />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;