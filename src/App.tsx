import React, { useState } from 'react';
import { VendorAnalytics } from './components/VendorAnalytics';
import { VendorRiskInventory } from './components/VendorRiskInventory';
import { VendorVisualizations } from './components/VendorVisualizations';
import { TradeDataTable } from './components/TradeDataTable';
import { TradeDataVisualizations } from './components/TradeDataVisualizations';
import { VendorTradeAnalysis } from './components/VendorTradeAnalysis';
import BCHydroHackathonSlideshowRefactored from './components/BCHydroHackathonSlideshowRefactored';
import BCHydroTier2SlideshowRefactored from './components/BCHydroTier2SlideshowRefactored';
import { AlertTriangle, Globe, Clock, DollarSign, Building, Users, AlertCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'visualizations' | 'trade' | 'trade-viz' | 'vendor-trade' | 'slideshow-refactored' | 'tier2-slideshow'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview & Inventory
            </button>
            <button
              onClick={() => setActiveTab('visualizations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'visualizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendor Risk Visualizations
            </button>
            <button
              onClick={() => setActiveTab('trade')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'trade'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              International Trade Data
            </button>
            <button
              onClick={() => setActiveTab('trade-viz')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'trade-viz'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Trade Visualizations
            </button>
            <button
              onClick={() => setActiveTab('vendor-trade')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'vendor-trade'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              BC Hydro Vendor Analysis
            </button>
            <button
              onClick={() => setActiveTab('slideshow-refactored')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'slideshow-refactored'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hackathon Slideshow (Refactored)
            </button>
            <button
              onClick={() => setActiveTab('tier2-slideshow')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'tier2-slideshow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tier 2 Supplier Analysis
            </button>
          </nav>
        </div>

        {/* Vendor Supply Chain Insights */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Building className="w-8 h-8 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Vendor Supply Chain Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Risk Distribution */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Risk Distribution</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">32.0%</div>
                <div className="text-xs text-white/80">Low risk tolerance (highest risk)</div>
                <div className="text-xs text-white/70 mt-1">61.6% medium risk tolerance</div>
              </div>

              {/* Lead Time */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-orange-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Average Lead Time</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">230.4</div>
                <div className="text-xs text-white/80">days</div>
                <div className="text-xs text-white/70 mt-1">Vendor delivery timeline</div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 text-green-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Global Reach</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">13</div>
                <div className="text-xs text-white/80">countries</div>
                <div className="text-xs text-white/70 mt-1">Canada leads with 85 vendors</div>
              </div>

              {/* Annual Spend */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Total Procurement</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">$5.0B</div>
                <div className="text-xs text-white/80">annual spend</div>
                <div className="text-xs text-white/70 mt-1">Across all vendor categories</div>
              </div>
            </div>

            {/* Additional Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Largest Category */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-purple-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Largest Category</h3>
                </div>
                <div className="text-lg font-bold text-white mb-1">IT Services</div>
                <div className="text-xs text-white/80">39 vendors in this category</div>
              </div>

              {/* Data Quality Alert */}
              <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
                  <h3 className="text-sm font-semibold text-white/90">Data Quality Issue</h3>
                </div>
                <div className="text-lg font-bold text-white mb-1">21 Duplicates</div>
                <div className="text-xs text-white/80">Vendor numbers need cleanup</div>
              </div>

              {/* Quick Action */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-semibold text-white/90 mb-1">Need Analysis?</div>
                  <div className="text-xs text-white/70">Navigate to tabs above</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <VendorRiskInventory />
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
          {activeTab === 'slideshow-refactored' && (
            <BCHydroHackathonSlideshowRefactored />
          )}
          {activeTab === 'tier2-slideshow' && (
            <BCHydroTier2SlideshowRefactored />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;