import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { EnergyUsageChart } from './charts/EnergyUsageChart';
import { EnergyDistributionChart } from './charts/EnergyDistributionChart';
import { UsageTrend } from './charts/UsageTrend';
import { WeatherWidget } from './widgets/WeatherWidget';
import { BillingWidget } from './widgets/BillingWidget';
import { SavingTipsWidget } from './widgets/SavingTipsWidget';
import { UsageSummaryCard } from './cards/UsageSummaryCard';
import { GreenImpactCard } from './cards/GreenImpactCard';
import { PageHeader } from './PageHeader';
import { DateRangePicker } from './DateRangePicker';

export const Dashboard = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const { 
    energyData, 
    energyDistribution, 
    weatherData, 
    usageTrend, 
    currentUsage, 
    savingTips,
    billingData,
    greenImpact
  } = useMockData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Energy Dashboard" 
          subtitle="Monitor your electricity usage and costs"
        />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Usage summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <UsageSummaryCard 
          title="Current Usage" 
          value={currentUsage.current} 
          unit="kWh"
          change={currentUsage.change}
          changeLabel={currentUsage.changeLabel}
        />
        <UsageSummaryCard 
          title="Estimated Bill" 
          value={billingData.estimated} 
          unit="$"
          change={billingData.change}
          changeLabel={billingData.changeLabel}
        />
        <UsageSummaryCard 
          title="Peak Demand" 
          value={currentUsage.peak} 
          unit="kW"
          change={currentUsage.peakChange}
          changeLabel={currentUsage.peakChangeLabel}
        />
        <GreenImpactCard 
          renewablePercentage={greenImpact.renewablePercentage}
          co2Reduction={greenImpact.co2Reduction}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Energy Usage</h3>
          <EnergyUsageChart data={energyData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Energy Distribution</h3>
          <EnergyDistributionChart data={energyDistribution} />
        </div>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Usage Trend</h3>
          <UsageTrend data={usageTrend} />
        </div>
        <div className="space-y-6">
          <WeatherWidget data={weatherData} />
          <BillingWidget data={billingData} />
        </div>
      </div>

      {/* Fourth row */}
      <div className="grid grid-cols-1 gap-6">
        <SavingTipsWidget tips={savingTips} />
      </div>
    </div>
  );
};