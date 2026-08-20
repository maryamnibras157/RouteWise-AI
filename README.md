# RouteWise AI — Your Intelligent Travel Companion

**Travel Smarter. Explore Better.**

---

## Overview

RouteWise AI is a complete, intelligent travel workspace designed specifically for mobile and desktop environments. It consolidates trip preparation, itinerary mapping, budget management, packing lists, travel memories, safety hotlines, and an active assistant into one elegant local-first experience.

This application is built in response to **SIH25082** under the Smart India Hackathon (SIH), which asks for the development of a travel-related mobile application capable of capturing, organizing, and managing trip-related information dynamically.

---

## The Problem

Traditional travel applications are scattered, require expensive proprietary API keys (like Google Maps or OpenAI), and break completely when travelers lose network connectivity (common during transit, flights, or remote hill stations).

---

## The Solution

RouteWise AI provides a **local-first, offline-first travel companion** that works out of the box with zero setup fees or API key requirements. Key features include:

- **Local Intelligence Engine**: Built-in rules and scoring modules that generate itineraries, packing lists, and budget estimates locally.
- **Free/Open Services**: Integration with OpenStreetMap (Leaflet) and Open-Meteo for offline-fallback maps and weather warnings.
- **Unified Capture Workspace**: Log expenses, check off itinerary sights, upload picture journals, and view a unified travel timeline.
- **Installable Experience**: Progressive Web App (PWA) ready, allowing direct installation on mobile viewports.

---

## Architecture & Tech Stack

RouteWise AI uses a clean, future-ready modular architecture:

```
routewiseai/
├── public/                 # PWA icons, manifest, service worker
├── src/
│   ├── app/                # Pages and App routing
│   │   ├── dashboard/      # Unified metrics and countdowns
│   │   ├── trips/          # Saved trips index and tabbed workspace
│   │   ├── plan/           # Multi-step generation wizard
│   │   ├── explore/        # Recommender destination directory
│   │   └── safety/         # Emergency preparation checklists
│   ├── components/         # Navigation sidebar/bottom-bar, Leaflet maps
│   ├── lib/
│   │   ├── intelligence/   # Local recommendation, budgeting, & sorting engines
│   │   ├── storage/        # Centralized localStorage manager
│   │   ├── weather/        # Open-Meteo fetchers with seasonal fallbacks
│   │   └── maps/           # Nominatim geocoder with cache & debouncing
│   └── types/              # Unified TypeScript definitions
```

### Tech Stack
- **Framework**: Next.js & React (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Mapping**: Leaflet & React Leaflet

---

## Local Intelligence Engines (`lib/intelligence/`)

The application implements deterministic scoring models that act as a modular placeholder for future LLM integration:
1. `itineraryEngine`: Builds day-by-day schedules mapped to travel style preferences (e.g. relaxed vs fast-paced) and interests (e.g. adventure, family-friendly).
2. `packingEngine`: Recommends packing items adjusted for destination geography (beach vs mountain) and weather forecasts (rain, cold, snow).
3. `budgetEngine`: Estimates expected trip costs by category and monitors overall health (warnings at 75%, 90%, and 100% spending caps).
4. `travelAssistantEngine`: Uses deterministic intent-matching keywords (budget, packing, itinerary) to answer questions using active trip data.
5. `summaryEngine`: Generates narrative paragraph descriptions summarizing visited locations, journal entries, and financial savings.
6. `recommendationEngine`: Scores destination options against user profile interests and budgets.

---

## PWA & Offline Behavior

- **Manifest**: Accessible at `/manifest.json`, defining installable parameters, standalone display ratios, and blue/dark styling themes.
- **Service Worker**: `/sw.js` caches static resources like SVGs, fonts, and assets for offline bootstrapping.
- **Fallbacks**: If Maps fail to load tiles, a detailed list of itinerary coordinate pins is displayed. If Open-Meteo fails, average climate seasons are served from the destination database.

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org) (v18 or higher) installed.

1. Clone or navigate to the project directory:
   ```bash
   cd routewiseai
   ```

2. Install dependencies (utilizing peer-dependency flags for React 19 safety):
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Vercel Deployment

This project builds successfully with an empty `.env` file and requires no external API keys or paid database configurations.

To deploy:
1. Push the code to a GitHub repository.
2. Link the repository to your Vercel Dashboard.
3. Keep environment variables empty.
4. Deploy!

---

## Limitations & Future Enhancements

- **Current Limitation**: Photos are compressed and saved in `localStorage` as base64 string data URLs, which is fine for demonstration profiles but capped by browser storage limitations.
- **Future Integration**: The modular architecture is designed so that `lib/intelligence` can easily be routed to Gemini API or Supabase Auth/Postgres in future stages without changing front-end UI structures.
