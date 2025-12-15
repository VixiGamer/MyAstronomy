import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { Cpu, FileText, Code, ExternalLink } from 'lucide-react';

const TechView: React.FC = () => {
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await nasaService.getTechPatents();
        // The API structure returns `results` as an array of arrays.
        // Index map for TechTransfer: [id, code, title, abstract, type, category, ...]
        // Sometimes it returns objects depending on the node. assuming array based on typical response.
        if (data.results && Array.isArray(data.results)) {
            setPatents(data.results.slice(0, 30));
        }
      } catch (error) {
        console.error("Tech transfer error", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="text-slate-400 animate-pulse text-xl text-center mt-20 font-display">Download Dati Tecnologici...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="p-4 bg-slate-800 rounded-2xl">
            <Cpu size={32} className="text-slate-300" />
        </div>
        <div>
            <h2 className="text-4xl font-display font-bold text-white">TechTransfer</h2>
            <p className="text-gray-400">Brevetti e tecnologie NASA disponibili per il pubblico.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patents.length === 0 ? (
           <div className="col-span-full text-center text-gray-500">Nessun brevetto trovato al momento.</div>
        ) : (
            patents.map((patent, idx) => {
                 // Safe parsing of the array structure
                 const title = patent[2] || "Unknown Technology";
                 const id = patent[1] || "N/A";
                 const category = patent[5] || "General";
                 const img = patent[10]; // Image URL often at index 10
                 const description = patent[3] || "";

                 return (
                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors flex flex-col sm:flex-row gap-4">
                        <div className="shrink-0">
                            {img ? (
                                <img src={img} alt="Tech" className="w-20 h-20 object-cover rounded-lg bg-black border border-white/10" />
                            ) : (
                                <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                                    <FileText size={32} className="text-slate-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-mono bg-space-accent/10 text-space-accent px-2 py-0.5 rounded">{id}</span>
                                <span className="text-xs text-gray-500 uppercase border border-gray-700 px-2 py-0.5 rounded">{category}</span>
                            </div>
                            <h3 className="font-bold text-gray-200 leading-snug mb-2 line-clamp-2">{title}</h3>
                            <div 
                                className="text-xs text-gray-400 line-clamp-3 mb-2" 
                                dangerouslySetInnerHTML={{__html: description}} 
                            />
                            <a href={`https://technology.nasa.gov/patent/${id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                Scheda Completa <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                 );
            })
        )}
      </div>
    </div>
  );
};

export default TechView;