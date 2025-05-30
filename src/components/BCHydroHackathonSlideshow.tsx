import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Map, BarChart3, TrendingUp, Users, Shield, Target, Database, CheckCircle } from 'lucide-react';

const BCHydroHackathonSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // BC Hydro brand colors
  const colors = {
    darkGreen: '#006A38',
    navy: '#004F6C',
    lightGrey: '#EBE9E8',
    teal: '#10A3C8',
    lightGreen: '#50B848'
  };

  const slides = [
    // Slide 1: Title Slide
    {
      id: 'title',
      content: (
        <div className="h-full flex flex-col justify-center items-center text-center" style={{ backgroundColor: colors.darkGreen }}>
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">Analytics Hackathon 2025</h1>
            <h2 className="text-4xl text-white mb-2">BC Hydro Supply Chain Risk Assessment</h2>
            <p className="text-2xl text-gray-200">Beedie School of Business</p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Team Members</h3>
            <div className="space-y-2 text-xl">
              <p>Tej Tandon</p>
              <p>Paula Apperley</p>
              <p>Simarprit Kaur</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: BC Hydro Context
    {
      id: 'context',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-8" style={{ color: colors.navy }}>BC Hydro: Powering British Columbia</h1>
          <div className="grid grid-cols-2 gap-12 h-3/4">
            <div>
              <div className="bg-white rounded-lg p-8 shadow-lg h-full">
                <Map className="w-16 h-16 mb-6" style={{ color: colors.teal }} />
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Service Area</h2>
                <ul className="text-xl space-y-4">
                  <li>• Serves 95% of BC's population</li>
                  <li>• 5+ million customers</li>
                  <li>• 464,000 km² service territory</li>
                  <li>• Critical infrastructure reliability</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-8 shadow-lg h-full">
                <TrendingUp className="w-16 h-16 mb-6" style={{ color: colors.lightGreen }} />
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Procurement Growth</h2>
                <ul className="text-xl space-y-4">
                  <li>• Annual spend: $650M → $2B</li>
                  <li>• 300% growth in procurement</li>
                  <li>• Complex supply chain challenges</li>
                  <li>• Need for risk mitigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Supply Chain Challenges
    {
      id: 'challenges',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-8 text-white">Supply Chain Vulnerabilities</h1>
          <div className="grid grid-cols-3 gap-8 h-3/4">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Shield className="w-12 h-12 mb-4" style={{ color: colors.darkGreen }} />
              <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Geopolitical Risks</h3>
              <ul className="text-lg space-y-2">
                <li>• Trade war tensions</li>
                <li>• Tariff uncertainties</li>
                <li>• Supply route disruptions</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <TrendingUp className="w-12 h-12 mb-4" style={{ color: colors.teal }} />
              <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Economic Factors</h3>
              <ul className="text-lg space-y-2">
                <li>• Currency fluctuations</li>
                <li>• Inflation pressures</li>
                <li>• Rising transportation costs</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Users className="w-12 h-12 mb-4" style={{ color: colors.lightGreen }} />
              <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.navy }}>Operational Risks</h3>
              <ul className="text-lg space-y-2">
                <li>• Single-source dependencies</li>
                <li>• Extended lead times</li>
                <li>• Quality assurance</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Project Objective
    {
      id: 'objective',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-12 text-center" style={{ color: colors.darkGreen }}>Project Objective</h1>
          <div className="bg-white rounded-lg p-12 shadow-2xl mx-auto max-w-4xl">
            <Target className="w-20 h-20 mx-auto mb-8" style={{ color: colors.navy }} />
            <h2 className="text-4xl font-semibold mb-8 text-center" style={{ color: colors.navy }}>
              Identify Supply Chain Vulnerabilities & Strategic Solutions
            </h2>
            <div className="grid grid-cols-2 gap-8 text-xl">
              <div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Key Questions</h3>
                <ul className="space-y-3">
                  <li>• Which categories are most vulnerable?</li>
                  <li>• What are the tariff impact scenarios?</li>
                  <li>• Where are diversification opportunities?</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Expected Outcomes</h3>
                <ul className="space-y-3">
                  <li>• Risk assessment framework</li>
                  <li>• Strategic recommendations</li>
                  <li>• Actionable insights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Category Vulnerability Analysis
    {
      id: 'vulnerability',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-8 text-white">Category Vulnerability Analysis</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Most Vulnerable Categories</h2>
            <div className="grid grid-cols-2 gap-8 h-5/6">
              <div>
                <div className="h-full bg-gray-50 rounded p-6">
                  <BarChart3 className="w-12 h-12 mb-4" style={{ color: colors.teal }} />
                  <h3 className="text-2xl font-semibold mb-4">Risk Factors</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Switchgear</span>
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div className="h-4 rounded-full" style={{ backgroundColor: '#EF4444', width: '95%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transformers</span>
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div className="h-4 rounded-full" style={{ backgroundColor: '#F59E0B', width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Generators</span>
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div className="h-4 rounded-full" style={{ backgroundColor: '#F59E0B', width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cables</span>
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div className="h-4 rounded-full" style={{ backgroundColor: colors.lightGreen, width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="h-full bg-gray-50 rounded p-6">
                  <h3 className="text-2xl font-semibold mb-4">Key Insights</h3>
                  <div className="space-y-4 text-lg">
                    <div className="p-4 bg-red-50 border-l-4 border-red-500">
                      <strong>Switchgear:</strong> Most vulnerable due to limited sourcing options and high lead times
                    </div>
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                      <strong>Lead Times:</strong> Critical components have 12-18 month lead times
                    </div>
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                      <strong>Concentration:</strong> 70% of spend concentrated in 3 categories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Tariff Scenario
    {
      id: 'tariff',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-8" style={{ color: colors.darkGreen }}>What if USA Tariffs Rise to 25%?</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.navy }}>Impact by Category</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Switchgear</span>
                      <span className="text-red-600 font-bold">$120M affected</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="h-4 bg-red-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">85% US-sourced</span>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Transformers</span>
                      <span className="text-orange-600 font-bold">$80M affected</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="h-4 bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">65% US-sourced</span>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Generators</span>
                      <span className="text-yellow-600 font-bold">$45M affected</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="h-4 bg-yellow-500 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">55% US-sourced</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="h-full bg-red-50 rounded p-6 border-2 border-red-200">
                  <h3 className="text-2xl font-semibold mb-4 text-red-800">Critical Alert</h3>
                  <div className="space-y-4 text-lg">
                    <p><strong>Total Impact:</strong> $245M+ in additional costs</p>
                    <p><strong>Timeline:</strong> Immediate effect on new contracts</p>
                    <p><strong>Risk Level:</strong> HIGH - Supply shock potential</p>
                    <div className="mt-8 p-4 bg-white rounded border-2 border-red-300">
                      <h4 className="font-semibold text-red-800 mb-2">Urgent Action Required:</h4>
                      <p>Diversification strategy needed immediately to mitigate tariff exposure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Global Supply Alternatives
    {
      id: 'alternatives',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-8 text-white">Global Supply Alternatives</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Diversification Opportunities</h2>
            <div className="grid grid-cols-3 gap-6 h-5/6">
              <div className="bg-green-50 rounded p-6 border-2 border-green-200">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Low Risk - Multiple Options</h3>
                <ul className="space-y-2">
                  <li>• Cables & Conductors</li>
                  <li>• Basic Electrical Components</li>
                  <li>• Standard Hardware</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded">
                  <p className="text-sm"><strong>Countries:</strong> Germany, Japan, South Korea, Canada</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">Medium Risk - Some Options</h3>
                <ul className="space-y-2">
                  <li>• Power Transformers</li>
                  <li>• Control Systems</li>
                  <li>• Protective Equipment</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded">
                  <p className="text-sm"><strong>Countries:</strong> Germany, Switzerland, Sweden</p>
                </div>
              </div>
              <div className="bg-red-50 rounded p-6 border-2 border-red-200">
                <h3 className="text-xl font-semibold mb-4 text-red-800">High Risk - Limited Options</h3>
                <ul className="space-y-2">
                  <li>• Specialized Switchgear</li>
                  <li>• Large Generators</li>
                  <li>• Custom Transformers</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded">
                  <p className="text-sm"><strong>Action:</strong> Build strategic partnerships</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-lg text-center"><strong>Key Finding:</strong> Most components have viable international alternatives, except for specialized equipment</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Strategic Supplier Selection
    {
      id: 'selection',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-8" style={{ color: colors.darkGreen }}>Strategic Supplier Selection</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.navy }}>Evaluation Framework</h2>
            <div className="grid grid-cols-2 gap-8 h-5/6">
              <div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.teal }}>Key Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold">Logistics Performance Index (LPI)</h4>
                    <p className="text-sm">Customs, infrastructure, timeliness</p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold">Ease of Doing Business</h4>
                    <p className="text-sm">Regulatory environment, trade facilitation</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold">Trade Relationship</h4>
                    <p className="text-sm">Tariff rates, trade agreements</p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold">Political Stability</h4>
                    <p className="text-sm">Governance, risk indicators</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.teal }}>Recommended Countries</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded">
                    <span className="font-semibold">Germany</span>
                    <span className="text-green-700">LPI: 4.2 | Excellent</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded">
                    <span className="font-semibold">Netherlands</span>
                    <span className="text-green-700">LPI: 4.1 | Excellent</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                    <span className="font-semibold">Japan</span>
                    <span className="text-blue-700">LPI: 4.0 | Very Good</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                    <span className="font-semibold">Sweden</span>
                    <span className="text-blue-700">LPI: 3.9 | Very Good</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-100 rounded">
                    <span className="font-semibold">South Korea</span>
                    <span className="text-yellow-700">LPI: 3.6 | Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Data & Methodology
    {
      id: 'methodology',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-8 text-white">Data & Methodology</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                <Database className="w-12 h-12 mb-4" style={{ color: colors.darkGreen }} />
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Data Sources</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">BC Hydro Vendor Data</h4>
                    <p className="text-sm text-gray-600">Internal procurement records, vendor performance</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">WTO Tariff Database</h4>
                    <p className="text-sm text-gray-600">HS code-specific tariff rates</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">World Bank LPI</h4>
                    <p className="text-sm text-gray-600">Logistics performance indicators</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">UN Comtrade</h4>
                    <p className="text-sm text-gray-600">International trade statistics</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Processing Steps</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Data Harmonization</h4>
                      <p className="text-sm text-gray-600">Standardized category names across datasets</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Product Filtering</h4>
                      <p className="text-sm text-gray-600">Focused on physical products, excluded services</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Risk Calculation</h4>
                      <p className="text-sm text-gray-600">Multi-factor risk scoring algorithm</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.teal }}>
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Scenario Modeling</h4>
                      <p className="text-sm text-gray-600">Tariff impact simulations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Strategic Response - Short Term
    {
      id: 'short-term',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-8" style={{ color: colors.darkGreen }}>Strategic Response: Short Term (0-6 months)</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.navy }}>Immediate Actions</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-800">Vendor Diversification</h4>
                    <p className="text-sm">Strengthen relationships with European and Asian suppliers</p>
                  </div>
                  <div className="p-4 bg-green-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800">Contract Restructuring</h4>
                    <p className="text-sm">Renegotiate terms to include tariff protection clauses</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-800">Inventory Optimization</h4>
                    <p className="text-sm">Increase safety stock for critical high-risk components</p>
                  </div>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-800">Market Intelligence</h4>
                    <p className="text-sm">Establish early warning systems for trade policy changes</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.navy }}>Government Engagement</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border rounded">
                    <h4 className="font-semibold text-red-800">Federal Level</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Advocate for utility-specific trade exemptions</li>
                      <li>• Support CETA expansion</li>
                      <li>• Push for CPTPP electrical equipment provisions</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 border rounded">
                    <h4 className="font-semibold text-orange-800">Provincial Level</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Improve inter-provincial trade barriers</li>
                      <li>• Support local supplier development</li>
                      <li>• Coordinate with other utilities</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-100 rounded">
                  <h4 className="font-semibold">Timeline: Immediate Start</h4>
                  <p className="text-sm">Political engagement must begin immediately given trade policy volatility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 11: Strategic Response - Long Term
    {
      id: 'long-term',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-8 text-white">Strategic Response: Long Term (6-24 months)</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg h-3/4">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Infrastructure Development</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-800">Strategic Warehousing</h4>
                    <p className="text-sm">Build dedicated storage facilities for critical components</p>
                  </div>
                  <div className="p-4 bg-green-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800">Canadian Supply Chain</h4>
                    <p className="text-sm">Develop domestic manufacturing partnerships</p>
                  </div>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-800">Technology Investment</h4>
                    <p className="text-sm">Advanced supply chain monitoring and prediction systems</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-semibold mb-6" style={{ color: colors.darkGreen }}>Partnership Strategy</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border rounded">
                    <h4 className="font-semibold text-yellow-800">International Alliances</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Long-term contracts with European manufacturers</li>
                      <li>• Joint procurement with other utilities</li>
                      <li>• Technology transfer agreements</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-teal-50 border rounded">
                    <h4 className="font-semibold text-teal-800">Innovation Partnerships</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• R&D collaborations with universities</li>
                      <li>• Startup incubation programs</li>
                      <li>• Clean technology initiatives</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-100 rounded">
                  <h4 className="font-semibold">Expected Outcome</h4>
                  <p className="text-sm">50% reduction in supply chain vulnerabilities within 24 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 12: Conclusion
    {
      id: 'conclusion',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.darkGreen }}>
          <h1 className="text-5xl font-bold mb-8 text-white text-center">Key Takeaways</h1>
          <div className="grid grid-cols-3 gap-8 h-3/4">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Shield className="w-16 h-16 mb-4 mx-auto" style={{ color: colors.navy }} />
              <h3 className="text-2xl font-semibold mb-4 text-center" style={{ color: colors.navy }}>Critical Vulnerabilities</h3>
              <ul className="text-lg space-y-2">
                <li>• Switchgear most at-risk</li>
                <li>• US dependency threatens supply</li>
                <li>• $245M+ tariff exposure</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Map className="w-16 h-16 mb-4 mx-auto" style={{ color: colors.teal }} />
              <h3 className="text-2xl font-semibold mb-4 text-center" style={{ color: colors.navy }}>Global Opportunities</h3>
              <ul className="text-lg space-y-2">
                <li>• European alternatives exist</li>
                <li>• High LPI countries available</li>
                <li>• Diversification feasible</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Target className="w-16 h-16 mb-4 mx-auto" style={{ color: colors.lightGreen }} />
              <h3 className="text-2xl font-semibold mb-4 text-center" style={{ color: colors.navy }}>Action Required</h3>
              <ul className="text-lg space-y-2">
                <li>• Immediate diversification</li>
                <li>• Strategic partnerships</li>
                <li>• Government engagement</li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg mt-8">
            <h2 className="text-3xl font-bold text-center" style={{ color: colors.navy }}>
              BC Hydro Must Act Now to Safeguard Long-Term Reliability
            </h2>
          </div>
        </div>
      )
    },

    // Slide 13: Thank You
    {
      id: 'thank-you',
      content: (
        <div className="h-full flex flex-col justify-center items-center" style={{ backgroundColor: colors.navy }}>
          <div className="text-center">
            <CheckCircle className="w-24 h-24 mx-auto mb-8 text-white" />
            <h1 className="text-6xl font-bold text-white mb-8">Thank You</h1>
            <h2 className="text-3xl text-gray-200 mb-8">Questions & Discussion</h2>
            <div className="bg-white rounded-lg p-8 shadow-2xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Team Contact</h3>
              <div className="space-y-2 text-lg">
                <p>Tej Tandon • Paula Apperley • Simarprit Kaur</p>
                <p className="text-gray-600">Beedie School of Business</p>
                <p className="text-gray-600">Analytics Hackathon 2025</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Main slide content */}
      <div className="w-full h-full">
        {slides[currentSlide].content}
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg p-4">
        <button
          onClick={prevSlide}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default BCHydroHackathonSlideshow; 