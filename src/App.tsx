import React, { useState, useEffect } from 'react';
import NavSidebar from './components/layout/NavSidebar';
import ProspectosView from './components/layout/ProspectosView';
import ConversacionesView from './components/layout/ConversacionesView';
import KommoView from './components/layout/KommoView';
import { useProspectos } from './hooks/useProspectos';
import { useConversations } from './hooks/useConversations';
import { useKommo } from './hooks/useKommo';

type AppView = 'prospectos' | 'conversaciones' | 'kommo';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('prospectos');
  const { prospectos, loading: prospectosLoading } = useProspectos();
  const { conversations, loading: conversationsLoading } = useConversations();
  const { leads, pipelines, loading: kommoLoading } = useKommo();

  const getCurrentView = () => {
    switch (currentView) {
      case 'prospectos':
        return 'Prospectos';
      case 'conversaciones':
        return 'Conversaciones';
      case 'kommo':
        return 'CRM Kommo';
      default:
        return 'Prospectos';
    }
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'prospectos':
        return (
          <ProspectosView
            prospectos={prospectos}
            loading={prospectosLoading}
            leads={leads}
            pipelines={pipelines}
          />
        );
      case 'conversaciones':
        return (
          <ConversacionesView
            conversations={conversations}
            loading={conversationsLoading}
          />
        );
      case 'kommo':
        return (
          <KommoView
            leads={leads}
            pipelines={pipelines}
            loading={kommoLoading}
          />
        );
      default:
        return (
          <ProspectosView
            prospectos={prospectos}
            loading={prospectosLoading}
            leads={leads}
            pipelines={pipelines}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NavSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        prospectosCount={prospectos.length}
        conversationsCount={conversations.length}
        leadsCount={leads.length}
      />
      <main className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getCurrentView()}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App;