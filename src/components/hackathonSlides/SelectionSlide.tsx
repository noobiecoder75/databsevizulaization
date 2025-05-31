import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Award, Target, Globe } from 'lucide-react';
import { Colors, VendorData, LpiData } from './types';

interface SelectionSlideProps {
  colors: Colors;
  vendorData: VendorData[];
  CHART_COLORS: string[];
}

const SelectionSlide: React.FC<SelectionSlideProps> = ({ colors, vendorData, CHART_COLORS }) => {
  // Mock YoY flow trends data for relevant countries
  const yoyFlowTrends = useMemo(() => {
    const relevantCountries = ['Sweden', 'Finland', 'Brazil', 'Japan', 'Germany', 'India', 'South Korea', 'Austria', 'France'];
    
    return relevantCountries.map(country => ({
      country,
      '2020': Math.floor(Math.random() * 50) + 20,
      '2021': Math.floor(Math.random() * 60) + 30,
      '2022': Math.floor(Math.random() * 80) + 40,
      '2023': Math.floor(Math.random() * 100) + 50,
      '2024': Math.floor(Math.random() * 120) + 60,
      trend: Math.random() > 0.7 ? 'declining' : 'growing'
    }));
  }, []);

  // Updated LPI data for all relevant countries
  const comprehensiveLpiData: LpiData[] = useMemo(() => [
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

  // Prepare trend data for line chart
  const trendChartData = useMemo(() => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    return years.map(year => {
      const dataPoint: any = { year };
      yoyFlowTrends.slice(0, 6).forEach(country => { // Show top 6 countries
        dataPoint[country.country] = country[year as keyof typeof country];
      });
      return dataPoint;
    });
  }, [yoyFlowTrends]);

  return (
    <div 
      className="h-full p-8 pb-24 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.darkGreen}15 0%, ${colors.lightGrey} 50%, ${colors.teal}15 100%)` 
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-3"></div>
      </div>

      <div className="relative z-0">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.darkGreen }}>
            Strategic Supplier Selection Framework
          </h1>
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.teal }}></div>
          <p className="text-xl text-gray-600 mt-4 max-w-4xl mx-auto">
            Comprehensive country analysis and year-over-year trade trends
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/50 h-[75%]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* YoY Trends Chart */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div 
                  className="p-3 rounded-xl mr-3"
                  style={{ backgroundColor: `${colors.darkGreen}20` }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: colors.darkGreen }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  YoY Export Flow Trends (2020-2024)
                </h3>
              </div>
              
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(tick) => `$${tick}M`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`$${value}M`, name]}
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px' }}
                    />
                    <Legend />
                    {yoyFlowTrends.slice(0, 6).map((country, index) => (
                      <Line 
                        key={country.country}
                        type="monotone" 
                        dataKey={country.country} 
                        stroke={CHART_COLORS[index % CHART_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        strokeDasharray={country.trend === 'declining' ? '5 5' : undefined}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">Dashed lines indicate declining trends</p>
            </div>
            
            {/* LPI Chart */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div 
                  className="p-3 rounded-xl mr-3"
                  style={{ backgroundColor: `${colors.teal}20` }}
                >
                  <Award className="w-6 h-6" style={{ color: colors.teal }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: colors.navy }}>
                  Logistics Performance Index (All Relevant Countries)
                </h3>
              </div>
              
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comprehensiveLpiData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="country" type="category" width={80} fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px' }}
                      formatter={(value: number) => [value.toFixed(1), 'LPI Score']}
                    />
                    <Bar dataKey="lpiScore" name="LPI Score" radius={[0, 5, 5, 0]} barSize={15}>
                      {comprehensiveLpiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Strategy Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-blue-400/30">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 mr-2" />
              <h4 className="text-md font-bold">Selection Criteria</h4>
            </div>
            <ul className="text-xs space-y-1">
              <li>• High LPI scores (&gt;3.5)</li>
              <li>• Growing export trends</li>
              <li>• Political stability</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/90 to-green-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-green-400/30">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 mr-2" />
              <h4 className="text-md font-bold">Top Performers</h4>
            </div>
            <ul className="text-xs space-y-1">
              <li>• Germany: Excellent LPI</li>
              <li>• Japan: Strong reliability</li>
              <li>• Sweden: Growing exports</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/90 to-yellow-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-yellow-400/30">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 mr-2" />
              <h4 className="text-md font-bold">Emerging Options</h4>
            </div>
            <ul className="text-xs space-y-1">
              <li>• South Korea: Good LPI</li>
              <li>• Finland: Stable trends</li>
              <li>• Austria: EU advantage</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-orange-400/30">
            <div className="flex items-center mb-3">
              <Globe className="w-5 h-5 mr-2" />
              <h4 className="text-md font-bold">Strategic Focus</h4>
            </div>
            <ul className="text-xs space-y-1">
              <li>• Diversify from US</li>
              <li>• Build partnerships</li>
              <li>• Monitor trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSlide; 