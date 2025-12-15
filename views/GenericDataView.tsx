import React from 'react';
import { Database, ExternalLink, Activity } from 'lucide-react';

interface GenericDataProps {
  type: 'exoplanet' | 'gene' | 'ssd' | 'generic';
}

const GenericDataView: React.FC<GenericDataProps> = ({ type }) => {
  
  const getConfig = () => {
    switch(type) {
      case 'exoplanet':
        return {
          title: "NASA Exoplanet Archive",
          desc: "Accesso ai dati dei pianeti confermati e candidati.",
          links: [
            { label: "Tabella Planetaria Completa", url: "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS" },
            { label: "Grafici Interattivi", url: "https://exoplanetarchive.ipac.caltech.edu/exoplanetplots/" }
          ],
          stat: "5,500+",
          statLabel: "Pianeti Confermati"
        };
      case 'gene':
        return {
          title: "Open Science Data Repository",
          desc: "Dati di biologia spaziale da GeneLab e altre missioni.",
          links: [
            { label: "Accedi al Repository", url: "https://osdr.nasa.gov/bio/" },
            { label: "Visualizzazione Dati", url: "https://osdr.nasa.gov/bio/repo" }
          ],
          stat: "Open",
          statLabel: "Accesso Dati"
        };
      case 'ssd':
        return {
          title: "Solar System Dynamics (SSD/CNEOS)",
          desc: "Orbite, effemeridi e probabilità di impatto.",
          links: [
            { label: "JPL Horizons System", url: "https://ssd.jpl.nasa.gov/horizons/" },
            { label: "Sentry: Earth Impact Monitoring", url: "https://cneos.jpl.nasa.gov/sentry/" }
          ],
          stat: "Real-time",
          statLabel: "Calcolo Orbitale"
        };
      default:
        return {
          title: "Altri Servizi Dati NASA",
          desc: "Accesso a GIBS, TLE, SSC e Trek (WMTS).",
          links: [
            { label: "GIBS Visualization", url: "https://worldview.earthdata.nasa.gov/" },
            { label: "Vesta Trek", url: "https://trek.nasa.gov/vesta/" },
            { label: "Moon Trek", url: "https://trek.nasa.gov/moon/" },
            { label: "TLE API (Satelliti)", url: "https://tle.service.nasa.gov/" }
          ],
          stat: "Vari",
          statLabel: "Servizi"
        };
    }
  };

  const config = getConfig();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-space-900/80 border border-white/10 rounded-3xl p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-space-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 text-center mb-12">
            <div className="w-20 h-20 bg-space-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                <Database size={40} className="text-space-accent" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">{config.title}</h2>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">{config.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Stat Card */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                <Activity className="mx-auto text-green-400 mb-2" />
                <div className="text-4xl font-display font-bold text-white mb-1">{config.stat}</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">{config.statLabel}</div>
            </div>

            {/* Links */}
            <div className="space-y-4">
                {config.links.map((link, idx) => (
                    <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-space-accent/10 hover:bg-space-accent/20 border border-space-accent/20 rounded-xl transition-all group"
                    >
                        <span className="font-bold text-space-accent group-hover:text-white transition-colors">{link.label}</span>
                        <ExternalLink size={18} className="text-space-accent group-hover:text-white" />
                    </a>
                ))}
            </div>
        </div>

        <div className="mt-12 text-center">
             <p className="text-sm text-gray-600 bg-black/20 inline-block px-4 py-2 rounded-full">
                Questi dati sono forniti tramite API complesse o servizi WMTS. <br/>Per la migliore esperienza, utilizza i link diretti agli strumenti NASA.
             </p>
        </div>
      </div>
    </div>
  );
};

export default GenericDataView;