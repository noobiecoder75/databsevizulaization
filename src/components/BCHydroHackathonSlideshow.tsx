import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Map, BarChart3, TrendingUp, Users, Shield, Target, Database, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';

const BCHydroHackathonSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: rawVendorData } = useVendorRiskInventory();

  const colors = {
    darkGreen: '#006A38',
    navy: '#004F6C',
    lightGrey: '#EBE9E8',
    teal: '#10A3C8',
    lightGreen: '#50B848',
    chartRed: '#EF4444',
    chartOrange: '#F59E0B',
    chartYellow: '#FBBF24',
    chartBlue: '#3B82F6',
    chartPurple: '#8B5CF6',
  };

  const CHART_COLORS = [colors.teal, colors.lightGreen, colors.chartOrange, colors.chartBlue, colors.chartPurple, colors.chartRed];

  const vendorData = useMemo(() => rawVendorData || [], [rawVendorData]);

  const categoryVulnerabilityData = useMemo(() => {
    if (!vendorData.length) return [];
    const analysis = vendorData.reduce((acc, vendor) => {
      const category = vendor.category || 'Unknown';
      const leadTime = Number(vendor.average_lead_time_days || 0);
      const spend = Number(vendor.annual_spend || 0);
      const supplierId = String(vendor.vendor_number || `unknown_supplier_${category}`);

      if (!acc[category]) {
        acc[category] = { totalLeadTime: 0, totalSpend: 0, supplierSet: new Set<string>(), count: 0 };
      }
      acc[category].totalLeadTime += leadTime;
      acc[category].totalSpend += spend;
      acc[category].supplierSet.add(supplierId);
      acc[category].count++;
      return acc;
    }, {} as Record<string, { totalLeadTime: number; totalSpend: number; supplierSet: Set<string>; count: number }>);

    return Object.entries(analysis).map(([name, data]) => {
      const avgLeadTime = data.count > 0 ? data.totalLeadTime / data.count : 0;
      const numSuppliers = data.supplierSet.size;
      const score = (avgLeadTime / 10) + (5 / (numSuppliers || 1)) * 5 + (data.totalSpend / 1000000);
      return {
        name: name.length > 15 ? name.substring(0,15) + "..." : name,
        avgLeadTime,
        numSuppliers,
        totalSpend: data.totalSpend,
        vulnerabilityScore: score
      };
    }).sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore).slice(0, 5);
  }, [vendorData]);

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
  
  const globalAlternativesChartData = useMemo(() => {
    if (!vendorData.length) return [];
    const criticalCategories = ['Switchgear', 'Transformers', 'Generators'];
    const sourcing: { category: string; country: string; spend: number }[] = [];

    vendorData.forEach(vendor => {
      const category = vendor.category || 'Unknown';
      if (criticalCategories.includes(category) && vendor.country_of_origin && vendor.country_of_origin !== 'USA') {
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

    return chartFormattedData.sort((a,b) => Object.values(b).reduce((s:number,v:any) => s + (typeof v === 'number' ? v : 0),0) - Object.values(a).reduce((s:number,v:any) => s + (typeof v === 'number' ? v : 0),0)).slice(0,5);
}, [vendorData]);


  const mockLpiData = useMemo(() => [
    { country: 'Germany', lpiScore: 4.2, color: colors.teal, rankText: 'Excellent' },
    { country: 'Netherlands', lpiScore: 4.1, color: colors.teal, rankText: 'Excellent' },
    { country: 'Japan', lpiScore: 4.0, color: colors.lightGreen, rankText: 'Very Good' },
    { country: 'Sweden', lpiScore: 3.9, color: colors.lightGreen, rankText: 'Very Good' },
    { country: 'South Korea', lpiScore: 3.6, color: colors.chartYellow, rankText: 'Good' },
    { country: 'Canada', lpiScore: 3.7, color: colors.chartYellow, rankText: 'Good' },
  ].sort((a,b) => b.lpiScore - a.lpiScore), [colors]);

  if (vendorData.length === 0 && !rawVendorData) {
      return <div className="h-full w-full flex justify-center items-center text-white text-2xl bg-gray-800">Loading Presentation Data...</div>;
  }
  
  const slides = [
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
    {
      id: 'vulnerability',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
          <h1 className="text-5xl font-bold mb-6 text-white">Category Vulnerability Analysis</h1>
          <div className="bg-white rounded-lg p-6 shadow-lg h-[85%] flex flex-col">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Most Vulnerable Categories</h2>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-[400px] md:h-auto">
              {vendorData.length === 0 && rawVendorData ? <div className="flex items-center justify-center h-full text-gray-500">No vendor data processed.</div> :
                categoryVulnerabilityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryVulnerabilityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
                      <XAxis type="number" domain={[0, 'dataMax + 20']} stroke="#718096"/>
                      <YAxis dataKey="name" type="category" width={100} stroke="#718096"/>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', borderColor: colors.teal }}
                        formatter={(value: number, name: string) => {
                            if (name === "Vulnerability Score") return [value.toFixed(2), "Score"];
                            if (name === "Avg. Lead Time (Days)") return [value.toFixed(0) + " days", "Avg Lead Time"];
                            if (name === "Number of Suppliers") return [value, "Suppliers"];
                            return [value, name];
                        }}
                      />
                      <Legend wrapperStyle={{paddingTop: "10px"}}/>
                      <Bar dataKey="vulnerabilityScore" name="Vulnerability Score" fill={colors.chartRed} background={{ fill: '#eee', opacity: 0.5 }} radius={[0, 5, 5, 0]} barSize={20}/>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">Insufficient data for vulnerability chart or no vulnerable categories found.</p>
                )}
              </div>
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="bg-gray-50 rounded p-4 space-y-3">
                  <h3 className="text-xl font-semibold mb-2" style={{color: colors.navy}}>Key Insights</h3>
                  <div className="p-3 bg-red-50 border-l-4 border-red-500">
                    <strong style={{color: colors.chartRed}}>High Vulnerability:</strong> Categories with high scores indicate greater risk from lead times, supplier concentration, and spend.
                  </div>
                  {categoryVulnerabilityData.length > 0 && (
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                        <strong>Focus on:</strong> {categoryVulnerabilityData[0]?.name} appears most vulnerable.
                    </div>
                  )}
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-500">
                    <strong>Factors:</strong> Longer lead times, fewer suppliers, and high spend elevate risk.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tariff',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-6" style={{ color: colors.darkGreen }}>What if USA Tariffs Rise to 25%?</h1>
          <div className="bg-white rounded-lg p-6 shadow-lg h-[85%] flex flex-col">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: colors.navy }}>Projected Impact by Category (Top 5)</h2>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-[400px] md:h-auto">
              {vendorData.length === 0 && rawVendorData ? <div className="flex items-center justify-center h-full text-gray-500">No vendor data processed.</div> :
                tariffImpactData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tariffImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
                      <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} stroke="#718096"/>
                      <YAxis label={{ value: 'Affected Spend ($)', angle: -90, position: 'insideLeft', fill: '#4A5568' }} stroke="#718096" tickFormatter={(tick) => `$${(tick/1000000).toFixed(0)}M`}/>
                      <Tooltip
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, "Affected Spend"]}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', borderColor: colors.chartOrange }}
                      />
                      <Legend verticalAlign="top" wrapperStyle={{paddingBottom: "10px"}}/>
                      <Bar dataKey="affectedSpend" name="25% Tariff Impact" fill={colors.chartOrange} radius={[5, 5, 0, 0]} barSize={30}/>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">No US-sourced spend data found for tariff impact chart.</p>
                )}
              </div>
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="h-full bg-red-50 rounded p-4 border-2 border-red-200 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-3 text-red-800">Critical Alert</h3>
                  <div className="space-y-3 text-md">
                    <p><strong>Total Potential Impact (Top 5 shown):</strong> Significant increase in costs.</p>
                     <p><strong>Timeline:</strong> Immediate effect on new contracts.</p>
                    <p><strong>Risk Level:</strong> HIGH - Supply shock potential.</p>
                    <div className="mt-4 p-3 bg-white rounded border-2 border-red-300">
                      <h4 className="font-semibold text-red-700 mb-1">Urgent Action Required:</h4>
                      <p className="text-sm">Diversification strategy needed immediately to mitigate tariff exposure for key categories.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
        id: 'alternatives',
        content: (
          <div className="h-full p-12" style={{ backgroundColor: colors.navy }}>
            <h1 className="text-5xl font-bold mb-6 text-white">Global Supply Alternatives</h1>
            <div className="bg-white rounded-lg p-6 shadow-lg h-[85%]">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: colors.darkGreen }}>Diversification Opportunities</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="h-[400px] lg:h-full">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.navy }}>Current Non-US Sourcing Spend (Critical Categories)</h3>
                  {vendorData.length === 0 && rawVendorData ? <div className="flex items-center justify-center h-full text-gray-500">No vendor data processed.</div> :
                  globalAlternativesChartData.length > 0 ? (
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
                  ) : <p className="text-center text-gray-500">No significant non-US sourcing data for critical items to display.</p>}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.navy }}>Potential Sourcing Countries by LPI</h3>
                   <div className="overflow-x-auto bg-gray-50 p-3 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LPI Score</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockLpiData.map((country) => (
                          <tr key={country.country}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{country.country}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{country.lpiScore.toFixed(1)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <span style={{ backgroundColor: country.color, color: 'white' }} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                {country.rankText}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Consider countries with high LPI for reliable logistics. Further analysis needed for specific category capabilities and tariffs.</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
    {
      id: 'selection',
      content: (
        <div className="h-full p-12" style={{ backgroundColor: colors.lightGrey }}>
          <h1 className="text-5xl font-bold mb-6" style={{ color: colors.darkGreen }}>Strategic Supplier Selection</h1>
          <div className="bg-white rounded-lg p-6 shadow-lg h-[85%] flex flex-col">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: colors.navy }}>Evaluation Framework: LPI Focus</h2>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-[400px] md:h-auto">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockLpiData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="country" type="category" width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', borderColor: colors.teal }} formatter={(value: number) => [value.toFixed(1), 'LPI Score']}/>
                        <Bar dataKey="lpiScore" name="LPI Score" radius={[0, 5, 5, 0]} barSize={25}>
                        {mockLpiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
              </div>
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="bg-gray-50 rounded p-4 space-y-3">
                  <h3 className="text-xl font-semibold mb-2" style={{color: colors.navy}}>Key Considerations</h3>
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-500">
                    <strong style={{color: colors.chartBlue}}>Logistics Performance (LPI):</strong> Higher LPI indicates better customs, infrastructure, and timeliness.
                  </div>
                  <div className="p-3 bg-green-50 border-l-4 border-green-500">
                    <strong>Ease of Doing Business:</strong> (Data previously available) Important for regulatory environment and trade facilitation. (Note: Currently using LPI as primary focus).
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                    <strong>Other Factors:</strong> Also consider trade relationships, political stability, and specific vendor capabilities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
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
                    <p className="text-sm text-gray-600">HS code-specific tariff rates (Conceptual)</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">World Bank LPI</h4>
                    <p className="text-sm text-gray-600">Logistics performance indicators (Conceptual)</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold">UN Comtrade</h4>
                    <p className="text-sm text-gray-600">International trade statistics (Conceptual)</p>
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
      <div className="w-full h-full">
        {slides[currentSlide].content}
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg p-4">
        <button
          onClick={prevSlide}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-6 right-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default BCHydroHackathonSlideshow; 