export type UserRole = 'buyer' | 'seller' | null;

export interface User {
  id: string;
  email: string;
  password?: string; // Stored in plain text for demo purposes only
  name: string;
  role: UserRole;
  farmerId?: string; // Linked Farmer Profile ID if role is seller
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  inStock: boolean;
  image?: string; // Added optional image for product
}

export interface ScheduleItem {
  id: string;
  day: string;
  location: string; // e.g., "Farm Stand" or "Downtown Market"
  coordinates?: {
    lat: number;
    lng: number;
  };
  openTime: string;
  closeTime: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  image?: string; // Data URL for the certificate image
}

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  description: string;
  products: Product[];
  schedule: ScheduleItem[];
  isOpenNow: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image: string;
  // New Marketplace Fields
  rating?: number;
  badges?: string[]; // e.g. ["#1 Bio", "Sustainable Hero"]
  certifications?: Certification[];
  sustainabilityMetrics?: {
    carbonSaved?: string;
    method?: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            snippet?: string;
        }[]
    }
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string; // Simplified for UI
  text: string;
  timestamp: number;
  isRead: boolean;
}