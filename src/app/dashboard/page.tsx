'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Calendar,
  Plus,
  ArrowRight,
  Sun,
  CloudRain,
  Percent,
  Wallet,
  BookOpen,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  User,
  Activity,
  Trash2,
  Copy
} from 'lucide-react';
import { tripService, authService } from '@/lib/storage/storageService';
import { fetchWeather } from '@/lib/weather/weatherService';
import { getDestinationById } from '@/lib/intelligence/destinationEngine';
import { Trip, WeatherData, User as UserType } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    const loadedTrips = tripService.getTrips();
    setTrips(loadedTrips);

    // Find the most relevant active trip:
    // 1. Ongoing trip
    // 2. Nearest upcoming trip
    // 3. Last completed trip
    let selected: Trip | null = null;
    
    const ongoing = loadedTrips.find(t => t.status === 'ongoing');
    if (ongoing) {
      selected = ongoing;
    } else {
      const upcoming = loadedTrips
        .filter(t => t.status === 'upcoming')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      if (upcoming.length > 0) {
        selected = upcoming[0];
      } else if (loadedTrips.length > 0) {
        // Fallback to most recent completed
        selected = loadedTrips[loadedTrips.length - 1];
      }
    }

    setActiveTrip(selected);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!activeTrip) return;

    async function loadWeather() {
      setWeatherLoading(true);
      const dest = getDestinationById(activeTrip!.destinationId);
      if (dest) {
        const wData = await fetchWeather(dest.lat, dest.lng, dest.id);
        setWeather(wData);
      }
      setWeatherLoading(false);
    }
    loadWeather();
  }, [activeTrip]);

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const copied = tripService.duplicateTrip(id);
    if (copied) {
      setTrips(tripService.getTrips());
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Are you sure you want to delete this trip?')) {
      tripService.deleteTrip(id);
      const updated = tripService.getTrips();
      setTrips(updated);
      
      // Update active trip
      if (activeTrip?.id === id) {
        setActiveTrip(updated.length > 0 ? updated[0] : null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#0f0f11] min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-zinc-400">Loading travel workspace...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const totalDays = trips.reduce((sum, t) => sum + t.duration, 0);
  const totalSpent = trips.reduce((sum, t) => sum + t.expenses.reduce((s, e) => s + e.amount, 0), 0);
  const totalPlaces = trips.reduce((sum, t) => sum + t.visitedPlaces.length, 0);

  // Calculate countdown
  let countdownText = '';
  if (activeTrip) {
    if (activeTrip.status === 'ongoing') {
      countdownText = 'Trip is ongoing!';
    } else if (activeTrip.status === 'completed') {
      countdownText = 'Trip completed';
    } else {
      const diffTime = new Date(activeTrip.startDate).getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      countdownText = diffDays > 0 ? `Starts in ${diffDays} days` : 'Starts today!';
    }
  }

  // Calculate budget stats for active trip
  const activeTripSpent = activeTrip ? activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
  const activeTripBudgetPercent = activeTrip && activeTrip.budgetLimit > 0
    ? Math.round((activeTripSpent / activeTrip.budgetLimit) * 100)
    : 0;

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, {currentUser?.name || 'Traveler'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Where are you headed next?
          </p>
        </div>
        <Link
          href="/plan"
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Plan a New Trip
        </Link>
      </div>

      {/* Main Grid */}
      {trips.length === 0 ? (
        /* Empty Dashboard state */
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mb-4">
            <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No planned trips yet</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-sm">
            Ready to explore? Create your first personalized travel itinerary, budget calculator, and smart packing assistant using our planner.
          </p>
          <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
            <Link
              href="/plan"
              className="py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-sm"
            >
              Plan Your First Trip
            </Link>
            <button
              onClick={() => {
                // Pre-create standard demo trips
                authService.signUp(currentUser?.name || 'Traveler', currentUser?.email || 'demo@routewise.ai');
                setTrips(tripService.getTrips());
                window.location.reload();
              }}
              className="py-2.5 rounded border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-sm"
            >
              Load Demo Trips
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Section: Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Trips Created</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{totalTrips}</span>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Completed</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{completedTrips}</span>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Days</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{totalDays}</span>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Spending</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1 text-blue-600 dark:text-blue-400">
                ₹{totalSpent.toLocaleString()}
              </span>
            </div>
            <div className="col-span-2 lg:col-span-1 p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Places Explored</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{totalPlaces}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Active/Upcoming Trip Main Card */}
            {activeTrip && (
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between p-6">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {activeTrip.destinationName}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {activeTrip.startDate} to {activeTrip.endDate} ({activeTrip.duration} Days)
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {countdownText}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                      <span>Trip Progress ({activeTrip.progress}% checked)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activeTrip.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Substats */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/80 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Budget cap</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                      ₹{activeTrip.budgetLimit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Spent</span>
                    <span className="text-sm font-bold mt-1 block text-blue-600 dark:text-blue-400">
                      ₹{activeTripSpent.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Items Packed</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                      {activeTrip.packingList.filter(p => p.packed).length} of {activeTrip.packingList.length}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/40 px-4 py-2.5 rounded-lg border border-slate-100 dark:border-zinc-800">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Configure details, check list, or write journals.
                  </span>
                  <Link
                    href={`/trips/${activeTrip.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                  >
                    Open Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Weather Widget */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4.5 h-4.5 text-yellow-500" />
                  Destination Weather
                </h3>
                {activeTrip ? (
                  <div className="mt-6">
                    <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Forecast for {activeTrip.destinationName}
                    </p>
                    {weatherLoading ? (
                      <div className="py-6 text-center">
                        <Activity className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                      </div>
                    ) : weather ? (
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                            {weather.temp}°C
                          </p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mt-1">
                            {weather.condition}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                          <p>Humidity: {weather.humidity}%</p>
                          <p>Wind: {weather.wind} km/h</p>
                          <p>Rain Probability: {weather.rainProb}%</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-4">Weather data currently unavailable.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-8 text-center">Select or create a trip to load forecasts.</p>
                )}
              </div>

              {weather && (
                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                    {weather.rainProb > 40
                      ? 'Precipitation expected. Carrying a small umbrella is recommended.'
                      : weather.temp > 28
                      ? 'Warm conditions expected. Wear light cotton clothing.'
                      : 'Pleasant temperatures forecasted. Ideal for city tours.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          {activeTrip && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Active Trip Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Link
                  href={`/trips/${activeTrip.id}?tab=itinerary`}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition text-center shadow-xs"
                >
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">View Itinerary</span>
                </Link>
                <Link
                  href={`/trips/${activeTrip.id}?tab=expenses`}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition text-center shadow-xs"
                >
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">Add Expense</span>
                </Link>
                <Link
                  href={`/trips/${activeTrip.id}?tab=journal`}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition text-center shadow-xs"
                >
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">Write Journal</span>
                </Link>
                <Link
                  href={`/trips/${activeTrip.id}?tab=packing`}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition text-center shadow-xs"
                >
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">View Packing</span>
                </Link>
                <Link
                  href="/explore"
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition text-center shadow-xs"
                >
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">Explore Places</span>
                </Link>
              </div>
            </div>
          )}

          {/* Section: Recent Trips Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              All Planned Journeys
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => {
                const isCurrentActive = activeTrip?.id === trip.id;
                const tripSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

                return (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                      isCurrentActive
                        ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20'
                        : 'border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    {/* Header Details */}
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                            trip.status === 'ongoing'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                              : trip.status === 'completed'
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {trip.status}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                            {trip.destinationName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {trip.startDate} ({trip.duration} days)
                          </p>
                        </div>
                      </div>

                      {/* Stats brief */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Budget Limit</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                            ₹{trip.budgetLimit.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Spent</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                            ₹{tripSpent.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/20 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {trip.progress}% complete
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDuplicate(trip.id, e)}
                          title="Duplicate Trip"
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(trip.id, e)}
                          title="Delete Trip"
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
