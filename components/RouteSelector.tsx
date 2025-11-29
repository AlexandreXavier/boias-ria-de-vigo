import React from 'react';
import { Waypoints, Map } from 'lucide-react';

export type RouteId = 'all' | 'numeral1' | 'numeral2' | 'numeral3' | 'numeral4';

interface RouteSelectorProps {
  currentRoute: RouteId;
  onSelectRoute: (route: RouteId) => void;
  startLabel?: string; // nome da "boia" inicial (MAD MAX quando activo, Lousal caso contrário)
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ currentRoute, onSelectRoute, startLabel }) => {
  const start = startLabel ?? 'Lousal';

  const routes = [
    { id: 'all', label: 'Todas as Boias', sub: 'Visão Geral' },
    { id: 'numeral1', label: 'Numeral 1', sub: `${start} - Subrido - La Negra` },
    { id: 'numeral2', label: 'Numeral 2', sub: `${start} - Subrido - Met. Cíes` },
    { id: 'numeral3', label: 'Numeral 3', sub: `${start} - Lousal - Tofiño` },
    { id: 'numeral4', label: 'Numeral 4', sub: `${start} - Lousal - Bondaña` },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
      <div className="flex items-center space-x-2 text-indigo-900 mb-3">
        <Waypoints className="w-2 h-2" />
        <h3 className="font-semibold text-lg">Percursos</h3>
      </div>
      
      <div className="space-y-2">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onSelectRoute(route.id as RouteId)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all border flex flex-col ${
              currentRoute === route.id
                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className={`font-medium ${currentRoute === route.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                {route.label}
              </span>
              {currentRoute === route.id && <Map className="w-4 h-4 text-indigo-600" />}
            </div>
            <span className={`text-xs ${currentRoute === route.id ? 'text-indigo-500' : 'text-slate-400'}`}>
              {route.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteSelector;