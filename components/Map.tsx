import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, Map as LeafletMap } from 'leaflet';
import * as L from 'leaflet';
import { Crosshair } from 'lucide-react';
import { Buoy } from '../types';
import './map.css';

// Fix for default Leaflet marker icons in React
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// new icon
const funny = new Icon({
  iconUrl: "http://grzegorztomicki.pl/serwisy/pin.png",
  iconSize: [50, 58], // size of the icon
  iconAnchor: [20, 58], // changed marker icon position
  popupAnchor: [0, -60], // changed popup position
});

// Icone especial para boia selecionada
const selectedIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  buoys: Buoy[];
  sidebarOpen: boolean;
  selectedBuoyId?: string;
  activeRoute: string;
  onMadMaxLocationChange?: (position: { lat: number; lng: number }) => void;
  startPosition?: { lat: number; lng: number } | null;
}

// Handler para redimensionar o mapa quando o sidebar é aberto/fechado
const ResizeHandler: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map, sidebarOpen]);

  return null;
};

// Anima a rota desenhando trechos entre as boias visíveis, na ordem em que chegam,
// e move um marcador em forma de "barco" entre as boias. Se startPosition existir,
// ela será usada como primeiro ponto lógico da rota (posição do barco ou fallback).
const RouteAnimator: React.FC<{ buoys: Buoy[]; startPosition?: { lat: number; lng: number } | null }> = ({ buoys, startPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (buoys.length < 2) return;

    const createdLines: L.Polyline[] = [];
    const positions: [number, number][] = [
      ...(startPosition ? [[startPosition.lat, startPosition.lng] as [number, number]] : []),
      ...buoys.map(b => [b.lat, b.lng] as [number, number]),
    ];
    let boatMarker: L.Marker | null = null;
    const timeouts: number[] = [];

    positions.forEach((pos, index) => {
      if (index === 0) {
        // Cria o marcador de "barco" na primeira boia
        boatMarker = L.marker(pos, { icon: funny }).addTo(map);
        return;
      }

      const from = positions[index - 1];
      const to = pos;

      const timeoutId = window.setTimeout(() => {
        // Garante que o marcador exista
        if (!boatMarker) {
          boatMarker = L.marker(from, { icon: funny }).addTo(map);
        }

        // Move o marcador para a próxima boia
        boatMarker.setLatLng(to);

        // Recentra apenas se a próxima boia estiver fora da vista atual
        const bounds = map.getBounds();
        if (!bounds.contains(to)) {
          map.panTo(to);
        }

        // Desenha o trecho entre as duas boias em vermelho
        const line = L.polyline([from, to], {
          color: '#ef4444', // vermelho
          weight: 5,
          dashArray: '10',
        }).addTo(map);

        createdLines.push(line);
      }, index * 1000); // delay entre cada trecho

      timeouts.push(timeoutId);
    });

    return () => {
      // Cancela timeouts pendentes para não desenhar linhas depois da troca de percurso
      timeouts.forEach(id => window.clearTimeout(id));
      createdLines.forEach(line => map.removeLayer(line));
      if (boatMarker) {
        map.removeLayer(boatMarker);
      }
    };
  }, [map, buoys]);

  return null;
};


// Captura a instância do mapa (react-leaflet v4/v5) e envia para o estado no componente pai
const MapInstanceObserver: React.FC<{ setMapInstance: (map: LeafletMap) => void }> = ({ setMapInstance }) => {
  const map = useMap();

  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);

  return null;
};

// Componente principal do mapa
const VigoMap: React.FC<MapProps> = ({ buoys, sidebarOpen, selectedBuoyId, activeRoute, onMadMaxLocationChange, startPosition }) => {
  // Center of Ria de Vigo
  const defaultCenter: [number, number] = [42.2328, -8.7226];
  const defaultZoom = 12;

  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const userLocationCircleRef = useRef<L.Circle | null>(null);
  const userLocationTooltipRef = useRef<L.Tooltip | null>(null);

  const handleLocateMe = () => {
    console.log('Locate me clicked');
    if (!mapInstance || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const latlng: [number, number] = [latitude, longitude];

        if (onMadMaxLocationChange) {
          onMadMaxLocationChange({ lat: latitude, lng: longitude });
        }

        // recentra o mapa na posição do utilizador
        mapInstance.flyTo(latlng, 13, { duration: 1.5 });

        // remove círculo/texto anteriores, se existirem
        if (userLocationCircleRef.current) {
          mapInstance.removeLayer(userLocationCircleRef.current);
        }
        if (userLocationTooltipRef.current) {
          mapInstance.removeLayer(userLocationTooltipRef.current);
        }

        // cria círculo de precisão
        const circle = L.circle(latlng, {
          radius: accuracy / 2,
          weight: 2,
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.1,
        });

        circle.addTo(mapInstance);

        // adiciona apenas o texto "MAD MAX" sobre a posição mais tarde
        const tooltip = L.tooltip({
          permanent: true,
          direction: 'top',
          className: 'user-location-tooltip',
        })
          .setLatLng(latlng)
          .setContent('MAD MAX :' +' Lat: '+ latlng[0] + ' Lng: '+ latlng[1]);

        tooltip.addTo(mapInstance);

        userLocationCircleRef.current = circle;
        userLocationTooltipRef.current = tooltip;
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
      }
    );
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 relative">
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-4 left-4 z-[900] bg-white/95 hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-md rounded-full px-3 py-2 flex items-center space-x-2 text-xs font-medium transition-colors"
        title="Ir para a minha localização"
      >
        <Crosshair className="w-4 h-4" />
      </button>
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <MapInstanceObserver setMapInstance={setMapInstance} />
        <ResizeHandler sidebarOpen={sidebarOpen} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {/* Animação dos trechos entre boias visíveis, na ordem do array (excepto em 'all').
            Se existir startPosition, ela é usada como primeiro ponto lógico da rota. */}
        {activeRoute !== 'all' && <RouteAnimator buoys={buoys} startPosition={startPosition} />}
        {buoys.map((buoy) => {
          const isSelected = selectedBuoyId === buoy.id;
          return (
          <Marker 
            key={buoy.id} 
            position={[buoy.lat, buoy.lng]} 
            icon={isSelected ? selectedIcon : customIcon}
            className={isSelected ? 'selected-buoy-marker' : undefined}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-indigo-900">{buoy.name}</h3>
                <p className="text-sm text-slate-600 m-0">
                  {buoy.lat.toFixed(4)}, {buoy.lng.toFixed(4)}
                </p>
                {buoy.description && (
                  <p className="text-sm text-slate-500 mt-1 italic border-t pt-1 border-slate-200">
                    {buoy.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
        })}
      </MapContainer>
    </div>
  );
};

export default VigoMap;