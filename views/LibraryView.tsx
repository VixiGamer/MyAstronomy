import React, { useState, useEffect } from 'react';
import { nasaService } from '../services/nasaService';
import { NasaImageCollection, NasaImageItem } from '../types';
import { Search, Image as ImageIcon, X, Download } from 'lucide-react';

const LibraryView: React.FC = () => {
  const [query, setQuery] = useState('Nebula');
  const [results, setResults] = useState<NasaImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<NasaImageItem | null>(null);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const data = await nasaService.searchNasaLibrary(searchTerm);
      setResults(data.collection.items.slice(0, 24)); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) performSearch(query);
  };

  // Auto search on mount
  useEffect(() => {
    performSearch('Nebula');
  }, []);

  const downloadSelected = async () => {
    if (!selectedImage) return;
    const imgLink = selectedImage.links?.find(l => l.render === 'image' || l.href.endsWith('.jpg'));
    if (!imgLink) return;

    try {
      const response = await fetch(imgLink.href);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nasa-lib-${selectedImage.data[0].nasa_id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(imgLink.href, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-4xl font-display font-bold text-white mb-6">NASA Image Library</h2>
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca immagini (es. Apollo, Saturn, Galaxy)..."
            className="w-full bg-space-900 border border-white/20 rounded-full py-4 px-8 pl-14 text-lg text-white focus:outline-none focus:border-space-accent focus:ring-1 focus:ring-space-accent transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-space-accent hover:bg-cyan-400 text-space-950 font-bold px-6 rounded-full transition-colors"
          >
            Cerca
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {results.map((item, idx) => {
            const imgLink = item.links?.find(l => l.render === 'image' || l.href.endsWith('.jpg'));
            if (!imgLink) return null;

            return (
              <div 
                key={idx} 
                className="break-inside-avoid bg-space-800 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all group relative cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={imgLink.href} 
                  alt={item.data[0].title}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h4 className="font-bold text-sm text-white line-clamp-2">{item.data[0].title}</h4>
                  <span className="text-xs text-gray-400 mt-1">{new Date(item.data[0].date_created).getFullYear()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Card Style on Mobile */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
           {/* Changed from w-full h-full to a constrained card for mobile */}
           <div className="relative w-full max-w-[90vw] md:max-w-5xl h-auto max-h-[85vh] md:max-h-[90vh] flex flex-col bg-space-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button 
                    onClick={downloadSelected}
                    className="p-2 bg-black/60 hover:bg-space-accent hover:text-black rounded-full text-white transition-colors border border-white/10"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="p-2 bg-black/60 hover:bg-red-500 rounded-full text-white transition-colors border border-white/10"
                  >
                    <X size={20} />
                  </button>
              </div>
              
              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2 relative">
                 <img 
                    src={selectedImage.links?.find(l => l.render === 'image' || l.href.endsWith('.jpg'))?.href} 
                    alt={selectedImage.data[0].title}
                    className="max-w-full max-h-full object-contain"
                 />
              </div>
              
              <div className="p-5 bg-space-900 border-t border-white/10 overflow-y-auto shrink-0 max-h-[35vh]">
                 <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-2 leading-tight break-words">{selectedImage.data[0].title}</h3>
                 <p className="text-gray-300 text-sm leading-relaxed mb-4 break-words whitespace-pre-wrap">{selectedImage.data[0].description}</p>
                 <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                    <span className="bg-white/5 px-2 py-1 rounded">ID: {selectedImage.data[0].nasa_id}</span>
                    <span className="bg-white/5 px-2 py-1 rounded">Date: {new Date(selectedImage.data[0].date_created).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;