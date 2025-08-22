import React, { useState, useEffect } from 'react';
import { useKommo } from '../../hooks/useKommo';
import { KommoLead, KommoPipeline } from '../../types';

const KommoView: React.FC = () => {
  const { leads, pipelines, loading, error } = useKommo();
  const [selectedPipeline, setSelectedPipeline] = useState<KommoPipeline | null>(null);
  const [filteredLeads, setFilteredLeads] = useState<KommoLead[]>([]);

  useEffect(() => {
    if (pipelines.length > 0) {
      setSelectedPipeline(pipelines[0]);
    }
  }, [pipelines]);

  useEffect(() => {
    if (selectedPipeline) {
      const filtered = leads.filter(lead => lead.pipeline_id === selectedPipeline.id);
      setFilteredLeads(filtered);
    }
  }, [leads, selectedPipeline]);

  const getStatusColor = (statusId: number) => {
    const status = selectedPipeline?._embedded?.statuses?.find(s => s.id === statusId);
    if (!status) return 'bg-gray-500';
    
    const statusName = status.name.toLowerCase();
    if (statusName.includes('nuevo') || statusName.includes('lead')) return 'bg-blue-500';
    if (statusName.includes('progreso') || statusName.includes('fase')) return 'bg-yellow-500';
    if (statusName.includes('ganado') || statusName.includes('won')) return 'bg-green-500';
    if (statusName.includes('perdido') || statusName.includes('lost')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="kommo-view">
        <div className="kommo-card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-lg">Cargando datos de Kommo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kommo-view">
        <div className="kommo-card p-8">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">Error al conectar con Kommo</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kommo-view">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="kommo-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">CRM Kommo</h1>
              <p className="text-gray-600 mt-2">Gestión de leads y pipeline de Mayo Dental</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
              <div className="text-sm text-gray-500">Total de Leads</div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kommo-stats-card p-6">
            <div className="text-3xl font-bold">{leads.filter(l => l.price > 0).length}</div>
            <div className="text-sm opacity-90">Leads con Precio</div>
          </div>
          <div className="kommo-stats-card p-6">
            <div className="text-3xl font-bold">
              {formatPrice(leads.reduce((sum, l) => sum + (l.price || 0), 0))}
            </div>
            <div className="text-sm opacity-90">Valor Total</div>
          </div>
          <div className="kommo-stats-card p-6">
            <div className="text-3xl font-bold">
              {pipelines.length}
            </div>
            <div className="text-sm opacity-90">Pipelines</div>
          </div>
          <div className="kommo-stats-card p-6">
            <div className="text-3xl font-bold">
              {selectedPipeline?._embedded?.statuses?.length || 0}
            </div>
            <div className="text-sm opacity-90">Estados</div>
          </div>
        </div>

        {/* Pipeline y Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="kommo-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Pipeline</h3>
            <div className="space-y-3">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPipeline?.id === pipeline.id
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPipeline(pipeline)}
                >
                  <div className="font-medium text-gray-800">{pipeline.name}</div>
                  <div className="text-sm text-gray-500">
                    {pipeline._embedded?.statuses?.length || 0} estados
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads por Estado */}
          <div className="lg:col-span-2">
            <div className="kommo-card p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Leads - {selectedPipeline?.name}
              </h3>
              
              {selectedPipeline?._embedded?.statuses?.map((status) => {
                const statusLeads = filteredLeads.filter(lead => lead.status_id === status.id);
                return (
                  <div key={status.id} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700">{status.name}</h4>
                      <span className="text-sm text-gray-500">{statusLeads.length} leads</span>
                    </div>
                    
                    <div className="space-y-2">
                      {statusLeads.map((lead) => (
                        <div key={lead.id} className="kommo-lead-item p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">{lead.name}</div>
                              {lead.price > 0 && (
                                <div className="text-sm text-green-600 font-medium">
                                  {formatPrice(lead.price)}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">
                                ID: {lead.id}
                              </div>
                              {lead._embedded?.tags && lead._embedded.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {lead._embedded.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KommoView;