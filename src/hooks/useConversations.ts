import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ConversacionMkt, MensajeMkt } from '../types';

export const useConversations = () => {
  const [conversaciones, setConversaciones] = useState<ConversacionMkt[]>([]);
  const [mensajes, setMensajes] = useState<MensajeMkt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversaciones = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversaciones_mkt')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversaciones(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMensajes = useCallback(async (conversacionId: number) => {
    try {
      const { data, error } = await supabase
        .from('mensajes_mkt')
        .select('*')
        .eq('conversacion_id', conversacionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando mensajes');
      return [];
    }
  }, []);

  const createConversacion = useCallback(async (prospectoId: number) => {
    try {
      const { data, error } = await supabase
        .from('conversaciones_mkt')
        .insert([{
          prospecto_id: prospectoId,
          estado: 'activa'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setConversaciones(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando conversación');
      throw err;
    }
  }, []);

  const addMensaje = useCallback(async (conversacionId: number, contenido: string, tipo: 'entrada' | 'salida') => {
    try {
      const { data, error } = await supabase
        .from('mensajes_mkt')
        .insert([{
          conversacion_id: conversacionId,
          contenido,
          tipo
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Actualizar la conversación
      await supabase
        .from('conversaciones_mkt')
        .update({ 
          updated_at: new Date().toISOString(),
          ultima_actividad: new Date().toISOString()
        })
        .eq('id', conversacionId);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error agregando mensaje');
      throw err;
    }
  }, []);

  const updateConversacionEstado = useCallback(async (id: number, estado: string) => {
    try {
      const { data, error } = await supabase
        .from('conversaciones_mkt')
        .update({ estado })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setConversaciones(prev => 
        prev.map(c => c.id === id ? data : c)
      );
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando conversación');
      throw err;
    }
  }, []);

  // Polling para actualizaciones de conversaciones
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[useConversations] Polling for conversation updates...');
      fetchConversaciones();
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [fetchConversaciones]);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('conversaciones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversaciones_mkt'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConversaciones(prev => [payload.new as ConversacionMkt, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setConversaciones(prev => 
              prev.map(c => c.id === payload.new.id ? payload.new as ConversacionMkt : c)
            );
          } else if (payload.eventType === 'DELETE') {
            setConversaciones(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cargar conversaciones inicialmente
  useEffect(() => {
    fetchConversaciones();
  }, [fetchConversaciones]);

  return {
    conversaciones,
    mensajes,
    loading,
    error,
    fetchConversaciones,
    fetchMensajes,
    createConversacion,
    addMensaje,
    updateConversacionEstado
  };
};