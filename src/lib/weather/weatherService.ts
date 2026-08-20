import { WeatherData } from '@/types';
import { DESTINATIONS } from '../intelligence/destinationEngine';

// Mapping Open-Meteo weather codes to conditions
function mapWeatherCode(code: number): string {
  if (code === 0) return 'Clear';
  if ([1, 2, 3].includes(code)) return 'Clouds';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Clear';
}

// Generate realistic offline fallback weather based on destination latitude/elevation
export function getFallbackWeather(destinationId: string): WeatherData {
  const destId = destinationId.toLowerCase();
  
  let temp = 28;
  let condition = 'Clear';
  let humidity = 65;
  let wind = 12;
  let rainProb = 10;

  // Hill stations
  if (['ooty', 'munnar', 'kodaikanal'].includes(destId)) {
    temp = 16;
    condition = 'Clouds';
    humidity = 80;
    wind = 15;
    rainProb = 35;
  }
  // Coastal stations
  else if (['goa', 'pondicherry', 'chennai', 'mumbai', 'kochi'].includes(destId)) {
    temp = 31;
    condition = 'Clear';
    humidity = 78;
    wind = 18;
    rainProb = 20;
  }
  // Inland / Dry
  else if (['jaipur', 'delhi', 'hyderabad'].includes(destId)) {
    temp = 33;
    condition = 'Clear';
    humidity = 40;
    wind = 10;
    rainProb = 5;
  }

  // Create 5-day forecast
  const forecast = [];
  const today = new Date();
  const conditionsPool = ['Clear', 'Clouds', condition];

  for (let i = 0; i < 5; i++) {
    const fDate = new Date();
    fDate.setDate(today.getDate() + i);
    const dateStr = fDate.toISOString().split('T')[0];

    // Slight temperature variations
    const dayTemp = temp + Math.round((Math.random() - 0.5) * 4);
    // Random condition from the pool
    const dayCondition = conditionsPool[Math.floor(Math.random() * conditionsPool.length)];

    forecast.push({
      date: dateStr,
      temp: dayTemp,
      condition: dayCondition
    });
  }

  return {
    temp,
    condition,
    humidity,
    wind,
    rainProb,
    forecast
  };
}

export async function fetchWeather(lat: number, lng: number, destinationId: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Weather data format invalid');
    }

    const currentTemp = Math.round(data.current.temperature_2m);
    const currentCode = data.current.weather_code;
    const humidity = Math.round(data.current.relative_humidity_2m);
    const wind = Math.round(data.current.wind_speed_10m);
    const condition = mapWeatherCode(currentCode);

    // Build forecast
    const forecast = [];
    const dates = data.daily.time || [];
    const maxTemps = data.daily.temperature_2m_max || [];
    const codes = data.daily.weather_code || [];
    const rainProbs = data.daily.precipitation_probability_max || [];

    for (let i = 0; i < Math.min(5, dates.length); i++) {
      forecast.push({
        date: dates[i],
        temp: Math.round(maxTemps[i] || currentTemp),
        condition: mapWeatherCode(codes[i] || 0)
      });
    }

    const rainProb = rainProbs[0] !== undefined ? Math.round(rainProbs[0]) : 15;

    return {
      temp: currentTemp,
      condition,
      humidity,
      wind,
      rainProb,
      forecast
    };
  } catch (err) {
    console.warn(`Weather service: Fetching failed, using fallback data for ${destinationId}. Error:`, err);
    return getFallbackWeather(destinationId);
  }
}
