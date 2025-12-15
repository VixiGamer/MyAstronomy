import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { EpicImage } from '../types';
import { Globe, MapPin, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const EpicView: React.FC = () => {
  const [images, setImages] = useState<EpicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await nasaService.getEpicImages();
        setImages(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNext = () => {
    setImgLoading(true);
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setImgLoading(true);
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <div className="text-cyan-400 animate-pulse text-xl text-center mt-20 font-display">Connessione Satellite DSCOVR...</div>;
  if (!images.length) return <div className="text-red-400 text-center mt-20">Immagini Terra non disponibili.</div>;

  const currentImage = images[selectedIndex];
  const imageUrl = nasaService.getEpicImageUrl(currentImage.image, currentImage.date);

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      
      {/* Title */}
      <div className="mb-8 text-center">
         <h2 className="text-4xl font-display font-bold text-white mb-2">EPIC Earth</h2>
         <p className="text-gray-400">Earth Polychromatic Imaging Camera</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center w-full">
        {/* Main Visual */}
        <div className="relative w-full lg:w-1/2 aspect-square max-w-[600px] mx-auto group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            
            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                {imgLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                        <Loader2 className="animate-spin text-space-accent" size={48} />
                    </div>
                )}
                <img 
                    src={imageUrl} 
                    alt="Earth EPIC" 
                    onLoad={() => setImgLoading(false)}
                    className={`w-full h-full object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-opacity duration-500 ${imgLoading ? 'opacity-50' : 'opacity-100'}`}
                />
            </div>
            
            {/* Arrows */}
            <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-space-accent text-white hover:text-black rounded-full backdrop-blur-md transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-space-accent text-white hover:text-black rounded-full backdrop-blur-md transition-all"
            >
                <ChevronRight size={24} />
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full">
                {images.slice(0, 10).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (selectedIndex !== idx) setImgLoading(true);
                            setSelectedIndex(idx);
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${selectedIndex === idx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-1/2 space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Globe size={24} />
                <h2 className="text-2xl font-display font-bold">Blue Marble</h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed">
                {currentImage.caption}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
                    <Clock className="text-space-accent" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Data e Ora</p>
                        <p className="font-mono text-white">{currentImage.date}</p>
                    </div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
                    <MapPin className="text-space-secondary" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Centroide</p>
                        <p className="font-mono text-white">
                            Lat: {currentImage.centroid_coordinates.lat.toFixed(2)} <br/>
                            Lon: {currentImage.centroid_coordinates.lon.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
                Immagine catturata dalla fotocamera EPIC a bordo dell'osservatorio climatico dello spazio profondo NOAA (DSCOVR).
            </div>
        </div>
      </div>
    </div>
  );
};

export default EpicView;