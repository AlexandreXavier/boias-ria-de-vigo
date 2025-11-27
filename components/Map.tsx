import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Buoy } from '../types';

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

interface MapProps {
  buoys: Buoy[];
}

const VigoMap: React.FC<MapProps> = ({ buoys }) => {
  // Center of Ria de Vigo
  const defaultCenter: [number, number] = [42.2328, -8.7226];
  const defaultZoom = 12;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {buoys.map((buoy) => (
          <Marker 
            key={buoy.id} 
            position={[buoy.lat, buoy.lng]} 
            icon={customIcon}
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
        ))}
      </MapContainer>
    </div>
  );
};

export default VigoMap;