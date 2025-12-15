// APOD Types
export interface ApodData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

// NeoWs (Asteroids) Types
export interface Asteroid {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export interface NeoFeed {
  element_count: number;
  near_earth_objects: {
    [date: string]: Asteroid[];
  };
}

// Mars Rover Types
export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

// EPIC Types
export interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
}

// DONKI (Space Weather) Types
export interface DonkiNotification {
  messageType: string;
  messageID: string;
  messageURL: string;
  messageIssueTime: string;
  messageBody: string;
}

// EONET (Natural Events) Types
export interface EonetEvent {
  id: string;
  title: string;
  description?: string;
  link: string;
  categories: Array<{ id: string; title: string }>;
  sources: Array<{ id: string; url: string }>;
  geometry: Array<{ date: string; type: string; coordinates: any[] }>;
}

// NASA Image Library Types
export interface NasaImageItem {
  href: string;
  data: Array<{
    title: string;
    description: string;
    nasa_id: string;
    date_created: string;
    media_type: 'image' | 'video' | 'audio';
    center?: string;
  }>;
  links?: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

export interface NasaImageCollection {
  collection: {
    version: string;
    href: string;
    items: NasaImageItem[];
  };
}

// TechTransfer Types
export interface TechPatent {
  [key: string]: string; // The API returns an array of arrays or flexible objects often
}

export type ViewState = 
  | 'dashboard' 
  | 'apod' 
  | 'neows' 
  | 'mars' 
  | 'epic' 
  | 'donki' 
  | 'eonet' 
  | 'library' 
  | 'tech' 
  | 'exoplanet' 
  | 'gene' 
  | 'ssd'
  | 'generic';
