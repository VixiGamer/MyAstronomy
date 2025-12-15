import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { DonkiNotification } from '../types';
import { Sun, AlertCircle, Calendar } from 'lucide-react';

const DonkiView: React.FC = () => {
  const [data, setData] = useState<DonkiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await nasaService.getDonkiNotifications();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="text-yellow-400 animate-pulse text-xl text-center mt-20 font-display">Analisi Attività Solare...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-display font-bold text-white mb-2">Space Weather (DONKI)</h2>
        <p className="text-gray-400">Database di Notifiche, Conoscenza e Informazioni Meteo Spaziale</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.length === 0 ? (
          <div className="text-center text-gray-500">Nessuna notifica recente.</div>
        ) : (
          data.slice(0, 15).map((note, idx) => (
            <div key={note.messageID} className="bg-space-900/60 border border-yellow-500/20 p-6 rounded-xl hover:border-yellow-500/50 transition-all max-w-full">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0 hidden md:block">
                  <Sun size={24} />
                </div>
                <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white truncate">{note.messageType}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-mono mt-1 md:mt-0">
                      <Calendar size={14} />
                      {note.messageIssueTime}
                    </div>
                  </div>
                  {/* Fixed overflow issue for mobile */}
                  <div className="prose prose-invert max-w-full w-full text-sm text-gray-300 bg-black/20 p-4 rounded-lg font-mono whitespace-pre-wrap break-words h-40 overflow-y-auto custom-scrollbar">
                    {note.messageBody}
                  </div>
                  <a 
                    href={note.messageURL} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-yellow-400 hover:text-yellow-300 text-sm font-bold uppercase tracking-wider"
                  >
                    Vedi Dettagli NASA <AlertCircle size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonkiView;