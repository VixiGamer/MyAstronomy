import React from 'react';
import { ViewState } from './types';
import { NAV_ITEMS } from './constants';
import * as LucideIcons from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="text-center mb-16 space-y-4 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 drop-shadow-lg pb-2">
          MyAstronomy
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto px-4">
          Esplora l'intero catalogo API della NASA. Dallo spazio profondo alla tecnologia terrestre.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {NAV_ITEMS.map((item) => {
          // Dynamic icon rendering
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (LucideIcons as any)[item.iconName] || LucideIcons.Rocket;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative h-64 w-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] text-left focus:outline-none focus:ring-2 focus:ring-space-accent"
            >
              {/* Card Background with Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="absolute inset-0 bg-space-900/60 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-colors"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                        <Icon className="text-white" size={24} />
                    </div>
                    <LucideIcons.ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" size={20} />
                </div>

                <div className="mt-auto">
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                    {item.label}
                  </h3>
                  {/* Increased font size slightly as requested (+2px roughly equates to jumping from text-sm to text-base in Tailwind) */}
                  <p className="text-gray-400 text-base line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;