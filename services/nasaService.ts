import { getApiKey, BASE_URL } from '../constants';
import { ApodData, NeoFeed, MarsPhoto, EpicImage, DonkiNotification, EonetEvent, NasaImageCollection } from '../types';

class NasaService {
  private async fetch<T>(endpoint: string, params: Record<string, string> = {}, baseUrl: string = BASE_URL): Promise<T> {
    const url = new URL(`${baseUrl}${endpoint}`);
    
    // Some APIs like EONET don't need API key, but most do.
    // NASA Image Library is separate.
    if (baseUrl === BASE_URL) {
       url.searchParams.append('api_key', getApiKey());
    }
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
        // Handle common errors gracefully
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // APOD
  async getApod(date?: string): Promise<ApodData> {
    const params: Record<string, string> = {};
    if (date) {
        params.date = date;
    }
    return this.fetch<ApodData>('/planetary/apod', params);
  }

  // NeoWs (Asteroids)
  async getAsteroids(startDate: string, endDate: string): Promise<NeoFeed> {
    return this.fetch<NeoFeed>('/neo/rest/v1/feed', {
      start_date: startDate,
      end_date: endDate
    });
  }

  // Mars Rover Photos
  async getMarsPhotos(rover: 'curiosity' | 'perseverance', sol: number): Promise<{ photos: MarsPhoto[] }> {
    return this.fetch<{ photos: MarsPhoto[] }>(`/mars-photos/api/v1/rovers/${rover}/photos`, {
      sol: sol.toString()
    });
  }

  // EPIC
  async getEpicImages(): Promise<EpicImage[]> {
    return this.fetch<EpicImage[]>('/EPIC/api/natural');
  }
  
  getEpicImageUrl(imageName: string, dateStr: string): string {
    const datePart = dateStr.split(' ')[0].replace(/-/g, '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${datePart}/png/${imageName}.png`;
  }

  // DONKI (Space Weather)
  async getDonkiNotifications(): Promise<DonkiNotification[]> {
    return this.fetch<DonkiNotification[]>('/DONKI/notifications', {
        type: 'all'
    });
  }

  // EONET (Natural Events) - Uses different base URL
  async getEonetEvents(): Promise<{ events: EonetEvent[] }> {
    // EONET v3
    return this.fetch<{ events: EonetEvent[] }>('/api/v3/events', { status: 'open', limit: '20' }, 'https://eonet.gsfc.nasa.gov');
  }

  // NASA Image and Video Library - Uses different base URL
  async searchNasaLibrary(query: string): Promise<NasaImageCollection> {
    return this.fetch<NasaImageCollection>('/search', { q: query, media_type: 'image' }, 'https://images-api.nasa.gov');
  }

  // TechTransfer
  async getTechPatents(): Promise<any> {
    // Returns structured data about patents
    // Adding 'engine' param often helps stabilize the response format
    return this.fetch<any>('/techtransfer/patent/', { engine: '' });
  }

  // Generic fetcher for raw data views (Exoplanet etc)
  async getGenericData(endpoint: string, params: Record<string, string> = {}): Promise<any> {
      return this.fetch<any>(endpoint, params);
  }
}

export const nasaService = new NasaService();