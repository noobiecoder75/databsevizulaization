import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useMockData = () => {
  const [data, setData] = useState({
    energyData: [
      { day: 'Mon', usage: 22, average: 20 },
      { day: 'Tue', usage: 18, average: 19 },
      { day: 'Wed', usage: 25, average: 21 },
      { day: 'Thu', usage: 27, average: 22 },
      { day: 'Fri', usage: 30, average: 24 },
      { day: 'Sat', usage: 24, average: 20 },
      { day: 'Sun', usage: 16, average: 18 }
    ],
    energyDistribution: [
      { label: 'HVAC', value: 42, color: '#2563eb' },
      { label: 'Kitchen', value: 21, color: '#16a34a' },
      { label: 'Lights', value: 15, color: '#eab308' },
      { label: 'Electronics', value: 12, color: '#ef4444' },
      { label: 'Other', value: 10, color: '#6b7280' }
    ],
    usageTrend: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const formattedDate = `${month}/${day}`;
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseValue = isWeekend ? 15 : 22;
      const randomVariation = Math.random() * 10 - 5;
      const value = Math.max(5, baseValue + randomVariation);
      
      return { date: formattedDate, value };
    }),
    weatherData: {
      temperature: 14,
      condition: 'cloudy',
      humidity: 65,
      wind: 12,
      impact: 'Current cloudy weather may increase heating needs by 15%. Consider adjusting your thermostat.',
      forecast: [
        { day: 'Tue', temperature: 16, condition: 'sunny' },
        { day: 'Wed', temperature: 18, condition: 'sunny' },
        { day: 'Thu', temperature: 15, condition: 'rainy' },
        { day: 'Fri', temperature: 12, condition: 'cloudy' }
      ]
    },
    currentUsage: {
      current: 162.4,
      change: -8.5,
      changeLabel: 'vs last month',
      peak: 4.2,
      peakChange: 2.1,
      peakChangeLabel: 'vs last week'
    },
    billingData: {
      dueDate: 'May 15, 2025',
      amount: 124.87,
      estimated: 118.32,
      isPaid: true,
      change: -5.2,
      changeLabel: 'vs last month'
    },
    savingTips: [
      {
        id: 1,
        title: 'Optimize your thermostat',
        description: 'Lower your thermostat by 1-2 degrees in winter and raise it by 1-2 degrees in summer to save on heating and cooling costs.',
        savingsEstimate: 'Up to $15/month',
        icon: 'thermostat'
      },
      {
        id: 2,
        title: 'Switch to LED lighting',
        description: 'Replace traditional incandescent bulbs with LED lights to reduce energy consumption for lighting by up to 80%.',
        savingsEstimate: 'Up to $10/month',
        icon: 'light'
      },
      {
        id: 3,
        title: 'Use appliances during off-peak hours',
        description: 'Run your dishwasher, washing machine, and dryer during off-peak hours (typically evenings and weekends) to take advantage of lower rates.',
        savingsEstimate: 'Up to $8/month',
        icon: 'timer'
      },
      {
        id: 4,
        title: 'Unplug idle electronics',
        description: 'Many devices continue to draw power even when turned off. Unplug chargers, TVs, and other electronics when not in use.',
        savingsEstimate: 'Up to $7/month',
        icon: 'power'
      }
    ],
    greenImpact: {
      renewablePercentage: 42,
      co2Reduction: 1245
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // These will be replaced with actual data once you create the tables
        const { data: energyData } = await supabase
          .from('energy_usage')
          .select('*')
          .order('day');

        const { data: distributionData } = await supabase
          .from('energy_distribution')
          .select('*');

        // Update with real data when available
        if (energyData && distributionData) {
          setData(prevData => ({
            ...prevData,
            // energyData: energyData,
            // energyDistribution: distributionData,
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};