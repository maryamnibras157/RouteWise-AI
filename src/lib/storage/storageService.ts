import { Trip, User, Settings, Expense, JournalEntry, PackingItem, TripEvent } from '@/types';
import { DESTINATIONS } from '../intelligence/destinationEngine';

const STORAGE_KEYS = {
  TRIPS: 'routewise_trips',
  SETTINGS: 'routewise_settings',
  CURRENT_USER: 'routewise_current_user',
  USERS: 'routewise_users',
};

// Initial helper to format date strings relative to today
function getDateOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  name: 'Traveler',
  preferredInterests: ['Culture', 'Nature', 'Photography'],
  travelStyle: 'balanced',
  defaultCurrency: 'INR',
  theme: 'light',
  notifications: true,
};

// Generate realistic dummy trips
const SEED_TRIPS = (): Trip[] => [
  {
    id: 'demo-pondicherry',
    destinationId: 'pondicherry',
    destinationName: 'Pondicherry',
    startDate: getDateOffset(2),
    endDate: getDateOffset(5),
    duration: 3,
    travelers: 2,
    budgetLevel: 'moderate',
    budgetLimit: 10000,
    interests: ['Culture', 'Food', 'Photography', 'Relaxation'],
    travelStyle: 'balanced',
    status: 'upcoming',
    progress: 36,
    visitedPlaces: ['pd1', 'pd3', 'pd5'],
    itinerary: [
      {
        dayNumber: 1,
        date: getDateOffset(2),
        activities: [
          {
            id: 'pd-act1',
            title: 'Heritage Walk',
            category: 'culture',
            time: '09:00',
            duration: '2 hours',
            description: 'Explore the yellow colonial mustard streets of the French Quarter.',
            cost: 100,
            locationName: 'French Quarter heritage walk',
            completed: true
          },
          {
            id: 'pd-act2',
            title: 'Lunch at Cafe Extasi',
            category: 'food',
            time: '13:00',
            duration: '1.5 hours',
            description: 'Indulge in famous woodfired pizzas and fresh pasta.',
            cost: 600,
            locationName: 'French Quarter',
            completed: true
          },
          {
            id: 'pd-act3',
            title: 'Sri Aurobindo Ashram visit',
            category: 'spiritual',
            time: '15:30',
            duration: '1 hour',
            description: 'Experience peace and silence in the ashram central courtyard.',
            cost: 0,
            locationName: 'Sri Aurobindo Ashram',
            completed: true
          },
          {
            id: 'pd-act4',
            title: 'Sunset at Promenade',
            category: 'nature',
            time: '18:30',
            duration: '2 hours',
            description: 'Relax by the rocky seafront and feel the coastal evening breeze.',
            cost: 0,
            locationName: 'Promenade Beach',
            completed: true
          }
        ]
      },
      {
        dayNumber: 2,
        date: getDateOffset(3),
        activities: [
          {
            id: 'pd-act5',
            title: 'Auroville Matrimandir Tour',
            category: 'spiritual',
            time: '09:00',
            duration: '3 hours',
            description: 'Walk to the viewing point of the golden geodesic dome.',
            cost: 200,
            locationName: 'Auroville Matrimandir',
            completed: false
          },
          {
            id: 'pd-act6',
            title: 'Lunch at Auroville Bakery',
            category: 'food',
            time: '13:00',
            duration: '1 hour',
            description: 'Try fresh organic baguettes, tarts, and iced tea.',
            cost: 400,
            locationName: 'Auroville',
            completed: false
          },
          {
            id: 'pd-act7',
            title: 'Explore French Quarter Boutiques',
            category: 'shopping',
            time: '15:30',
            duration: '2 hours',
            description: 'Shop for organic cotton garments, incense, and handmade paper.',
            cost: 100,
            locationName: 'French Quarter',
            completed: false
          }
        ]
      },
      {
        dayNumber: 3,
        date: getDateOffset(4),
        activities: [
          {
            id: 'pd-act8',
            title: 'Paradise Beach Getaway',
            category: 'nature',
            time: '09:00',
            duration: '4 hours',
            description: 'Board a scenic ferry ride across the Chunnambar backwaters to reach the sandbar beach.',
            cost: 250,
            locationName: 'Paradise Beach',
            completed: false
          },
          {
            id: 'pd-act9',
            title: 'Lunch by the Shore',
            category: 'food',
            time: '13:30',
            duration: '1 hour',
            description: 'Enjoy delicious local seafood fry and fresh coconut water.',
            cost: 500,
            locationName: 'Paradise Beach',
            completed: false
          },
          {
            id: 'pd-act10',
            title: 'Local Handicrafts Shopping',
            category: 'shopping',
            time: '16:00',
            duration: '2 hours',
            description: 'Purchase terracotta pottery and local leather goods.',
            cost: 1000,
            locationName: 'Heritage town',
            completed: false
          }
        ]
      }
    ],
    packingList: [
      { id: 'pd-pack1', name: 'Swimwear', category: 'Clothing', packed: true, isRecommended: true, recommendationReason: 'Beach destination' },
      { id: 'pd-pack2', name: 'Sunscreen lotion', category: 'Toiletries', packed: true, isRecommended: true, recommendationReason: 'Sunny coastal weather' },
      { id: 'pd-pack3', name: 'Sunglasses', category: 'Travel Essentials', packed: true, isRecommended: true, recommendationReason: 'General outdoor wear' },
      { id: 'pd-pack4', name: 'Walking sandals', category: 'Clothing', packed: false, isRecommended: true, recommendationReason: 'Comfortable beach walk' },
      { id: 'pd-pack5', name: 'Cotton shorts & t-shirts', category: 'Clothing', packed: true, isRecommended: true, recommendationReason: 'Humid climate' },
      { id: 'pd-pack6', name: 'Small umbrella', category: 'Travel Essentials', packed: false, isRecommended: true, recommendationReason: 'Possible light showers' },
      { id: 'pd-pack7', name: 'Camera & Charger', category: 'Electronics', packed: true, isRecommended: true, recommendationReason: 'Interests: Photography' }
    ],
    expenses: [
      { id: 'pd-exp1', amount: 4500, category: 'Accommodation', description: 'French villa boutique homestay - 3 nights prepay', date: getDateOffset(0) },
      { id: 'pd-exp2', amount: 800, category: 'Food', description: 'Group dinner at Villa Shanti', date: getDateOffset(2) },
      { id: 'pd-exp3', amount: 900, category: 'Transport', description: 'Scooter rental for 3 days + fuel', date: getDateOffset(2) },
      { id: 'pd-exp4', amount: 1500, category: 'Shopping', description: 'Boutique clothing purchase', date: getDateOffset(3) },
      { id: 'pd-exp5', amount: 500, category: 'Food', description: 'Italian pizza lunch', date: getDateOffset(2) }
    ],
    journalEntries: [
      {
        id: 'pd-j1',
        title: 'Charming French Lanes',
        date: getDateOffset(2),
        location: 'French Quarter',
        description: 'Walked down the beautiful lanes of the French Quarter today. The mustard-yellow buildings are incredibly charming. We had a gorgeous woodfired pizza at Cafe Extasi and later visited the Sri Aurobindo Ashram. It was so quiet and spiritual inside. Ended the evening walking along the rocks on Promenade Beach. The sea breeze was amazing!'
      }
    ],
    events: [
      { id: 'pd-ev1', type: 'activity', title: 'Heritage Walk Completed', description: 'Explored colonial history on foot', timestamp: new Date(getDateOffset(2) + 'T11:00:00').toISOString() },
      { id: 'pd-ev2', type: 'expense', title: 'Paid Homestay', description: 'Accommodation expense: INR 4,500', timestamp: new Date(getDateOffset(0) + 'T12:00:00').toISOString(), cost: 4500 },
      { id: 'pd-ev3', type: 'journal', title: 'Added: Charming French Lanes', description: 'Journaled about French Colony walk', timestamp: new Date(getDateOffset(2) + 'T21:00:00').toISOString() }
    ]
  },
  {
    id: 'demo-ooty',
    destinationId: 'ooty',
    destinationName: 'Ooty',
    startDate: getDateOffset(-10),
    endDate: getDateOffset(-6),
    duration: 4,
    travelers: 4,
    budgetLevel: 'moderate',
    budgetLimit: 15000,
    interests: ['Nature', 'Photography', 'Family'],
    travelStyle: 'relaxed',
    status: 'completed',
    progress: 100,
    visitedPlaces: ['ot1', 'ot2', 'ot3', 'ot4', 'ot5'],
    itinerary: [
      {
        dayNumber: 1,
        date: getDateOffset(-10),
        activities: [
          {
            id: 'ot-act1',
            title: 'Ooty Botanical Gardens Visit',
            category: 'nature',
            time: '09:00',
            duration: '2.5 hours',
            description: 'Explore the beautifully terraced gardens and the fossil tree trunk.',
            cost: 50,
            locationName: 'Ooty Botanical Gardens',
            completed: true
          },
          {
            id: 'ot-act2',
            title: 'Lunch at Hillside Cafe',
            category: 'food',
            time: '13:00',
            duration: '1 hour',
            description: 'Hot stew and local continental lunch.',
            cost: 300,
            locationName: 'Commercial Road',
            completed: true
          },
          {
            id: 'ot-act3',
            title: 'Boating at Ooty Lake',
            category: 'family',
            time: '15:00',
            duration: '1.5 hours',
            description: 'Fun row-boating experience with the family.',
            cost: 120,
            locationName: 'Ooty Lake',
            completed: true
          }
        ]
      },
      {
        dayNumber: 2,
        date: getDateOffset(-9),
        activities: [
          {
            id: 'ot-act4',
            title: 'Nilgiri Mountain Railway ride',
            category: 'history',
            time: '09:00',
            duration: '4 hours',
            description: 'Take the scenic UNESCO toy train from Ooty down to Coonoor.',
            cost: 300,
            locationName: 'Ooty Toy Train Station',
            completed: true
          },
          {
            id: 'ot-act5',
            title: 'Coonoor Tea Plantation Walk',
            category: 'nature',
            time: '15:30',
            duration: '2 hours',
            description: 'Walk through green estates and watch tea leaves being plucked.',
            cost: 100,
            locationName: 'Coonoor Tea Gardens',
            completed: true
          }
        ]
      },
      {
        dayNumber: 3,
        date: getDateOffset(-8),
        activities: [
          {
            id: 'ot-act6',
            title: 'Doddabetta Peak Sunrise Trek',
            category: 'nature',
            time: '09:00',
            duration: '3 hours',
            description: 'Climb the tallest peak in Nilgiris for misty valley views.',
            cost: 20,
            locationName: 'Doddabetta Peak',
            completed: true
          },
          {
            id: 'ot-act7',
            title: 'Lunch at Doddabetta Dhaba',
            category: 'food',
            time: '13:00',
            duration: '1 hour',
            description: 'Hot spicy food to beat the cold.',
            cost: 150,
            locationName: 'Doddabetta',
            completed: true
          }
        ]
      },
      {
        dayNumber: 4,
        date: getDateOffset(-7),
        activities: [
          {
            id: 'ot-act8',
            title: 'Pykara Waterfalls & Lake Tour',
            category: 'nature',
            time: '09:00',
            duration: '4 hours',
            description: 'Stunning waterfalls and a quiet speedboating session.',
            cost: 100,
            locationName: 'Pykara Waterfalls & Lake',
            completed: true
          },
          {
            id: 'ot-act9',
            title: 'Homemade Chocolate shopping',
            category: 'shopping',
            time: '14:00',
            duration: '1 hour',
            description: 'Buy freshly-made truffles, fudge, and milk chocolates.',
            cost: 500,
            locationName: 'Ooty Town',
            completed: true
          }
        ]
      }
    ],
    packingList: [
      { id: 'ot-pack1', name: 'Heavy jacket & sweater', category: 'Clothing', packed: true, isRecommended: true, recommendationReason: 'Cold hill station' },
      { id: 'ot-pack2', name: 'Thermal innerwear', category: 'Clothing', packed: true, isRecommended: true, recommendationReason: 'Chilly nights' },
      { id: 'ot-pack3', name: 'Woolen socks', category: 'Clothing', packed: true, isRecommended: true, recommendationReason: 'Cold hill station' },
      { id: 'ot-pack4', name: 'Thermos bottle', category: 'Travel Essentials', packed: true, isRecommended: true, recommendationReason: 'Carrying hot tea/water' },
      { id: 'ot-pack5', name: 'Umbrella', category: 'Travel Essentials', packed: true, isRecommended: true, recommendationReason: 'High chance of hill mist/rain' },
      { id: 'ot-pack6', name: 'Lip balm & cold cream', category: 'Toiletries', packed: true, isRecommended: true, recommendationReason: 'Dry chilly winds' },
      { id: 'ot-pack7', name: 'Sturdy hiking boots', category: 'Activity Specific', packed: true, isRecommended: true, recommendationReason: 'Doddabetta trekking' }
    ],
    expenses: [
      { id: 'ot-exp1', amount: 6500, category: 'Accommodation', description: 'Hillview Heritage Resort - 4 nights prepay', date: getDateOffset(-10) },
      { id: 'ot-exp2', amount: 1200, category: 'Transport', description: 'Toy train first class seats return tickets', date: getDateOffset(-10) },
      { id: 'ot-exp3', amount: 600, category: 'Food', description: 'Family dinner at Nahar Sidewalk cafe', date: getDateOffset(-10) },
      { id: 'ot-exp4', amount: 3000, category: 'Transport', description: 'Private taxi rental for Coonoor/Pykara sightseeing', date: getDateOffset(-9) },
      { id: 'ot-exp5', amount: 800, category: 'Food', description: 'Dinner and hot cocoas', date: getDateOffset(-9) }
    ],
    journalEntries: [
      {
        id: 'ot-j1',
        title: 'Misty Mornings in Ooty',
        date: getDateOffset(-10),
        location: 'Botanical Gardens',
        description: 'Arrived in Ooty early this morning. The air is so fresh and crisp! We immediately headed to the Botanical Gardens. The green terraces were shrouded in beautiful morning mist. In the afternoon we checked into our resort and then went to Ooty Lake. Boating in the cold weather with the family was a highlight. Had hot soup and dinner afterwards!'
      }
    ],
    events: [
      { id: 'ot-ev1', type: 'activity', title: 'Botanical Gardens Visited', description: 'Explored lush shola garden slopes', timestamp: new Date(getDateOffset(-10) + 'T11:00:00').toISOString() },
      { id: 'ot-ev2', type: 'expense', title: 'Paid Resort Booking', description: 'Accommodation: INR 6,500', timestamp: new Date(getDateOffset(-10) + 'T09:00:00').toISOString(), cost: 6500 },
      { id: 'ot-ev3', type: 'journal', title: 'Added: Misty Mornings in Ooty', description: 'Journaled about Botanical Gardens and Ooty Lake', timestamp: new Date(getDateOffset(-10) + 'T20:30:00').toISOString() }
    ]
  }
];

// Helper to check client side
const isClient = typeof window !== 'undefined';

// Safe get/set local storage
function safeGet<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Authentication operations
export const authService = {
  getCurrentUser: (): User | null => {
    return safeGet<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  signUp: (name: string, email: string): User => {
    const user: User = { id: Math.random().toString(36).substr(2, 9), name, email };
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
    
    // Save to list of users
    const users = safeGet<User[]>(STORAGE_KEYS.USERS, []);
    users.push(user);
    safeSet(STORAGE_KEYS.USERS, users);

    // Create default settings for the user
    const settings = { ...DEFAULT_SETTINGS, name };
    safeSet(STORAGE_KEYS.SETTINGS, settings);

    // Initial seed check
    if (safeGet<Trip[]>(STORAGE_KEYS.TRIPS, []).length === 0) {
      safeSet(STORAGE_KEYS.TRIPS, SEED_TRIPS());
    }

    return user;
  },

  login: (email: string): User | null => {
    const users = safeGet<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      safeSet(STORAGE_KEYS.CURRENT_USER, user);
      
      // Load sample trips if empty
      if (safeGet<Trip[]>(STORAGE_KEYS.TRIPS, []).length === 0) {
        safeSet(STORAGE_KEYS.TRIPS, SEED_TRIPS());
      }
      return user;
    }
    // Fallback: if no users exist at all, auto sign up as demo user
    if (users.length === 0) {
      return authService.signUp('Demo Traveler', email);
    }
    return null;
  },

  logout: (): void => {
    if (!isClient) return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Settings operations
export const settingsService = {
  getSettings: (): Settings => {
    return safeGet<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  
  saveSettings: (settings: Settings): void => {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  }
};

// Central Trip storage operations
export const tripService = {
  getTrips: (): Trip[] => {
    let trips = safeGet<Trip[]>(STORAGE_KEYS.TRIPS, []);
    if (trips.length === 0 && isClient) {
      // Auto seed if empty
      trips = SEED_TRIPS();
      safeSet(STORAGE_KEYS.TRIPS, trips);
    }
    return trips;
  },

  getTripById: (id: string): Trip | undefined => {
    const trips = tripService.getTrips();
    return trips.find(t => t.id === id);
  },

  saveTrip: (trip: Trip): void => {
    const trips = tripService.getTrips();
    const index = trips.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      trips[index] = trip;
    } else {
      trips.push(trip);
    }
    safeSet(STORAGE_KEYS.TRIPS, trips);
  },

  deleteTrip: (id: string): void => {
    const trips = tripService.getTrips();
    const filtered = trips.filter(t => t.id !== id);
    safeSet(STORAGE_KEYS.TRIPS, filtered);
  },

  duplicateTrip: (id: string): Trip | null => {
    const original = tripService.getTripById(id);
    if (!original) return null;

    const copy: Trip = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      destinationName: `${original.destinationName} (Copy)`,
      startDate: original.startDate,
      endDate: original.endDate,
      status: 'upcoming',
      progress: 0,
      visitedPlaces: [],
      // Reset checks
      itinerary: original.itinerary.map(day => ({
        ...day,
        activities: day.activities.map(act => ({ ...act, completed: false }))
      })),
      packingList: original.packingList.map(item => ({ ...item, packed: false })),
      expenses: [],
      journalEntries: [],
      events: [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'custom',
          title: 'Trip Duplicated',
          description: `Copied from original trip to ${original.destinationName}`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    tripService.saveTrip(copy);
    return copy;
  },

  // Helper inside specific trip to recalculate progress
  recalculateTripProgress: (tripId: string): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    let totalActivities = 0;
    let completedActivities = 0;

    trip.itinerary.forEach(day => {
      day.activities.forEach(act => {
        totalActivities++;
        if (act.completed) {
          completedActivities++;
        }
      });
    });

    const progress = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
    trip.progress = progress;
    tripService.saveTrip(trip);
  },

  // Expense management within a trip
  saveExpense: (tripId: string, expense: Expense): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    const index = trip.expenses.findIndex(e => e.id === expense.id);
    if (index >= 0) {
      trip.expenses[index] = expense;
    } else {
      trip.expenses.push(expense);
      // Trigger timeline event
      trip.events.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'expense',
        title: `Added Expense: ${expense.category}`,
        description: `${expense.description} - INR ${expense.amount}`,
        timestamp: new Date().toISOString(),
        cost: expense.amount
      });
    }

    tripService.saveTrip(trip);
  },

  deleteExpense: (tripId: string, expenseId: string): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    tripService.saveTrip(trip);
  },

  // Packing list management
  savePackingItem: (tripId: string, item: PackingItem): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    const index = trip.packingList.findIndex(p => p.id === item.id);
    if (index >= 0) {
      trip.packingList[index] = item;
    } else {
      trip.packingList.push(item);
    }
    tripService.saveTrip(trip);
  },

  deletePackingItem: (tripId: string, itemId: string): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    trip.packingList = trip.packingList.filter(p => p.id !== itemId);
    tripService.saveTrip(trip);
  },

  // Journal entries management
  saveJournalEntry: (tripId: string, entry: JournalEntry): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    const index = trip.journalEntries.findIndex(j => j.id === entry.id);
    if (index >= 0) {
      trip.journalEntries[index] = entry;
    } else {
      trip.journalEntries.push(entry);
      // Trigger timeline event
      trip.events.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'journal',
        title: `Journal Entry: ${entry.title}`,
        description: `Logged at ${entry.location}`,
        timestamp: new Date().toISOString()
      });
    }
    tripService.saveTrip(trip);
  },

  deleteJournalEntry: (tripId: string, entryId: string): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    trip.journalEntries = trip.journalEntries.filter(j => j.id !== entryId);
    tripService.saveTrip(trip);
  },

  // Add custom manual event to timeline
  addCustomTripEvent: (tripId: string, title: string, description: string): void => {
    const trip = tripService.getTripById(tripId);
    if (!trip) return;

    const event: TripEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'custom',
      title,
      description,
      timestamp: new Date().toISOString()
    };
    trip.events.push(event);
    tripService.saveTrip(trip);
  }
};
