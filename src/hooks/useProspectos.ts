import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProspectoMkt } from '../types';

export const useProspectos = () => {
  const [prospectos, setProspectos] = useState<ProspectoMkt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspectos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prospectos_mkt')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspectos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProspecto = useCallback(async (prospectoData: Partial<ProspectoMkt>) => {
    try {
      const { data, error } = await supabase
        .from('prospectos_mkt')
        .insert([prospectoData])
        .select()
        .single();

      if (error) throw error;
      
      setProspectos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando prospecto');
      throw err;
    }
  }, []);

  const updateProspecto = useCallback(async (id: number, updates: Partial<ProspectoMkt>) => {
    try {
      console.log('[useProspectos] Updating prospecto:', id, updates);
      
      const { data, error } = await supabase
        .from('prospectos_mkt')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('[useProspectos] Prospecto updated successfully (not updating state, relying on realtime).');
      
      // No actualizamos el estado aquí, confiamos en realtime
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando prospecto');
      throw err;
    }
  }, []);

  const deleteProspecto = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('prospectos_mkt')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProspectos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando prospecto');
      throw err;
    }
  }, []);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('prospectos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prospectos_mkt'
        },
        (payload) => {
          console.log('[Realtime] Change received!', payload);
          
          if (payload.eventType === 'INSERT') {
            setProspectos(prev => [payload.new as ProspectoMkt, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProspectos(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new as ProspectoMkt : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setProspectos(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cargar prospectos inicialmente
  useEffect(() => {
    fetchProspectos();
  }, [fetchProspectos]);

  return {
    prospectos,
    loading,
    error,
    fetchProspectos,
    createProspecto,
    updateProspecto,
    deleteProspecto
  };
};