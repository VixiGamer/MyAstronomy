import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { MarsPhoto } from '../types';
import { Camera, Calendar, RefreshCw } from 'lucide-react';

const MarsView: React.FC = () => {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [rover, setRover] = useState<'curiosity' | 'perseverance'>('curiosity');
  // Sol 1000 is usually a good bet for photos, in a real app we'd fetch the manifest first
  const [sol, setSol] = useState(1000); 

  const fetchPhotos = async () => {
    setLoading(true);
    setPhotos([]);
    try {
      const result = await nasaService.getMarsPhotos(rover, sol);
      // Limit to 25 photos for performance
      setPhotos(result.photos.slice(0, 24));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rover, sol]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-display font-bold text-white mb-2">Mars Rovers</h2>
        <p className="text-gray-400">Esplora la superficie di Marte attraverso gli occhi dei Rover.</p>
      </div>

      {/* Controls */}
      <div className="bg-space-900/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row gap-6 justify-between items-center sticky top-24 z-20 shadow-xl transition-all">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setRover('curiosity')}
            className={`px-6 py-2 rounded-full font-display font-bold transition-all w-full sm:w-auto ${rover === 'curiosity' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
          >
            CURIOSITY
          </button>
          <button 
            onClick={() => setRover('perseverance')}
            className={`px-6 py-2 rounded-full font-display font-bold transition-all w-full sm:w-auto ${rover === 'perseverance' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
          >
            PERSEVERANCE
          </button>
        </div>

        <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-lg border border-white/5 w-full sm:w-auto justify-between sm:justify-center">
          <span className="text-gray-400 font-mono text-sm uppercase">Sol (Giorno)</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSol(Math.max(1, sol - 10))} className="text-orange-500 hover:text-white px-2 font-bold text-xl">-</button>
            <span className="w-12 text-center font-bold text-xl">{sol}</span>
            <button onClick={() => setSol(sol + 10)} className="text-orange-500 hover:text-white px-2 font-bold text-xl">+</button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-orange-400 animate-pulse">
          <RefreshCw className="animate-spin mb-4" size={32} />
          <span className="font-display text-xl">Ricezione dati da Marte...</span>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-700">
          <p className="text-xl text-gray-400">Nessuna foto trovata per il Sol {sol}. Prova un altro giorno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-space-800 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all shadow-lg hover:shadow-orange-900/20">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={photo.img_src} 
                  alt={`Mars Rover ${photo.id}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-orange-300 mb-1">
                  <Camera size={14} />
                  <span className="text-xs font-bold">{photo.camera.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  <span className="text-xs font-mono">{photo.earth_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarsView;