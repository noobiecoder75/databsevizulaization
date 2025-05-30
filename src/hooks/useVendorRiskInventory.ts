import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { VendorRiskInventory, VendorRiskInventoryInsert, VendorRiskInventoryUpdate } from '../lib/types';

export const useVendorRiskInventory = () => {
  const [data, setData] = useState<VendorRiskInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all vendor risk inventory records
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: inventoryData, error: fetchError } = await supabase
        .from('vendor_risk_inventory')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setData(inventoryData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Insert a new record
  const insertRecord = async (record: VendorRiskInventoryInsert) => {
    try {
      const { data: newRecord, error: insertError } = await supabase
        .from('vendor_risk_inventory')
        .insert(record)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setData(prevData => [...prevData, newRecord]);
      return { data: newRecord, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to insert record';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Update an existing record
  const updateRecord = async (id: number, updates: VendorRiskInventoryUpdate) => {
    try {
      const { data: updatedRecord, error: updateError } = await supabase
        .from('vendor_risk_inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setData(prevData => 
        prevData.map(item => item.id === id ? updatedRecord : item)
      );
      return { data: updatedRecord, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update record';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Delete a record
  const deleteRecord = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('vendor_risk_inventory')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setData(prevData => prevData.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete record';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // Search records by vendor name
  const searchByVendor = async (vendorName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: searchResults, error: searchError } = await supabase
        .from('vendor_risk_inventory')
        .select('*')
        .ilike('vendor_name', `%${vendorName}%`)
        .order('id', { ascending: true });

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

  // Filter records by risk tolerance
  const filterByRiskTolerance = async (riskTolerance: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: filteredResults, error: filterError } = await supabase
        .from('vendor_risk_inventory')
        .select('*')
        .eq('risk_tolerance_x', riskTolerance)
        .order('id', { ascending: true });

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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    insertRecord,
    updateRecord,
    deleteRecord,
    searchByVendor,
    filterByRiskTolerance,
  };
}; 