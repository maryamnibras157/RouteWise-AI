export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Settings {
  name: string;
  preferredInterests: string[];
  travelStyle: string;
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: string; // 'attraction' | 'food' | 'nature' | 'shopping' | 'spiritual' etc.
  rating: number;
  costEstimate: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  attractions: Place[];
  cuisines: string[];
  bestTime: string;
  budgetEstimate: string;
  safetyTips: string[];
  emergencyContacts: {
    police: string;
    hospital: string;
    fire: string;
  };
}

export interface ItineraryActivity {
  id: string;
  title: string;
  category: string;
  time: string; // e.g. "09:00"
  duration: string; // e.g. "2 hours"
  description: string;
  cost: number;
  locationName: string;
  completed: boolean;
  lat?: number;
  lng?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: string; // 'Clothing' | 'Toiletries' | 'Electronics' | 'Documents' | 'Personal Care' | 'Travel Essentials' | 'Activity Specific'
  packed: boolean;
  isRecommended?: boolean;
  recommendationReason?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Accommodation' | 'Food' | 'Transport' | 'Shopping' | 'Activities' | 'Entertainment' | 'Miscellaneous';
  description: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  photo?: string; // Stored as a data URL
}

export interface TripEvent {
  id: string;
  type: 'activity' | 'expense' | 'journal' | 'custom';
  title: string;
  description: string;
  timestamp: string; // ISO string
  cost?: number;
}

export interface SavedPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface WeatherDayForecast {
  date: string;
  temp: number;
  condition: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  rainProb: number;
  forecast: WeatherDayForecast[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'budget' | 'packing' | 'itinerary' | 'general';
}

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  travelers: number;
  budgetLevel: 'budget' | 'moderate' | 'premium' | 'luxury';
  budgetLimit: number;
  interests: string[];
  travelStyle: string; // 'relaxed' | 'balanced' | 'fast-paced' | 'backpacker' | 'luxury' | 'family-friendly'
  itinerary: ItineraryDay[];
  packingList: PackingItem[];
  expenses: Expense[];
  journalEntries: JournalEntry[];
  status: 'upcoming' | 'ongoing' | 'completed';
  visitedPlaces: string[]; // Attraction/Place IDs completed
  events: TripEvent[];
  progress: number; // calculated percentage
  coverImage?: string;
}
