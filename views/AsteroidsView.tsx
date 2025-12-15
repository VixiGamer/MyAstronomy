import React, { useEffect, useState, useRef } from 'react';
import { nasaService } from '../services/nasaService';
import { NeoFeed, Asteroid } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Ruler, Wind, Download, FileJson, FileText, ChevronDown } from 'lucide-react';

const AsteroidsView: React.FC = () => {
  const [data, setData] = useState<NeoFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      // API Limit suggests 7 days max for better performance
      const endDate = startDate; 
      
      try {
        const result = await nasaService.getAsteroids(startDate, endDate);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowDownloadMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);

  if (loading) return <div className="text-cyan-400 animate-pulse text-xl text-center mt-20 font-display">Scansione Spazio Profondo...</div>;
  if (!data) return <div className="text-red-400 text-center mt-20">Nessun dato asteroidi trovato.</div>;

  // Flatten data for the chart: Get top 10 largest asteroids of the day
  const dateKey = Object.keys(data.near_earth_objects)[0];
  const asteroids = data.near_earth_objects[dateKey] || [];
  
  const sortedAsteroids = [...asteroids]
    .sort((a, b) => b.estimated_diameter.kilometers.estimated_diameter_max - a.estimated_diameter.kilometers.estimated_diameter_max)
    .slice(0, 10)
    .map(ast => ({
      name: ast.name.replace('(', '').replace(')', ''),
      size: ast.estimated_diameter.kilometers.estimated_diameter_max,
      hazardous: ast.is_potentially_hazardous_asteroid,
      missDistance: parseFloat(ast.close_approach_data[0].miss_distance.kilometers).toLocaleString(),
      velocity: parseFloat(ast.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0)
    }));
    
  // Calculate longest name for margin
  const longestNameLength = Math.max(...sortedAsteroids.map(a => a.name.length), 0);
  // Approximate pixel height needed (8px per char approx + padding)
  const xAxisHeight = Math.max(80, longestNameLength * 8);

  const downloadUserReport = () => {
    let content = `RAPPORTO ASTEROIDI - MYASTRONOMY\n`;
    content += `Data Rilevamento: ${dateKey}\n`;
    content += `Totale Asteroidi Rilevati: ${data.element_count}\n`;
    content += `--------------------------------------------------\n\n`;

    sortedAsteroids.forEach((ast, index) => {
        content += `${index + 1}. ASTEROIDE: ${ast.name}\n`;
        content += `   - Diametro Stimato (max): ${ast.size.toFixed(3)} km\n`;
        content += `   - Velocità Relativa: ${ast.velocity} km/h\n`;
        content += `   - Distanza dalla Terra: ${ast.missDistance} km\n`;
        content += `   - Potenzialmente Pericoloso: ${ast.hazardous ? "SÌ (Attenzione)" : "No"}\n`;
        content += `\n`;
    });

    content += `--------------------------------------------------\n`;
    content += `Generato da MyAstronomy powered by NASA API\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Report_Asteroidi_${dateKey}.txt`;
    link.click();
    setShowDownloadMenu(false);
  };

  const downloadJsonData = () => {
    const jsonContent = JSON.stringify({
        date: dateKey,
        count: data.element_count,
        asteroids: sortedAsteroids.map(ast => ({
            name: ast.name,
            diameter_km: ast.size,
            velocity_kmh: parseFloat(ast.velocity),
            miss_distance_km: parseFloat(ast.missDistance.replace(/,/g, '')),
            is_hazardous: ast.hazardous
        }))
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Dati_Asteroidi_${dateKey}.json`;
    link.click();
    setShowDownloadMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-20">
        <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Monitoraggio NEO (Near Earth Objects)</h2>
            <p className="text-gray-400">Asteroidi rilevati oggi: <span className="text-space-accent font-bold">{data.element_count}</span></p>
        </div>
        
        {/* Dropdown Menu for Download */}
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 bg-space-800 hover:bg-space-700 text-white px-5 py-3 rounded-xl border border-white/10 transition-all shadow-lg hover:shadow-space-accent/20"
            >
                <Download size={18} /> 
                <span className="font-bold">Scarica Dati</span>
                <ChevronDown size={16} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-space-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                    <button 
                        onClick={downloadUserReport}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition-colors border-b border-white/5"
                    >
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                            <FileText size={20} />
                        </div>
                        <div>
                            <span className="block text-white font-bold text-sm">Report Leggibile</span>
                            <span className="block text-gray-400 text-xs">File di testo (.txt)</span>
                        </div>
                    </button>
                    <button 
                        onClick={downloadJsonData}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition-colors"
                    >
                         <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400">
                            <FileJson size={20} />
                        </div>
                        <div>
                            <span className="block text-white font-bold text-sm">Dati Tecnici</span>
                            <span className="block text-gray-400 text-xs">Formato JSON (.json)</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-space-900/50 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md h-[500px]">
        <h3 className="text-xl font-display text-gray-200 mb-4">Top 10 Asteroidi più Grandi (Diametro Max in km)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedAsteroids} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{fontSize: 12}} 
                interval={0} 
                angle={-45} 
                textAnchor="end" 
                height={xAxisHeight} 
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
              itemStyle={{ color: '#38bdf8' }}
              formatter={(value: number) => [`${value.toFixed(3)} km`, 'Diametro']}
            />
            <Bar dataKey="size" name="Diametro (km)" radius={[4, 4, 0, 0]}>
              {sortedAsteroids.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hazardous ? '#ef4444' : '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAsteroids.map((ast, idx) => (
          <div key={idx} className={`p-6 rounded-xl border backdrop-blur-sm transition-all hover:translate-y-[-4px] ${ast.hazardous ? 'bg-red-950/30 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold font-display">{ast.name}</h4>
              {ast.hazardous && <AlertTriangle className="text-red-500 animate-pulse" size={24} />}
            </div>
            
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Ruler size={16} className="text-space-accent" />
                <span>Diametro: <span className="text-white font-mono">{ast.size.toFixed(3)} km</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Wind size={16} className="text-space-accent" />
                <span>Velocità: <span className="text-white font-mono">{ast.velocity} km/h</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-space-accent flex items-center justify-center">
                  <div className="w-1 h-1 bg-space-accent rounded-full"></div>
                </div>
                <span>Distanza: <span className="text-white font-mono">{ast.missDistance} km</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AsteroidsView;