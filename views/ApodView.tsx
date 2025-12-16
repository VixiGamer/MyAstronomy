import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { ApodData } from '../types';
import { Info, Maximize2, Download, Loader2, Calendar, ExternalLink } from 'lucide-react';

const ApodView: React.FC = () => {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  // Date state
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const loadData = async (dateStr?: string) => {
    setLoading(true);
    setData(null); // Clear previous data to show loading state nicely
    try {
      const result = await nasaService.getApod(dateStr);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      setSelectedDate(newDate);
      if(newDate) {
          loadData(newDate);
      }
  };

  const getPastDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const formatDateLabel = (dateStr: string) => {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}`;
  };

  const handleDateClick = (dateStr: string) => {
      setSelectedDate(dateStr);
      loadData(dateStr);
  };

  const downloadImage = async () => {
    if (!data || data.media_type !== 'image' || downloading) return;
    
    setDownloading(true);
    const imageUrl = data.hdurl || data.url;
    const filename = `apod - ${data.date}.jpg`;

    const triggerDownload = (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      triggerDownload(blob);
    } catch (e) {
      console.warn("Download diretto bloccato da CORS, tentativo con proxy...", e);
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Proxy error');
        const blob = await response.blob();
        triggerDownload(blob);
      } catch (proxyError) {
         console.error("Download fallito", proxyError);
         alert("Impossibile completare il download automatico a causa delle restrizioni di sicurezza del browser. Riprova più tardi.");
      }
    } finally {
        setDownloading(false);
    }
  };

  // Calculate past dates
  const yesterday = getPastDate(1);
  const twoDaysAgo = getPastDate(2);
  const threeDaysAgo = getPastDate(3);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* 1. API Title Section - CENTERED */}
      <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">APOD</h2>
          <p className="text-gray-400 text-lg">Astronomy Picture of the Day</p>
      </div>

      {/* 2. Search Toolbar (Standard Flow) */}
      <div className="bg-space-900/50 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 backdrop-blur-md shadow-lg">
          
          {/* Quick Filters Row */}
          <div className="grid grid-cols-4 gap-2 md:flex md:gap-3">
              <button 
                  onClick={() => handleDateClick(today)}
                  className={`h-10 px-2 md:px-4 rounded-lg font-bold text-xs md:text-sm transition-all border truncate ${selectedDate === today ? 'bg-space-accent text-space-950 border-space-accent' : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'}`}
              >
                  Oggi
              </button>
              <button 
                  onClick={() => handleDateClick(yesterday)}
                  className={`h-10 px-2 md:px-4 rounded-lg font-bold text-xs md:text-sm transition-all border truncate ${selectedDate === yesterday ? 'bg-space-accent text-space-950 border-space-accent' : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'}`}
              >
                  Ieri
              </button>
              <button 
                  onClick={() => handleDateClick(twoDaysAgo)}
                  className={`h-10 px-2 md:px-3 rounded-lg font-mono text-xs md:text-sm transition-all border truncate ${selectedDate === twoDaysAgo ? 'bg-space-accent text-space-950 border-space-accent' : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'}`}
              >
                  {formatDateLabel(twoDaysAgo)}
              </button>
              <button 
                  onClick={() => handleDateClick(threeDaysAgo)}
                  className={`h-10 px-2 md:px-3 rounded-lg font-mono text-xs md:text-sm transition-all border truncate ${selectedDate === threeDaysAgo ? 'bg-space-accent text-space-950 border-space-accent' : 'bg-white/5 text-gray-300 border-transparent hover:bg-white/10'}`}
              >
                  {formatDateLabel(threeDaysAgo)}
              </button>
          </div>

          <div className="w-px h-8 bg-white/20 mx-2 hidden md:block"></div>

          {/* Search Controls */}
          <div className="flex items-center gap-2 flex-grow w-full md:w-auto mt-2 md:mt-0">
              <div className="relative flex-grow w-full md:w-auto">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-space-accent pointer-events-none" size={16} />
                  <input 
                    type="date" 
                    max={today}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="bg-black/40 border border-white/20 rounded-lg pl-10 pr-3 text-white text-sm focus:outline-none focus:border-space-accent focus:bg-space-900/50 h-10 w-full md:w-48 font-mono transition-colors"
                  />
              </div>
          </div>

           {/* Archive Link */}
           <a 
            href="https://apod.nasa.gov/apod/archivepixFull.html" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/10 w-full md:w-auto justify-center md:justify-start mt-2 md:mt-0"
            title="Archivio Completo NASA"
          >
              <span className="text-sm font-bold">Archivio Completo</span>
              <ExternalLink size={18} />
          </a>
      </div>

      {/* 3. Main Content */}
      <div className="min-h-[50vh]">
        {loading ? (
            <div className="text-cyan-400 animate-pulse text-xl text-center font-display h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin" />
                    <span>Caricamento Dati Spaziali...</span>
                </div>
            </div>
        ) : !data ? (
            <div className="text-red-400 text-center p-8 bg-white/5 rounded-xl border border-red-500/20">
                <p className="text-xl mb-2">Impossibile caricare l'immagine per questa data.</p>
                <button onClick={() => handleDateClick(today)} className="text-sm underline text-red-300 hover:text-white">Torna a Oggi</button>
            </div>
        ) : (
          <>
              {/* Photo Title & Date (Outside Image) */}
              <div className="flex flex-col border-l-4 border-space-accent pl-6 py-2 mb-6">
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-wide uppercase leading-tight">
                      {data.title}
                  </h1>
                  <p className="text-space-accent font-mono text-xl md:text-2xl mt-2 font-bold">
                      {data.date}
                  </p>
              </div>

              {/* Media Section - Full Width */}
              <div className="w-full bg-space-900/50 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm relative group animate-fade-in mb-8">
                  {data.media_type === 'image' ? (
                      <img 
                      src={data.hdurl || data.url} 
                      alt={data.title} 
                      className="w-full h-auto object-contain max-h-[85vh]"
                      />
                  ) : (
                      <div className="aspect-video w-full">
                      <iframe 
                          src={data.url} 
                          title={data.title}
                          className="w-full h-full" 
                          allowFullScreen
                      />
                      </div>
                  )}
                  
                  {/* Controls Overlay on Hover */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                      {data.media_type === 'image' && (
                      <button 
                          onClick={downloadImage}
                          disabled={downloading}
                          className="bg-black/60 hover:bg-space-accent hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-colors disabled:opacity-50 disabled:cursor-wait shadow-lg border border-white/10"
                          title="Scarica Immagine"
                      >
                          {downloading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                      </button>
                      )}
                      {data.hdurl && (
                      <a 
                          href={data.hdurl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-black/60 hover:bg-space-accent hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-colors shadow-lg border border-white/10"
                          title="Vedi HD"
                      >
                          <Maximize2 size={24} />
                      </a>
                      )}
                  </div>
              </div>

              {/* Info Section - Below Image */}
              <div className="bg-white/5 p-8 rounded-xl border border-white/5 backdrop-blur-md shadow-lg animate-fade-in">
                  <div className="flex items-center gap-2 mb-6 text-space-accent">
                  <Info size={24} />
                  <span className="text-lg uppercase tracking-widest font-bold">Spiegazione Scientifica</span>
                  </div>
                  
                  <p className="text-gray-200 leading-relaxed text-justify text-lg md:text-xl font-light">
                  {data.explanation}
                  </p>
                  
                  {data.copyright && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-left">
                      <p className="text-sm text-gray-500 font-mono">
                      Image Credit & Copyright: <span className="text-gray-300 font-bold">{data.copyright}</span>
                      </p>
                  </div>
                  )}
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApodView;