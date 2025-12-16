import React, { useState } from 'react';
import { ViewState } from './types';
import { Rocket, ChevronLeft } from 'lucide-react';
import StarBackground from './components/StarBackground';
import Dashboard from './Dashboard';
import ApodView from './views/ApodView';
import AsteroidsView from './views/AsteroidsView';
import MarsView from './views/MarsView';
import EpicView from './views/EpicView';
import DonkiView from './views/DonkiView';
import EonetView from './views/EonetView';
import LibraryView from './views/LibraryView';
import TechView from './views/TechView';
import GenericDataView from './views/GenericDataView';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'apod': return <ApodView />;
      case 'neows': return <AsteroidsView />;
      case 'mars': return <MarsView />;
      case 'epic': return <EpicView />;
      case 'donki': return <DonkiView />;
      case 'eonet': return <EonetView />;
      case 'library': return <LibraryView />;
      case 'tech': return <TechView />;
      // Consolidated views for complex/data-heavy APIs
      case 'exoplanet': return <GenericDataView type="exoplanet" />;
      case 'gene': return <GenericDataView type="gene" />;
      case 'ssd': return <GenericDataView type="ssd" />;
      case 'generic': return <GenericDataView type="generic" />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-space-accent selection:text-space-950 relative">
      <StarBackground />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center px-6 md:px-12 bg-space-950/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setCurrentView('dashboard')}
            >
                {/* Logo concept */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute inset-0 border-2 border-space-accent/50 rounded-full animate-spin-slow"></div>
                    <Rocket className="text-white relative z-10 transform group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="text-2xl font-display font-bold tracking-wider">{APP_NAME}</span>
            </div>

            {currentView !== 'dashboard' && (
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold tracking-wide"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">TORNA ALLA DASHBOARD</span>
                </button>
            )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-12 px-6">
        {renderView()}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm border-t border-white/5 mt-auto">
        <p>Dati forniti da <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" className="text-space-accent hover:underline">NASA Open APIs</a>.</p>
        <p className="mt-2 opacity-50">&copy; {new Date().getFullYear()} {APP_NAME}.
        <br />
        Created by Viggo Ponturo Nygaard and Google AI Studio.</p>
        <br />
        Version 1.0.2
      </footer>
    </div>
  );
};

export default App;