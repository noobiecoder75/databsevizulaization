import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CountryTradePartners } from '../lib/types';

export const useCountryTradePartners = () => {
  const [data, setData] = useState<CountryTradePartners[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all country trade partners records using pagination
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting to fetch all trade data...');
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('country_trade_partners')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw countError;
      }

      console.log(`Total records in database: ${count}`);

      let allData: CountryTradePartners[] = [];
      const batchSize = 1000; // Supabase's default limit
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        console.log(`Fetching batch starting at offset ${offset}...`);
        
        const { data: batchData, error: batchError } = await supabase
          .from('country_trade_partners')
          .select('*')
          .order('id', { ascending: true })
          .range(offset, offset + batchSize - 1);

        if (batchError) {
          throw batchError;
        }

        if (batchData && batchData.length > 0) {
          allData = [...allData, ...batchData];
          offset += batchSize;
          hasMore = batchData.length === batchSize; // Continue if we got a full batch
          console.log(`Fetched ${batchData.length} records. Total so far: ${allData.length}`);
        } else {
          hasMore = false;
        }
      }

      console.log(`Successfully fetched all ${allData.length} records from database`);
      setData(allData);
    } catch (err) {
      console.error('Error fetching trade data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get subcategory based on HS code
  const getSubcategoryByHsCode = (hsCode: string | null): string => {
    if (!hsCode) return 'Other';
    
    const cleanCode = hsCode.toString().trim();
    
    switch (cleanCode) {
      case '850422':
        return 'Liquid Transformer';
      case '850423':
        return 'High-Capacity Transformer';
      case '850433':
        return 'Medium Transformer';
      case '850434':
        return 'Large Transformer';
      case '853720':
        return 'Switchgear Panel';
      case '853590':
        return 'Switchgear Parts';
      case '850213':
        return 'Diesel Generator';
      case '850164':
        return 'AC Generator';
      case '850760':
        return 'Li-ion Battery';
      case '850490':
        return 'Parts';
      default:
        return 'Other';
    }
  };

  // Filter by year
  const filterByYear = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // For filtering, we can still use regular queries since the filtered results will be smaller
      const { data: filteredResults, error: filterError } = await supabase
        .from('country_trade_partners')
        .select('*')
        .eq('year', year)
        .order('import_value', { ascending: false });

      if (filterError) {
        throw filterError;
      }

      setData(filteredResults || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  // Search by reporter country
  const searchByReporter = async (reporterName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: searchResults, error: searchError } = await supabase
        .from('country_trade_partners')
        .select('*')
        .ilike('reporter_name', `%${reporterName}%`)
        .order('import_value', { ascending: false });

      if (searchError) {
        throw searchError;
      }

      setData(searchResults || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    filterByYear,
    searchByReporter,
    getSubcategoryByHsCode,
  };
}; 