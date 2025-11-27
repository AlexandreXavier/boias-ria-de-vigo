import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Buoy } from '../types';

interface BuoyFormProps {
  onAddBuoy: (buoy: Omit<Buoy, 'id' | 'createdAt'>) => void;
}

const BuoyForm: React.FC<BuoyFormProps> = ({ onAddBuoy }) => {
  const [name, setName] = useState('');
  
  // Latitude state (Degrees, Minutes, Direction)
  const [latDeg, setLatDeg] = useState('');
  const [latMin, setLatMin] = useState('');
  const [latDir, setLatDir] = useState('N');

  // Longitude state (Degrees, Minutes, Direction)
  const [lngDeg, setLngDeg] = useState('');
  const [lngMin, setLngMin] = useState('');
  const [lngDir, setLngDir] = useState('W'); // Default to West for Spain

  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse numeric inputs
    const latD = parseInt(latDeg);
    const latM = parseFloat(latMin);
    const lngD = parseInt(lngDeg);
    const lngM = parseFloat(lngMin);

    if (name && !isNaN(latD) && !isNaN(latM) && !isNaN(lngD) && !isNaN(lngM)) {
      // Convert DD° MM.MMM' to Decimal Degrees for storage
      let finalLat = latD + (latM / 60);
      if (latDir === 'S') finalLat = -finalLat;

      let finalLng = lngD + (lngM / 60);
      if (lngDir === 'W') finalLng = -finalLng;

      onAddBuoy({
        name,
        lat: finalLat,
        lng: finalLng,
        description,
      });

      // Reset form
      setName('');
      setLatDeg('');
      setLatMin('');
      setLngDeg('');
      setLngMin('');
      setDescription('');
      // Keep directions as defaults
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center space-x-2 text-indigo-900 mb-2">
        <MapPin className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Adicionar Nova Boia</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Nome / ID</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Boia Vermelha A1"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Latitude Inputs */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Latitude (DD° MM.MMM')</label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="90"
              value={latDeg}
              onChange={(e) => setLatDeg(e.target.value)}
              placeholder="42"
              className="w-full pl-3 pr-6 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <span className="absolute right-2 top-2 text-slate-400 select-none">°</span>
          </div>
          <div className="flex-[1.5] relative">
            <input
              type="number"
              min="0"
              max="60"
              step="any"
              value={latMin}
              onChange={(e) => setLatMin(e.target.value)}
              placeholder="13.500"
              className="w-full pl-3 pr-6 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <span className="absolute right-2 top-2 text-slate-400 select-none">'</span>
          </div>
          <select
            value={latDir}
            onChange={(e) => setLatDir(e.target.value)}
            className="w-16 px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="N">N</option>
            <option value="S">S</option>
          </select>
        </div>
      </div>

      {/* Longitude Inputs */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Longitude (DD° MM.MMM')</label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="180"
              value={lngDeg}
              onChange={(e) => setLngDeg(e.target.value)}
              placeholder="08"
              className="w-full pl-3 pr-6 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <span className="absolute right-2 top-2 text-slate-400 select-none">°</span>
          </div>
          <div className="flex-[1.5] relative">
            <input
              type="number"
              min="0"
              max="60"
              step="any"
              value={lngMin}
              onChange={(e) => setLngMin(e.target.value)}
              placeholder="45.123"
              className="w-full pl-3 pr-6 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <span className="absolute right-2 top-2 text-slate-400 select-none">'</span>
          </div>
          <select
            value={lngDir}
            onChange={(e) => setLngDir(e.target.value)}
            className="w-16 px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="W">O</option> {/* O for Oeste */}
            <option value="E">E</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Descrição (Opcional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Estado, cor ou notas..."
          rows={2}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="w-4 h-4" />
        <span>Marcar Posição</span>
      </button>
    </form>
  );
};

export default BuoyForm;