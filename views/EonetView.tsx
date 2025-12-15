import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { EonetEvent } from '../types';
import { Flame, CloudRain, Mountain, Map, ExternalLink } from 'lucide-react';

const EonetView: React.FC = () => {
  const [events, setEvents] = useState<EonetEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await nasaService.getEonetEvents();
        setEvents(result.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getIcon = (category: string) => {
    const title = category.toLowerCase();
    if (title.includes('fire')) return <Flame className="text-orange-500" />;
    if (title.includes('storm')) return <CloudRain className="text-blue-400" />;
    if (title.includes('volcano')) return <Mountain className="text-red-600" />;
    return <Map className="text-gray-400" />;
  };

  if (loading) return <div className="text-rose-400 animate-pulse text-xl text-center mt-20 font-display">Scansione Superficie Terrestre...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-display font-bold text-white mb-2">EONET</h2>
        <p className="text-gray-400">Eventi naturali osservati in tempo reale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-space-800/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-space-800 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    {getIcon(event.categories[0]?.title || '')}
                </div>
                <span className="text-xs font-mono text-gray-500 px-2 py-1 bg-black/30 rounded">
                    {event.categories[0]?.title}
                </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-space-accent transition-colors">
                {event.title}
            </h3>

            <div className="space-y-2 mt-4">
                {event.geometry.slice(0, 1).map((geo, idx) => (
                    <div key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                        <Map size={14} />
                        <span>{new Date(geo.date).toLocaleDateString()}</span>
                        <span className="font-mono text-xs">
                            [{Array.isArray(geo.coordinates) ? geo.coordinates[0] : ''}, ...]
                        </span>
                    </div>
                ))}
            </div>

            {event.sources[0] && (
                <a 
                    href={event.sources[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-space-accent hover:underline opacity-60 hover:opacity-100"
                >
                    Fonte Dati <ExternalLink size={12} />
                </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EonetView;
