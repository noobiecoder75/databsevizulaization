import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, DollarSign, Globe, TrendingDown } from 'lucide-react';
import { Colors, VendorData, TariffImpactData } from './types';

interface TariffSlideProps {
  colors: Colors;
  vendorData: VendorData[];
  CHART_COLORS?: string[];
}

const TariffSlide: React.FC<TariffSlideProps> = ({ colors, vendorData, CHART_COLORS }) => {
  const tariffImpactData = useMemo(() => {
    if (!vendorData.length) return [];
    const usSourcedSpend = vendorData.reduce((acc, vendor) => {
      if (vendor.country_of_origin === 'USA') {
        const category = vendor.category || 'Unknown';
        const spend = Number(vendor.annual_spend || 0);
        if (!acc[category]) {
          acc[category] = { totalSpend: 0, affectedSpend: 0 };
        }
        acc[category].totalSpend += spend;
        acc[category].affectedSpend += spend * 0.25;
      }
      return acc;
    }, {} as Record<string, { totalSpend: number; affectedSpend: number }>);

    return Object.entries(usSourcedSpend)
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0,15) + "..." : name,
        affectedSpend: data.affectedSpend,
        usTotalSpend: data.totalSpend
      }))
      .filter(item => item.affectedSpend > 0)
      .sort((a,b) => b.affectedSpend - a.affectedSpend)
      .slice(0,5);
  }, [vendorData]);

  // Stacked bar chart data for annual spend by country
  const spendByCountryData = useMemo(() => {
    if (!vendorData.length) return [];
    
    const criticalCategories = ['Switchgear', 'Transformers', 'Generators', 'Cables', 'Protection Equipment'];
    const countrySpendByCategory = vendorData.reduce((acc, vendor) => {
      const country = vendor.country_of_origin || 'Unknown';
      const category = vendor.category || 'Other';
      const spend = Number(vendor.annual_spend || 0);
      
      if (spend > 0 && criticalCategories.includes(category)) {
        if (!acc[country]) {
          acc[country] = {};
        }
        if (!acc[country][category]) {
          acc[country][category] = 0;
        }
        acc[country][category] += spend;
      }
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const chartData = Object.entries(countrySpendByCategory)
      .map(([country, categories]) => {
        const countryData: any = { country };
        let totalSpend = 0;
        Object.entries(categories).forEach(([category, spend]) => {
          countryData[category] = spend;
          totalSpend += spend;
        });
        countryData.totalSpend = totalSpend;
        return countryData;
      })
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 6);

    return chartData;
  }, [vendorData]);

  const defaultColors = ['#17A2B8', '#28A745', '#FF6B35', '#007BFF', '#6F42C1', '#E31837'];
  const chartColors = CHART_COLORS || defaultColors;

  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.chartRed}15 0%, ${colors.lightGrey} 50%, ${colors.chartOrange}15 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-3"></div>
      </div>

      <div className="relative z-0">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.chartRed }}>
            Tariff Impact & Trade Analysis
          </h1>
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.chartOrange }}></div>
          <p className="text-xl text-gray-600 mt-4 max-w-4xl mx-auto">
            Understanding the financial implications of trade policy changes
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/50 h-[75%]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tariff Impact Chart */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div 
                  className="p-3 rounded-xl mr-3"
                  style={{ backgroundColor: `${colors.chartRed}20` }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: colors.chartRed }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  25% US Tariff Impact by Category
                </h2>
              </div>
              
              <div className="h-[350px]">
                {vendorData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">No vendor data processed.</div>
                ) : tariffImpactData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tariffImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
                      <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} stroke="#718096" fontSize={11}/>
                      <YAxis 
                        label={{ value: 'Affected Spend ($)', angle: -90, position: 'insideLeft', fill: '#4A5568' }} 
                        stroke="#718096" 
                        tickFormatter={(tick) => `$${(tick/1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, "Tariff Impact"]}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', borderColor: colors.chartOrange }}
                      />
                      <Bar 
                        dataKey="affectedSpend" 
                        name="25% Tariff Impact" 
                        fill={colors.chartOrange} 
                        radius={[5, 5, 0, 0]} 
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">No US-sourced spend data found for tariff impact chart.</p>
                )}
              </div>
            </div>
            
            {/* Spend by Country Chart */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div 
                  className="p-3 rounded-xl mr-3"
                  style={{ backgroundColor: `${colors.teal}20` }}
                >
                  <Globe className="w-6 h-6" style={{ color: colors.teal }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  Annual Spend by Exporting Country (Stacked)
                </h2>
              </div>
              
              <div className="h-[350px]">
                {spendByCountryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendByCountryData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
                      <XAxis 
                        dataKey="country" 
                        angle={-25} 
                        textAnchor="end" 
                        height={60} 
                        fontSize={11}
                      />
                      <YAxis 
                        tickFormatter={(tick) => `$${(tick/1000000).toFixed(0)}M`}
                        stroke="#718096"
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`$${(value/1000000).toFixed(2)}M`, name]}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px' }}
                      />
                      <Legend />
                      {['Switchgear', 'Transformers', 'Generators', 'Cables', 'Protection Equipment'].map((category, index) => (
                        <Bar 
                          key={category} 
                          dataKey={category} 
                          name={category} 
                          stackId="a" 
                          fill={chartColors[index % chartColors.length]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">No spend data available for country analysis.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Analysis Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-500/90 to-red-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-red-400/30">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <h3 className="text-lg font-bold">Critical Alert</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Immediate Risk:</strong> 25% tariff on US imports</p>
              <p><strong>Timeline:</strong> Affects new contracts immediately</p>
              <p><strong>Action:</strong> Diversify to alternative exporters</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-blue-400/30">
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 mr-3" />
              <h3 className="text-lg font-bold">Export Analysis</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Purpose:</strong> Identifies current exporting countries to BC Hydro</p>
              <p><strong>Insight:</strong> Shows diversification opportunities</p>
              <p><strong>Focus:</strong> Critical electrical equipment categories</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/90 to-green-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-green-400/30">
            <div className="flex items-center mb-3">
              <TrendingDown className="w-6 h-6 mr-3" />
              <h3 className="text-lg font-bold">Trade Flow Relevance</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Strategic Value:</strong> Understanding export patterns helps identify reliable suppliers</p>
              <p><strong>Diversification:</strong> Move away from US dependency to reduce tariff exposure</p>
              <p><strong>Risk Mitigation:</strong> Essential for supply chain resilience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffSlide; 