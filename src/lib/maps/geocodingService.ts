import { DESTINATIONS } from '../intelligence/destinationEngine';

interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
}

// In-memory cache for search queries
const cache: Record<string, GeocodeResult[]> = {};

export async function geocodeDestination(query: string): Promise<GeocodeResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Check cache first
  if (cache[cleanQuery]) {
    return cache[cleanQuery];
  }

  // Check localStorage cache to persist across reloads
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`geo_cache_${cleanQuery}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        cache[cleanQuery] = parsed;
        return parsed;
      }
    } catch {
      // Ignored
    }
  }

  // Fallback behavior if offline or API fails
  const localMatch = DESTINATIONS.filter(
    d => d.name.toLowerCase().includes(cleanQuery) || cleanQuery.includes(d.name.toLowerCase())
  );

  const localResults: GeocodeResult[] = localMatch.map(d => ({
    name: d.name,
    lat: d.lat,
    lng: d.lng
  }));

  // Fetch from Nominatim (OpenStreetMap public API)
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        // Identify ourselves responsibly to Nominatim
        'User-Agent': 'RouteWiseAI-TravelPlanner-App'
      }
    });

    if (!response.ok) {
      throw new Error('Nominatim request failed');
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const results: GeocodeResult[] = data.map((item: any) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));

      // Cache results
      cache[cleanQuery] = results;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`geo_cache_${cleanQuery}`, JSON.stringify(results));
        } catch {
          // Ignored
        }
      }
      return results;
    }
  } catch (err) {
    console.warn(`Geocoding failed for "${query}". Using local dataset fallback. Error:`, err);
  }

  // Return local matches if query search failed
  return localResults.length > 0 ? localResults : [
    {
      name: `${query.charAt(0).toUpperCase() + query.slice(1)}, India`,
      lat: 20.5937, // Center of India fallback
      lng: 78.9629
    }
  ];
}
