export interface Buoy {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sentido?: string;
  description?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingLinks?: GroundingLink[];
  isError?: boolean;
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}