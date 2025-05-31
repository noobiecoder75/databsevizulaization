import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useVendorRiskInventory } from '../hooks/useVendorRiskInventory';
import { useCountryTradePartners } from '../hooks/useCountryTradePartners';

const Tier2RiskSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: vendorData } = useVendorRiskInventory();
  const { data: tradeData } = useCountryTradePartners();

  // Helper: get equipment categories at risk sourced from USA
  const usaEquipment = useMemo(() => {
    const usaVendors = vendorData.filter(v => v.country_of_origin?.includes('United'));
    const byCategory: Record<string, number> = {};
    usaVendors.forEach(v => {
      const cat = v.category || 'Unknown';
      byCategory[cat] = (byCategory[cat] || 0) + Number(v.annual_spend || 0);
    });
    return Object.entries(byCategory)
      .map(([category, spend]) => ({ category, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  }, [vendorData]);

  // Helper: Top partner countries for a given reporter (US or Germany etc.)
  const getTopPartners = (reporter: string) => {
    const filtered = tradeData.filter(r => r.reporter_name === reporter);
    const byPartner: Record<string, number> = {};
    filtered.forEach(r => {
      const partner = r.partner_name;
      if (!partner) return;
      const val = Number(r.import_value || 0);
      byPartner[partner] = (byPartner[partner] || 0) + val;
    });
    return Object.entries(byPartner)
      .map(([partner, value]) => ({ partner, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const slides = [
    {
      id: 'title',
      content: (
        <div className="h-full flex flex-col justify-center items-center text-center bg-blue-900 text-white p-8">
          <h1 className="text-5xl font-bold mb-4">Beyond Direct Suppliers</h1>
          <h2 className="text-3xl mb-6">Unveiling Tier 2 Risks for BC Hydro</h2>
          <p className="max-w-2xl">A narrative exploring how tariff-driven risks and hidden dependencies can disrupt our supply chain.</p>
        </div>
      )
    },
    {
      id: 'usa-dependency',
      content: (
        <div className="p-12 h-full bg-gray-50">
          <h1 className="text-4xl font-bold mb-6">BC Hydro's US Dependency</h1>
          <p className="mb-4 text-gray-700">25% tariffs on US imports increase cost risk on critical equipment.</p>
          <div className="h-96 bg-white shadow rounded p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usaEquipment} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
                <YAxis dataKey="category" type="category" />
                <Tooltip formatter={(v:number)=>`$${(v/1e6).toFixed(2)}M`} />
                <Legend />
                <Bar dataKey="spend" name="BC Hydro Spend" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      id: 'usa-partners',
      content: (
        <div className="p-12 h-full bg-white">
          <h1 className="text-4xl font-bold mb-6">Where Does the USA Source Components?</h1>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTopPartners('United States of America')} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="partner" angle={-40} textAnchor="end" interval={0} />
                <YAxis tickFormatter={v=>`$${(v/1e9).toFixed(1)}B`} />
                <Tooltip formatter={(v:number)=>`$${(v/1e6).toFixed(1)}M`} />
                <Bar dataKey="value" name="Import Value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }
    // Additional slides as per plan can be added here...
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (idx:number) => setCurrentSlide(idx);

  return (
    <div className="h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="h-full">{slides[currentSlide].content}</div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        <button onClick={prevSlide} className="p-2 bg-white/30 rounded-full"><ChevronLeft/></button>
        {slides.map((_,i)=>(
          <button key={i} onClick={()=>goToSlide(i)} className={`w-3 h-3 rounded-full ${i===currentSlide?'bg-white':'bg-white/30'}`}></button>
        ))}
        <button onClick={nextSlide} className="p-2 bg-white/30 rounded-full"><ChevronRight/></button>
      </div>
    </div>
  );
};

export default Tier2RiskSlideshow; 