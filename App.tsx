import React, { useState, useMemo } from 'react';
import { Anchor, Menu, X, ChevronsDownUp } from 'lucide-react';
import VigoMap from './components/Map';
import BuoyForm from './components/BuoyForm';
import RouteSelector, { RouteId } from './components/RouteSelector';
import { Buoy } from './types';


//boias iniciais conhecidas
const INITIAL_BUOYS: Buoy[] = [
  {
    id: '1',
    name: 'Bouzas Norte',
    lat: 42.24762,
    lng: -8.74563,
    description: 'Área de saída e chegada, ao norte de Bouzas',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'La Negra',
    lat: 42.15475,
    lng: -8.88577,
    description: 'Ponto de referência costeiro a sudoeste',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Baliza Meteorológica Sur Cíes',
    lat: 42.17748,
    lng: -8.89342,
    description: 'Baliza meteorológica situada a sul das Ilhas Cíes',
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Lousal',
    lat: 42.27485,
    lng: -8.68905,
    description: 'Ponto de controle localizado a leste de Vigo',
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Tofiño',
    lat: 42.22845,
    lng: -8.77865,
    description: 'Referência próxima ao porto pesqueiro',
    createdAt: Date.now(),
  },
  {
    id: '6',
    name: 'Subrido',
    lat: 42.24283,
    lng: -8.86533,
    description: 'Marcador intermediário costeiro',
    createdAt: Date.now(),
  },
  {
    id: '7',
    name: 'Bondaña',
    lat: 42.20532,
    lng: -8.81032,
    description: 'Sinalização próxima à costa sul de Vigo',
    createdAt: Date.now(),
  },
];

// Definição dos conjuntos de boias por rota (Baseado no Nome)
const ROUTE_DEFINITIONS: Record<string, string[]> = {
  numeral1: ['Subrido', 'La Negra'],
  numeral2: ['Subrido', 'Baliza Meteorológica Sur Cíes'], // Usei o nome completo da boia existente
  numeral3: ['Lousal', 'Tofiño'],
  numeral4: ['Lousal', 'Bondaña'],
};

const App: React.FC = () => {
  const [buoys, setBuoys] = useState<Buoy[]>(INITIAL_BUOYS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteId>('all');
  const [isVisiblePanelCollapsed, setIsVisiblePanelCollapsed] = useState(false);
  const [selectedBuoyId, setSelectedBuoyId] = useState<string | null>(null);
  const [madMaxPosition, setMadMaxPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleAddBuoy = (newBuoyData: Omit<Buoy, 'id' | 'createdAt'>) => {
    const newBuoy: Buoy = {
      ...newBuoyData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setBuoys(prev => [...prev, newBuoy]);
  };

  const handleRemoveBuoy = (id: string) => {
    setBuoys(prev => prev.filter(b => b.id !== id));
  };

  // Filter buoys based on active route
  const visibleBuoys = useMemo(() => {
    if (activeRoute === 'all') {
      return buoys;
    }
    
    const requiredNames = ROUTE_DEFINITIONS[activeRoute] || [];
    return buoys.filter(buoy => requiredNames.includes(buoy.name));
  }, [buoys, activeRoute]);

  const bouzasNorteBuoy = useMemo(
    () => buoys.find(b => b.name === 'Bouzas Norte'),
    [buoys]
  );

  const routeStartPosition = madMaxPosition ?? (bouzasNorteBuoy
    ? { lat: bouzasNorteBuoy.lat, lng: bouzasNorteBuoy.lng }
    : null
  );

  const ROUTE_DEFINITIONS_WITH_START = useMemo(() => {
    if (!routeStartPosition) {
      return ROUTE_DEFINITIONS;
    }

    return {
      numeral1: [routeStartPosition, ...ROUTE_DEFINITIONS.numeral1],
      numeral2: [routeStartPosition, ...ROUTE_DEFINITIONS.numeral2],
      numeral3: [routeStartPosition, ...ROUTE_DEFINITIONS.numeral3],
      numeral4: [routeStartPosition, ...ROUTE_DEFINITIONS.numeral4],
    } as Record<string, (typeof routeStartPosition | string)[]>;
  }, [routeStartPosition]);

  // Label amigável para a primeira "boia" lógica da rota:
  // MAD MAX quando a posição do barco está activa, caso contrário Lousal
  const routeStartLabel = madMaxPosition ? 'MAD MAX' : 'Lousal';

  // Ajuda para formatar Decimal Degrees to DD° MM.MMM'
  const formatCoordinate = (val: number, isLat: boolean): string => {
    const absVal = Math.abs(val);
    const degrees = Math.floor(absVal);
    const minutes = (absVal - degrees) * 60;
    
    // Direction char (Portuguese)
    let dir = '';
    if (isLat) {
        dir = val >= 0 ? 'N' : 'S';
    } else {
        dir = val >= 0 ? 'E' : 'O'; // O for Oeste
    }
    
    return `${degrees}° ${minutes.toFixed(3)}' ${dir}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen font-sans">
      {/* Main Content - full height for map and controls */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 relative">
        
        {/* Left Sidebar - Controls */}
        {isSidebarOpen && (
          <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-1 animate-in slide-in-from-left duration-300">
            <RouteSelector 
              currentRoute={activeRoute} 
              onSelectRoute={setActiveRoute}
              startLabel={routeStartLabel}
            />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1 min-h-[200px] flex flex-col">
              <h3 className="font-semibold text-lg text-indigo-900 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>Boias Visíveis</span>
                  <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">{visibleBuoys.length}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVisiblePanelCollapsed(prev => !prev)}
                  className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ChevronsDownUp className={`w-4 h-4 transition-transform ${isVisiblePanelCollapsed ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              
              {!isVisiblePanelCollapsed && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {visibleBuoys.length === 0 ? (
                  <div className="text-center text-slate-400 py-8 text-sm">
                    Nenhuma boia encontrada para este percurso.
                  </div>
                ) : (
                  visibleBuoys.map(buoy => (
                    <div
                      key={buoy.id}
                      className="group p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer"
                      onClick={() => setSelectedBuoyId(buoy.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-slate-700">{buoy.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {formatCoordinate(buoy.lat, true)}, {formatCoordinate(buoy.lng, false)}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveBuoy(buoy.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remover marcador"
                        >
                          &times;
                        </button>
                      </div>
                      {buoy.description && (
                        <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
                          {buoy.description}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              )}
            </div>

            <BuoyForm onAddBuoy={handleAddBuoy} />
          </div>
        )}

        {/* Center - Map */}
        <div className="flex-1 rounded-xl overflow-hidden shadow-inner bg-slate-200 relative z-10 group">
          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 right-4 z-[1000] bg-white p-2.5 rounded-lg shadow-md text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={isSidebarOpen ? "Esconder Menu" : "Mostrar Menu"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Pass visibleBuoys instead of all buoys */}
          <VigoMap
            buoys={visibleBuoys}
            sidebarOpen={isSidebarOpen}
            selectedBuoyId={selectedBuoyId ?? undefined}
            activeRoute={activeRoute}
            onMadMaxLocationChange={setMadMaxPosition}
            startPosition={routeStartPosition ?? undefined}
          />
        </div>

      </main>
    </div>
  );
};

export default App;