import React from 'react';
import { ViewState } from '../types';
import { NAV_ITEMS } from '../constants';
import * as LucideIcons from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 drop-shadow-lg">
          Esplora l'Universo
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Seleziona una categoria per visualizzare i dati in tempo reale direttamente dai laboratori NASA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {NAV_ITEMS.map((item) => {
          // Dynamic icon rendering
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (LucideIcons as any)[item.iconName] || LucideIcons.Rocket;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative h-64 w-full rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(56,189,248,0.15)] text-left focus:outline-none focus:ring-2 focus:ring-space-accent"
            >
              {/* Card Background with Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="absolute inset-0 bg-space-900/60 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-colors"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="text-white" size={28} />
                </div>

                <div className="space-y-2 transform transition-transform duration-500 group-hover:translate-x-2">
                  <h3 className="text-3xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                    {item.label}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-200 leading-relaxed text-sm md:text-base pr-8">
                    {item.description}
                  </p>
                </div>

                <LucideIcons.ArrowRight className="absolute bottom-8 right-8 text-white/30 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" size={32} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;