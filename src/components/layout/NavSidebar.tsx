import React from 'react';
import { Users, MessageCircle, BarChart3, Building2 } from 'lucide-react';
import { AppView } from '../../types';

interface NavSidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const NavSidebar: React.FC<NavSidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    {
      id: 'prospectos' as AppView,
      label: 'Prospectos',
      icon: Users,
      description: 'Gestión de prospectos y leads'
    },
    {
      id: 'conversaciones' as AppView,
      label: 'Conversaciones',
      icon: MessageCircle,
      description: 'Historial de conversaciones'
    },
    {
      id: 'dashboard' as AppView,
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Métricas y estadísticas'
    },
    {
      id: 'kommo' as AppView,
      label: 'CRM Kommo',
      icon: Building2,
      description: 'Visualización de leads en Kommo'
    }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Mayo Dental</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor de Marketing</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center text-xs text-gray-400">
          <p>Desarrollado por</p>
          <p className="font-medium text-gray-300">Novai Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;