import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Colors, VendorData, GlobalAlternativesData, LpiData } from './types';

interface AlternativesSlideProps {
  colors: Colors;
  vendorData: VendorData[];
  CHART_COLORS: string[];
}

const AlternativesSlide: React.FC<AlternativesSlideProps> = ({ colors, vendorData, CHART_COLORS }) => {
  const globalAlternativesChartData = useMemo(() => {
    if (!vendorData.length) return [];
    const criticalCategories = ['Switchgear', 'Transformers', 'Generators'];
    
    // Focus on the specific countries mentioned in feedback for low risk tolerance items
    const targetCountries = ['Sweden', 'Finland', 'Brazil', 'Japan', 'Germany', 'India', 'South Korea', 'Austria', 'France'];
    const sourcing: { category: string; country: string; spend: number }[] = [];

    vendorData.forEach(vendor => {
      const category = vendor.category || 'Unknown';
      if (criticalCategories.includes(category) && vendor.country_of_origin && 
          (targetCountries.includes(vendor.country_of_origin) || vendor.country_of_origin !== 'USA')) {
        sourcing.push({
          category,
          country: vendor.country_of_origin,
          spend: Number(vendor.annual_spend || 0)
        });
      }
    });
    
    const aggregated = sourcing.reduce((acc, item) => {
        const key = `${item.category}_${item.country}`;
        if (!acc[key]) {
            acc[key] = { category: item.category, country: item.country, totalSpend: 0 };
        }
        acc[key].totalSpend += item.spend;
        return acc;
    }, {} as Record<string, { category: string; country: string; totalSpend: number }>);

    const chartFormattedData = Object.values(aggregated).reduce((acc, item) => {
        let countryEntry = acc.find(c => c.country === item.country);
        if (!countryEntry) {
            countryEntry = { country: item.country };
            acc.push(countryEntry);
        }
        countryEntry[item.category] = (countryEntry[item.category] || 0) + item.totalSpend;
        return acc;
    }, [] as Array<Record<string, any>>);

    return chartFormattedData.sort((a,b) => Object.values(b).reduce((s:number,v:any) => s + (typeof v === 'number' ? v : 0),0) - Object.values(a).reduce((s:number,v:any) => s + (typeof v === 'number' ? v : 0),0)).slice(0,8);
}, [vendorData]);

  // Updated LPI data to include all relevant countries mentioned in feedback
  const mockLpiData: LpiData[] = useMemo(() => [
    { country: 'Germany', lpiScore: 4.2, color: colors.teal, rankText: 'Excellent' },
    { country: 'Netherlands', lpiScore: 4.1, color: colors.teal, rankText: 'Excellent' },
    { country: 'Japan', lpiScore: 4.0, color: colors.lightGreen, rankText: 'Very Good' },
    { country: 'Sweden', lpiScore: 3.9, color: colors.lightGreen, rankText: 'Very Good' },
    { country: 'Austria', lpiScore: 3.8, color: colors.lightGreen, rankText: 'Very Good' },
    { country: 'Canada', lpiScore: 3.7, color: colors.chartYellow, rankText: 'Good' },
    { country: 'South Korea', lpiScore: 3.6, color: colors.chartYellow, rankText: 'Good' },
    { country: 'Finland', lpiScore: 3.5, color: colors.chartYellow, rankText: 'Good' },
    { country: 'France', lpiScore: 3.4, color: colors.chartBlue, rankText: 'Good' },
    { country: 'Brazil', lpiScore: 3.2, color: colors.chartBlue, rankText: 'Fair' },
    { country: 'India', lpiScore: 3.0, color: colors.chartOrange, rankText: 'Fair' },
  ].sort((a,b) => b.lpiScore - a.lpiScore), [colors]);

  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.darkGreen} 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-0 h-full flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-4">Global Supply Alternatives</h1>
          <div className="w-32 h-1 mx-auto rounded-full bg-yellow-400"></div>
          <p className="text-xl text-blue-100 mt-4 max-w-4xl mx-auto">
            Strategic sourcing countries for low risk tolerance items
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 flex-grow max-h-[calc(100vh-14rem)] overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Strategic Sourcing Countries for Low Risk Tolerance Items</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <div className="h-full">
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.navy }}>Current Sourcing by Target Countries (Critical Categories)</h3>
              {vendorData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">No vendor data processed.</div>
              ) : globalAlternativesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                   <BarChart data={globalAlternativesChartData} layout="vertical" margin={{top: 5, right:30, left:80, bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(tick) => `$${(tick/1000000).toFixed(1)}M`} />
                    <YAxis dataKey="country" type="category" width={80} />
                    <Tooltip formatter={(value:number, name:string) => [`$${(value/1000000).toFixed(2)}M`, name]} />
                    <Legend />
                    {['Switchgear', 'Transformers', 'Generators'].map((category, index) => (
                         <Bar key={category} dataKey={category} name={category} stackId="a" fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                   </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">Limited data for target countries. Consider expanding sourcing to recommended alternatives.</p>
              )}
            </div>
            <div className="h-full">
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.navy }}>Recommended Countries by Logistics Performance</h3>
               <div className="overflow-x-auto bg-gray-50 p-3 rounded-md max-h-[320px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LPI Score</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockLpiData.map((country) => (
                      <tr key={country.country}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{country.country}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{country.lpiScore.toFixed(1)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span style={{ backgroundColor: country.color, color: 'white' }} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {country.rankText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  <strong>Strategic Focus:</strong> These countries identified through analysis for low risk tolerance items. 
                  Prioritize those with high LPI scores and existing electrical equipment manufacturing capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativesSlide; 