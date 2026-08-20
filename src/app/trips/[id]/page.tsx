'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Compass,
  Calendar,
  Wallet,
  BookOpen,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Eye,
  Settings,
  RefreshCw,
  PlusCircle,
  FileText,
  Phone
} from 'lucide-react';

// Central services
import { tripService } from '@/lib/storage/storageService';
import { fetchWeather } from '@/lib/weather/weatherService';
import { getDestinationById, DESTINATIONS } from '@/lib/intelligence/destinationEngine';
import { getBudgetReport } from '@/lib/intelligence/budgetEngine';
import { generatePackingList } from '@/lib/intelligence/packingEngine';
import { Trip, ItineraryDay, ItineraryActivity, Expense, JournalEntry, PackingItem, WeatherData, TripEvent } from '@/types';

// Dynamic import of Recharts to prevent SSR bundle errors
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });

// Dynamic import of Leaflet Map component
const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

// Chart colors
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function TripDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Itinerary Forms State
  const [showAddAct, setShowAddAct] = useState<number | null>(null); // dayNumber
  const [actTitle, setActTitle] = useState('');
  const [actCategory, setActCategory] = useState('nature');
  const [actTime, setActTime] = useState('10:00');
  const [actDuration, setActDuration] = useState('2 hours');
  const [actDesc, setActDesc] = useState('');
  const [actCost, setActCost] = useState(0);
  const [actLoc, setActLoc] = useState('');

  // Expense Form State
  const [showAddExp, setShowAddExp] = useState(false);
  const [expAmount, setExpAmount] = useState(0);
  const [expCategory, setExpCategory] = useState<Expense['category']>('Food');
  const [expDesc, setExpDesc] = useState('');
  const [expDate, setExpDate] = useState('');

  // Packing Form State
  const [packName, setPackName] = useState('');
  const [packCategory, setPackCategory] = useState('Clothing');

  // Journal Form State
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [jTitle, setJTitle] = useState('');
  const [jLoc, setJLoc] = useState('');
  const [jDesc, setJDesc] = useState('');
  const [jPhoto, setJPhoto] = useState('');
  const [jDate, setJDate] = useState('');

  // Custom Event Form State
  const [evTitle, setEvTitle] = useState('');
  const [evDesc, setEvDesc] = useState('');

  // Load trip and synchronize tab parameter
  useEffect(() => {
    const loaded = tripService.getTripById(tripId);
    if (!loaded) {
      router.push('/dashboard');
      return;
    }
    setTrip(loaded);

    // Read tab from query parameters
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }

    // Set initial date forms relative to trip
    setExpDate(loaded.startDate);
    setJDate(loaded.startDate);
  }, [tripId, searchParams, router]);

  // Load weather
  useEffect(() => {
    if (!trip) return;
    
    async function loadWeather() {
      setWeatherLoading(true);
      const dest = getDestinationById(trip!.destinationId);
      if (dest) {
        const wData = await fetchWeather(dest.lat, dest.lng, dest.id);
        setWeather(wData);
      }
      setWeatherLoading(false);
    }
    loadWeather();
  }, [trip?.destinationId]);

  if (!trip) return null;

  // Recalculate values
  const budgetReport = getBudgetReport(trip.budgetLimit, trip.expenses);
  const totalItems = trip.packingList.length;
  const packedItems = trip.packingList.filter(p => p.packed).length;

  const handleTripStatusChange = (status: Trip['status']) => {
    const updated = { ...trip, status };
    tripService.saveTrip(updated);
    setTrip(updated);
  };

  // 1. Itinerary Actions
  const handleToggleActivity = (dayNumber: number, actId: string) => {
    const updatedItinerary = trip.itinerary.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.map(act => {
            if (act.id === actId) {
              const newCompleted = !act.completed;
              // Sync visited places
              let visited = [...trip.visitedPlaces];
              if (newCompleted) {
                if (actId.startsWith('ch') || actId.startsWith('pd') || actId.startsWith('ot')) {
                  visited.push(actId);
                }
              } else {
                visited = visited.filter(id => id !== actId);
              }
              return { ...act, completed: newCompleted };
            }
            return act;
          })
        };
      }
      return day;
    });

    const updatedTrip = { ...trip, itinerary: updatedItinerary };
    tripService.saveTrip(updatedTrip);
    setTrip(updatedTrip);
    tripService.recalculateTripProgress(trip.id);
    // Reload state from storage
    setTrip(tripService.getTripById(tripId) || null);
  };

  const handleAddActivitySubmit = (dayNumber: number) => {
    if (!actTitle) return;

    const newAct: ItineraryActivity = {
      id: Math.random().toString(36).substr(2, 9),
      title: actTitle,
      category: actCategory,
      time: actTime,
      duration: actDuration,
      description: actDesc,
      cost: actCost,
      locationName: actLoc || trip.destinationName,
      completed: false
    };

    const updatedItinerary = trip.itinerary.map(day => {
      if (day.dayNumber === dayNumber) {
        return { ...day, activities: [...day.activities, newAct].sort((a, b) => a.time.localeCompare(b.time)) };
      }
      return day;
    });

    const updatedTrip = { ...trip, itinerary: updatedItinerary };
    tripService.saveTrip(updatedTrip);
    setTrip(updatedTrip);
    setShowAddAct(null);
    resetActForm();
  };

  const handleDeleteActivity = (dayNumber: number, actId: string) => {
    const updatedItinerary = trip.itinerary.map(day => {
      if (day.dayNumber === dayNumber) {
        return { ...day, activities: day.activities.filter(a => a.id !== actId) };
      }
      return day;
    });

    const updatedTrip = { ...trip, itinerary: updatedItinerary };
    tripService.saveTrip(updatedTrip);
    setTrip(updatedTrip);
    tripService.recalculateTripProgress(trip.id);
    setTrip(tripService.getTripById(tripId) || null);
  };

  const resetActForm = () => {
    setActTitle('');
    setActCategory('nature');
    setActTime('10:00');
    setActDuration('2 hours');
    setActDesc('');
    setActCost(0);
    setActLoc('');
  };

  // 2. Expense Actions
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0 || !expDesc) return;

    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      amount: expAmount,
      category: expCategory,
      description: expDesc,
      date: expDate
    };

    tripService.saveExpense(trip.id, expense);
    setTrip(tripService.getTripById(trip.id) || null);
    setShowAddExp(false);
    setExpAmount(0);
    setExpDesc('');
  };

  const handleDeleteExpense = (id: string) => {
    tripService.deleteExpense(trip.id, id);
    setTrip(tripService.getTripById(trip.id) || null);
  };

  // 3. Packing Actions
  const handleTogglePacking = (itemId: string) => {
    const updatedPacking = trip.packingList.map(item => {
      if (item.id === itemId) return { ...item, packed: !item.packed };
      return item;
    });
    const updatedTrip = { ...trip, packingList: updatedPacking };
    tripService.saveTrip(updatedTrip);
    setTrip(updatedTrip);
  };

  const handleAddPackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packName) return;

    const newItem: PackingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: packName,
      category: packCategory,
      packed: false
    };

    tripService.savePackingItem(trip.id, newItem);
    setTrip(tripService.getTripById(trip.id) || null);
    setPackName('');
  };

  const handleDeletePacking = (id: string) => {
    tripService.deletePackingItem(trip.id, id);
    setTrip(tripService.getTripById(trip.id) || null);
  };

  const handleResetPacking = () => {
    const defaults = generatePackingList(trip.destinationId, trip.duration, weather?.condition || 'Clear', trip.interests, trip.travelStyle);
    const updatedTrip = { ...trip, packingList: defaults };
    tripService.saveTrip(updatedTrip);
    setTrip(updatedTrip);
  };

  // 4. Journal Actions
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress and convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setJPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jTitle || !jDesc) return;

    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: jTitle,
      date: jDate,
      location: jLoc || trip.destinationName,
      description: jDesc,
      photo: jPhoto || undefined
    };

    tripService.saveJournalEntry(trip.id, entry);
    setTrip(tripService.getTripById(trip.id) || null);
    setShowAddJournal(false);
    setJTitle('');
    setJLoc('');
    setJDesc('');
    setJPhoto('');
  };

  const handleDeleteJournal = (id: string) => {
    tripService.deleteJournalEntry(trip.id, id);
    setTrip(tripService.getTripById(trip.id) || null);
  };

  // 5. Custom Event Actions
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle || !evDesc) return;

    tripService.addCustomTripEvent(trip.id, evTitle, evDesc);
    setTrip(tripService.getTripById(trip.id) || null);
    setEvTitle('');
    setEvDesc('');
  };

  // Grouped parameters for Recharts
  const expenseData = Object.entries(
    trip.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Dynamic tabs definition
  const tabItems = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'itinerary', name: 'Itinerary', icon: Layers },
    { id: 'map', name: 'Map', icon: MapPin },
    { id: 'packing', name: 'Packing', icon: Briefcase },
    { id: 'expenses', name: 'Expenses', icon: Wallet },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'timeline', name: 'Timeline', icon: Clock },
    { id: 'safety', name: 'Safety', icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col font-sans transition-colors duration-200">
      
      {/* Tab Header Workspace Cover */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                Workspace: {trip.destinationName}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {trip.startDate} to {trip.endDate} ({trip.duration} Days)
            </p>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status:</span>
            <select
              value={trip.status}
              onChange={(e) => handleTripStatusChange(e.target.value as any)}
              className="py-1 px-2 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-xs font-bold focus:outline-none text-slate-900 dark:text-white uppercase tracking-wider"
            >
              <option value="upcoming" className="dark:bg-zinc-950">Upcoming</option>
              <option value="ongoing" className="dark:bg-zinc-950">Ongoing</option>
              <option value="completed" className="dark:bg-zinc-950">Completed</option>
            </select>
          </div>
        </div>

        {/* Workspace Tab bar */}
        <div className="flex border-t border-slate-100 dark:border-zinc-850 mt-6 pt-2 overflow-x-auto no-scrollbar gap-1">
          {tabItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  startTransition(() => {
                    setActiveTab(item.id);
                    // Sync router path state
                    const url = new URL(window.location.href);
                    url.searchParams.set('tab', item.id);
                    router.push(url.pathname + url.search);
                  });
                }}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Render Workspace */}
      <div className="flex-1 p-6 bg-slate-50 dark:bg-[#0f0f11] overflow-y-auto pb-24 md:pb-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Columns: Stats & Text Summaries */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Checklist Progress */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Trip Progress</h3>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-slate-500">Activities Completed</span>
                  <span className="text-blue-600 dark:text-blue-400">{trip.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${trip.progress}%` }}
                  />
                </div>
              </div>

              {/* AI-Style local compiler summary */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Trip Workspace Summary
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                  &quot;{tripService.getTripById(tripId)?.journalEntries.length || 0 ? 
                    trip.journalEntries[0].description.slice(0, 150) + '...' 
                    : 'No diary logs generated yet. Keep tracking activities to generate dynamic reviews!'}&quot;
                </p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg text-xs leading-normal text-blue-800 dark:text-blue-300">
                  {trip.status === 'upcoming' 
                    ? `Upcoming trip planned. Keep checklists completed to analyze your itinerary metrics.`
                    : `Currently logged ${trip.expenses.length} transactions totaling INR ${budgetReport.totalSpent.toLocaleString()}.`}
                </div>
              </div>

            </div>

            {/* Right Column: Weather Summary & Quick Actions */}
            <div className="space-y-6">
              
              {/* Weather Forecast Widget */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Weather Forecast</h3>
                {weatherLoading ? (
                  <div className="py-6 text-center">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
                  </div>
                ) : weather ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{weather.temp}°C</p>
                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mt-0.5">{weather.condition}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                        <p>Rain: {weather.rainProb}%</p>
                        <p>Humidity: {weather.humidity}%</p>
                        <p>Wind: {weather.wind} km/h</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-zinc-850 pt-3">
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Recommendation:</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        {weather.rainProb > 30 ? 'Rain is expected. Carry an umbrella.' : 'Favorable conditions. Perfect for walking tours.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Weather forecast not fetched.</p>
                )}
              </div>

              {/* Budget Health summary card */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Budget Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                    <span>Spent Limit</span>
                    <span>{budgetReport.spentPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        budgetReport.budgetStatus === 'over' 
                          ? 'bg-red-500' 
                          : budgetReport.budgetStatus === 'critical'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, budgetReport.spentPercentage)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Spent: ₹{budgetReport.totalSpent.toLocaleString()} / ₹{budgetReport.totalBudgetLimit.toLocaleString()}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6 max-w-4xl">
            {trip.itinerary.map(day => (
              <div key={day.dayNumber} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3 mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Day {day.dayNumber} — {day.date}
                  </h3>
                  <button
                    onClick={() => setShowAddAct(showAddAct === day.dayNumber ? null : day.dayNumber)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Activity
                  </button>
                </div>

                {/* Form: Add Activity */}
                {showAddAct === day.dayNumber && (
                  <div className="mb-6 p-4 rounded bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">New Activity Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Activity Title</label>
                        <input
                          type="text"
                          value={actTitle}
                          onChange={(e) => setActTitle(e.target.value)}
                          placeholder="e.g. Visit Botanical Garden"
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Category</label>
                        <select
                          value={actCategory}
                          onChange={(e) => setActCategory(e.target.value)}
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        >
                          <option value="nature">Nature</option>
                          <option value="food">Food</option>
                          <option value="culture">Culture</option>
                          <option value="adventure">Adventure</option>
                          <option value="shopping">Shopping</option>
                          <option value="spiritual">Spiritual</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Time</label>
                        <input
                          type="text"
                          value={actTime}
                          onChange={(e) => setActTime(e.target.value)}
                          placeholder="09:00"
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Duration</label>
                        <input
                          type="text"
                          value={actDuration}
                          onChange={(e) => setActDuration(e.target.value)}
                          placeholder="2 hours"
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Cost Estimate (INR)</label>
                        <input
                          type="number"
                          value={actCost}
                          onChange={(e) => setActCost(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Location Name</label>
                        <input
                          type="text"
                          value={actLoc}
                          onChange={(e) => setActLoc(e.target.value)}
                          placeholder="e.g. Ooty lake area"
                          className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Description</label>
                      <textarea
                        value={actDesc}
                        onChange={(e) => setActDesc(e.target.value)}
                        placeholder="Activity overview description..."
                        rows={2}
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowAddAct(null)}
                        className="px-3 py-1.5 border rounded text-xs font-semibold text-slate-700 dark:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddActivitySubmit(day.dayNumber)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                      >
                        Save Activity
                      </button>
                    </div>
                  </div>
                )}

                {/* Activities List Timeline */}
                <div className="space-y-4 relative pl-4 border-l border-slate-100 dark:border-zinc-800">
                  {day.activities.map(act => (
                    <div key={act.id} className="relative group">
                      
                      {/* Timeline node */}
                      <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                        act.completed ? 'bg-green-500' : 'bg-slate-300 dark:bg-zinc-700'
                      }`} />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={act.completed}
                            onChange={() => handleToggleActivity(day.dayNumber, act.id)}
                            className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                              {act.time} ({act.duration})
                            </span>
                            <h4 className={`text-sm font-bold mt-0.5 ${
                              act.completed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-900 dark:text-white'
                            }`}>
                              {act.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                              {act.description}
                            </p>
                            <div className="flex gap-2.5 text-[10px] text-slate-400 mt-2 font-medium">
                              <span>Location: {act.locationName}</span>
                              {act.cost > 0 && <span>Est: ₹{act.cost}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Action triggers */}
                        <button
                          onClick={() => handleDeleteActivity(day.dayNumber, act.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 rounded"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-4 shadow-sm h-[450px]">
              {(() => {
                const dest = getDestinationById(trip.destinationId) || DESTINATIONS[0];
                // Compile all activities that have coordinates
                const markers = trip.itinerary
                  .flatMap(day => day.activities)
                  .filter(act => act.lat !== undefined && act.lng !== undefined)
                  .map(act => ({
                    id: act.id,
                    title: act.title,
                    category: act.category,
                    lat: act.lat!,
                    lng: act.lng!,
                    time: act.time
                  }));

                return (
                  <MapComponent
                    centerLat={dest.lat}
                    centerLng={dest.lng}
                    markers={markers}
                  />
                );
              })()}
            </div>

            {/* Offline fallback details list */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Sightseeing Path Pins
              </h3>
              <div className="space-y-3">
                {trip.itinerary.flatMap(d => d.activities).map((act, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">{act.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Location: {act.locationName}</span>
                    </div>
                    {act.lat && act.lng ? (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.lat.toFixed(4)}°, {act.lng.toFixed(4)}°
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Coordinates fallback</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PACKING TAB */}
        {activeTab === 'packing' && (
          <div className="space-y-6 max-w-2xl">
            
            {/* Progress and resets */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Packing checklist</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    {packedItems} of {totalItems} items packed ({totalItems ? Math.round((packedItems / totalItems) * 100) : 0}%)
                  </p>
                </div>
                <button
                  onClick={handleResetPacking}
                  className="flex items-center gap-1.5 px-3 py-1 rounded border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 transition"
                  title="Reload default packing checklist"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalItems ? (packedItems / totalItems) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Form: Add Item */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Add Custom Item</h4>
              <form onSubmit={handleAddPackingSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  placeholder="e.g. Swimwear, Cardigan, Charger..."
                  className="flex-1 py-1.5 px-3 border rounded bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <select
                  value={packCategory}
                  onChange={(e) => setPackCategory(e.target.value)}
                  className="py-1.5 px-3 border rounded bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Toiletries">Toiletries</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Travel Essentials">Travel Essentials</option>
                  <option value="Activity Specific">Activity Specific</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shrink-0"
                >
                  Add Item
                </button>
              </form>
            </div>

            {/* Checklist categorized */}
            <div className="space-y-4">
              {['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Personal Care', 'Travel Essentials', 'Activity Specific'].map(cat => {
                const catItems = trip.packingList.filter(item => item.category === cat);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                      {cat}
                    </h4>
                    <div className="space-y-2">
                      {catItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-4 py-1">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.packed}
                              onChange={() => handleTogglePacking(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className={`text-xs font-medium ${item.packed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'}`}>
                              {item.name}
                            </span>
                            {item.isRecommended && (
                              <span className="text-[9px] text-blue-500 font-medium italic">
                                ({item.recommendationReason})
                              </span>
                            )}
                          </label>
                          <button
                            onClick={() => handleDeletePacking(item.id)}
                            className="text-slate-300 hover:text-red-500 transition p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 max-w-4xl">
            
            {/* Health alert banner */}
            {budgetReport.spentPercentage >= 75 && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                budgetReport.budgetStatus === 'over' 
                  ? 'bg-red-50/50 border-red-100 dark:bg-red-950/15 dark:border-red-900/50 text-red-700 dark:text-red-400' 
                  : 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/50 text-amber-800 dark:text-amber-400'
              }`}>
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {budgetReport.budgetStatus === 'over' ? 'Over budget limit!' : 'Budget Warning Alert!'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed">{budgetReport.statusMessage}</p>
                </div>
              </div>
            )}

            {/* Budget metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Budget Limit</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">₹{trip.budgetLimit.toLocaleString()}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Spent</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1 text-blue-600 dark:text-blue-400">
                  ₹{budgetReport.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Remaining</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">₹{budgetReport.remainingBudget.toLocaleString()}</span>
              </div>
            </div>

            {/* Recharts Analytics graphs */}
            {trip.expenses.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Spending Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Category Pie Chart */}
                  <div className="h-64 flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-500 mb-2">Category distribution</span>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `INR ${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-3 text-[10px] text-slate-500">
                      {expenseData.map((entry, index) => (
                        <span key={entry.name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          {entry.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category Bar Chart */}
                  <div className="h-64 flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-500 mb-2 font-sans">Expense breakdown</span>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenseData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => `INR ${value}`} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </div>
            )}

            {/* Form: Add Expense */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Log Expense transaction</h4>
                <button
                  onClick={() => setShowAddExp(!showAddExp)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                >
                  {showAddExp ? 'Close Form' : 'Log New Expense'}
                </button>
              </div>

              {showAddExp && (
                <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Amount (INR)</label>
                      <input
                        type="number"
                        min="1"
                        value={expAmount}
                        onChange={(e) => setExpAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Category</label>
                      <select
                        value={expCategory}
                        onChange={(e) => setExpCategory(e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Accommodation">Accommodation</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Activities">Activities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Date</label>
                      <input
                        type="date"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Description / Details</label>
                    <input
                      type="text"
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      placeholder="e.g. Traditional dinner or cab fare to viewpoints"
                      className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                    >
                      Save Transaction
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Expenses List Log */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Transaction Logs</h4>
              <div className="divide-y divide-slate-100 dark:divide-zinc-850">
                {trip.expenses.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No expenses logged yet. Log custom values above.</p>
                ) : (
                  trip.expenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center py-3">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{exp.description}</p>
                        <div className="flex gap-2 text-[9px] text-slate-400 font-semibold uppercase mt-1">
                          <span>{exp.category}</span>
                          <span>{exp.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">₹{exp.amount.toLocaleString()}</span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-slate-300 hover:text-red-500 transition p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="space-y-6 max-w-3xl">
            
            {/* Summary narrative card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                AI-Style Narrative Trip Review
              </h3>
              <p className="text-xs text-slate-500 leading-normal mb-4">
                This review is dynamically generated by our local summary compiler, aggregating all your checkoffs, expenditures, and memories.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-zinc-300 italic">
                {tripService.getTripById(tripId)?.journalEntries.length || 0 ? 
                  trip.journalEntries[0].description 
                  : 'No memory diaries logged yet. Capture your first entry below to generate reports!'}
              </div>
            </div>

            {/* Form: Add Journal */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Log Journal Diary Entry</h4>
                <button
                  onClick={() => setShowAddJournal(!showAddJournal)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                >
                  {showAddJournal ? 'Close Form' : 'Write Entry'}
                </button>
              </div>

              {showAddJournal && (
                <form onSubmit={handleAddJournalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Entry Title</label>
                      <input
                        type="text"
                        value={jTitle}
                        onChange={(e) => setJTitle(e.target.value)}
                        placeholder="e.g. Walk down the French promenade"
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Date</label>
                      <input
                        type="date"
                        value={jDate}
                        onChange={(e) => setJDate(e.target.value)}
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Location</label>
                      <input
                        type="text"
                        value={jLoc}
                        onChange={(e) => setJLoc(e.target.value)}
                        placeholder="French Quarter"
                        className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Memory Photo Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full mt-1 p-1 border rounded bg-transparent text-xs text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Diary notes</label>
                    <textarea
                      value={jDesc}
                      onChange={(e) => setJDesc(e.target.value)}
                      placeholder="Write your reflections here..."
                      rows={4}
                      className="w-full mt-1 p-2 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {jPhoto && (
                    <div className="mt-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Photo preview:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={jPhoto} alt="Upload preview" className="h-32 object-cover rounded mt-1 border border-slate-200 dark:border-zinc-800" />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                    >
                      Save Diary Memory
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Entries log */}
            <div className="space-y-4">
              {trip.journalEntries.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl">
                  No diary logs created. Log memories above.
                </p>
              ) : (
                trip.journalEntries.map(entry => (
                  <div key={entry.id} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
                    
                    {entry.photo && (
                      <div className="w-full h-48 relative border-b border-slate-100 dark:border-zinc-850">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.photo}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{entry.title}</h4>
                          <div className="flex gap-2.5 text-[10px] text-slate-400 font-bold uppercase mt-1">
                            <span>{entry.date}</span>
                            <span>Location: {entry.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteJournal(entry.id)}
                          className="text-slate-300 hover:text-red-500 transition p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-4 leading-relaxed whitespace-pre-line">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 max-w-2xl">
            
            {/* Form: Add Event */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Add Custom Event to Feed</h4>
              <form onSubmit={handleAddEventSubmit} className="space-y-3">
                <input
                  type="text"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="e.g. Flight Departure or Boarded Cab"
                  className="w-full py-1.5 px-3 border rounded bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <textarea
                  value={evDesc}
                  onChange={(e) => setEvDesc(e.target.value)}
                  placeholder="Event details description..."
                  rows={2}
                  className="w-full py-1.5 px-3 border rounded bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>

            {/* Timeline Feed chronological list */}
            <div className="relative pl-6 border-l border-slate-200 dark:border-zinc-800 space-y-6">
              {[...trip.events].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((ev) => {
                const date = new Date(ev.timestamp);
                const dateText = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={ev.id} className="relative">
                    
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block uppercase tracking-wider">{dateText}</span>
                      <h4 className="text-xs font-extrabold text-slate-950 dark:text-white mt-0.5">{ev.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">{ev.description}</p>
                      {ev.cost && (
                        <span className="inline-block mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                          Cost: ₹{ev.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* SAFETY TAB */}
        {activeTab === 'safety' && (
          <div className="space-y-6 max-w-3xl">
            {(() => {
              const dest = getDestinationById(trip.destinationId) || DESTINATIONS[0];
              return (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
                  
                  {/* Title */}
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-base">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Safety guidelines for {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Local helpline numbers and emergency advice.</p>
                  </div>

                  {/* Helplines Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-850 pt-6">
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Police Force</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{dest.emergencyContacts.police}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-950/20 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hospital</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{dest.emergencyContacts.hospital}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fire Force</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{dest.emergencyContacts.fire}</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Advice Checklist */}
                  <div className="border-t border-slate-100 dark:border-zinc-850 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                      Safety Advisories & Warnings
                    </h4>
                    <div className="space-y-3">
                      {dest.safetyTips.map((tip: string, idx: number) => (
                        <div key={idx} className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/50 rounded text-xs text-amber-800 dark:text-amber-400 flex gap-2.5">
                          <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 rounded border border-slate-100 dark:border-zinc-850 text-xs text-slate-500 mt-6 leading-relaxed">
                    National Emergency Helpline (India) is <span className="font-bold text-slate-800 dark:text-zinc-200">112</span>. Accessing hospitals can also be queried through our Map view.
                  </div>

                </div>
              );
            })()}
          </div>
        )}

      </div>

      {/* Floating RouteWise Assistant panel in corner */}
      <AssistantDrawer trip={trip} />

    </div>
  );
}

// Side / Bottom slide-out assistant panel
import { askRouteWiseAssistant } from '@/lib/intelligence/travelAssistantEngine';

function AssistantDrawer({ trip }: { trip: Trip | null }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string; suggestions?: string[] }[]>([]);

  useEffect(() => {
    // Set initial greeting
    if (messages.length === 0 && trip) {
      const response = askRouteWiseAssistant('', trip);
      setMessages([{ sender: 'assistant', text: response.answer, suggestions: response.suggestions }]);
    }
  }, [trip, messages.length]);

  const handleSend = (textToSend = query) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    setTimeout(() => {
      const response = askRouteWiseAssistant(textToSend, trip);
      setMessages(prev => [...prev, { sender: 'assistant', text: response.answer, suggestions: response.suggestions }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 right-6 z-50 font-sans">
      
      {/* Drawer Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition duration-200 focus:outline-none"
        title="RouteWise Intelligent Assistant"
      >
        <Compass className={`w-6 h-6 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute bottom-14 right-0 w-80 md:w-96 h-96 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm">RouteWise Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
              Close
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-50 dark:bg-zinc-950/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-normal shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  
                  {/* Inline suggestions */}
                  {msg.sender === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-400 font-semibold text-[9px] border border-slate-200/50 dark:border-zinc-750 transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-zinc-800 flex gap-2 shrink-0 bg-white dark:bg-zinc-900">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about packing, budget, itinerary..."
              className="flex-1 py-1.5 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
