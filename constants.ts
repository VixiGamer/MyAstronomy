import { ViewState } from './types';

// Simple obfuscation to prevent simple text scraping from "Inspect Element"
// In a real production app, use a proxy server to hide the key completely.
const K_PART_1 = '8Rf2bQ8swUgJ51Hr';
const K_PART_2 = 'J3eOyqYbuLwihvBzYgOZNUZd';
export const getApiKey = () => `${K_PART_1}${K_PART_2}`;

export const BASE_URL = 'https://api.nasa.gov';

export const APP_NAME = "MyAstronomy";

export interface NavItem {
  id: ViewState;
  label: string;
  description: string;
  iconName: string;
  color: string;
  category: 'visual' | 'data' | 'tech' | 'earth';
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'apod',
    label: 'APOD',
    description: 'Astronomy Picture of the Day. Un viaggio quotidiano nel cosmo.',
    iconName: 'Image',
    color: 'from-blue-500 to-cyan-400',
    category: 'visual'
  },
  {
    id: 'library',
    label: 'NASA Image Library',
    description: 'Archivio vastissimo di immagini e video NASA.',
    iconName: 'Film',
    color: 'from-purple-500 to-indigo-500',
    category: 'visual'
  },
  {
    id: 'neows',
    label: 'Asteroidi NeoWs',
    description: 'Monitoraggio degli asteroidi vicini alla Terra (NEO).',
    iconName: 'Activity',
    color: 'from-red-500 to-orange-400',
    category: 'data'
  },
  {
    id: 'epic',
    label: 'EPIC Earth',
    description: 'Immagini della Terra dal satellite DSCOVR.',
    iconName: 'Globe',
    color: 'from-emerald-500 to-teal-400',
    category: 'earth'
  },
  {
    id: 'eonet',
    label: 'EONET Events',
    description: 'Tracker eventi naturali (incendi, tempeste, vulcani).',
    iconName: 'Flame',
    color: 'from-red-600 to-rose-400',
    category: 'earth'
  },
  {
    id: 'donki',
    label: 'DONKI Space Weather',
    description: 'Database di notifiche e informazioni meteo spaziale.',
    iconName: 'Sun',
    color: 'from-yellow-500 to-orange-500',
    category: 'data'
  },
  {
    id: 'mars',
    label: 'Mars Rovers',
    description: 'Galleria fotografica dai rover su Marte.',
    iconName: 'Camera',
    color: 'from-orange-600 to-red-600',
    category: 'visual'
  },
  {
    id: 'tech',
    label: 'TechTransfer & Port',
    description: 'Brevetti, software e tecnologie sviluppate dalla NASA.',
    iconName: 'Cpu',
    color: 'from-slate-500 to-slate-300',
    category: 'tech'
  },
  {
    id: 'exoplanet',
    label: 'Exoplanet Archive',
    description: 'Database dei pianeti confermati fuori dal sistema solare.',
    iconName: 'Orbit',
    color: 'from-indigo-600 to-purple-600',
    category: 'data'
  },
  {
    id: 'gene',
    label: 'Open Science Data',
    description: 'GeneLab e repository di dati scientifici aperti.',
    iconName: 'Dna',
    color: 'from-green-500 to-emerald-600',
    category: 'data'
  },
  {
    id: 'ssd',
    label: 'Solar System Dynamics',
    description: 'Dati orbitali e dinamiche del sistema solare (SSD/CNEOS).',
    iconName: 'Atom',
    color: 'from-blue-600 to-blue-800',
    category: 'data'
  },
  {
    id: 'generic',
    label: 'Altre API',
    description: 'GIBS, TLE, Vesta/Moon Trek e altri servizi dati.',
    iconName: 'Database',
    color: 'from-gray-600 to-gray-400',
    category: 'tech'
  }
];