'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  MapPin,
  Calendar,
  Wallet,
  Star,
  Sparkles,
  ArrowRight,
  Heart,
  Info
} from 'lucide-react';
import { DESTINATIONS } from '@/lib/intelligence/destinationEngine';
import { getRecommendations, RecommendedDestination } from '@/lib/intelligence/recommendationEngine';
import { settingsService } from '@/lib/storage/storageService';
import { Settings } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [userSettings, setUserSettings] = useState<Settings | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedDestination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);

  useEffect(() => {
    const settings = settingsService.getSettings();
    setUserSettings(settings);

    // Initial recommendations
    const recs = getRecommendations(
      settings.preferredInterests,
      settings.defaultCurrency === 'INR' ? 'moderate' : 'premium', // Map default pricing
      settings.travelStyle
    );
    setRecommendations(recs);
  }, []);

  // Recalculate recommendations on search query filter
  const filteredRecommendations = recommendations.filter(rec =>
    rec.destination.name.toLowerCase().includes(query.toLowerCase()) ||
    rec.destination.description.toLowerCase().includes(query.toLowerCase())
  );

  const handlePlanClick = (destId: string) => {
    // Navigate to planner with pre-selected destination query parameter
    router.push(`/plan?destination=${destId}`);
  };

  const selectedRec = recommendations.find(r => r.destination.id === selectedDestId);

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Destinations
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Intelligent destination suggestions tailored to your interests and travel profile.
        </p>
      </div>

      {/* Main Grid: Search and List on Left, Detail Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Search & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations (e.g. Ooty, Pondicherry, Goa...)"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs transition"
            />
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Scored Suggestions
            </h3>

            {filteredRecommendations.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-zinc-400">No destinations match your search query.</p>
              </div>
            ) : (
              filteredRecommendations.map((rec) => {
                const dest = rec.destination;
                const isSelected = selectedDestId === dest.id;
                
                return (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDestId(dest.id)}
                    className={`bg-white dark:bg-zinc-900 border p-5 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20'
                        : 'border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{dest.name}</h4>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 px-2 py-0.5 rounded">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          {rec.score}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 line-clamp-2">
                        {dest.description}
                      </p>

                      <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {dest.bestTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5" />
                          {dest.budgetEstimate}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium italic line-clamp-1 flex-1 pr-4">
                        {rec.matchReason}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-blue-600 flex items-center gap-1 shrink-0">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Destination Details Preview */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Destination Summary
          </h3>

          {selectedRec ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {selectedRec.destination.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal Season: {selectedRec.destination.bestTime}
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-b border-slate-100 dark:border-zinc-800/80 py-4">
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-1 uppercase tracking-wider text-[10px]">Overview</h4>
                <p>{selectedRec.destination.description}</p>
              </div>

              {/* Attractions */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">Top Attractions</h4>
                <div className="space-y-2">
                  {selectedRec.destination.attractions.map(attr => (
                    <div key={attr.id} className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950/40 p-2 rounded border border-slate-100 dark:border-zinc-800 text-xs">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{attr.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{attr.category}</p>
                      </div>
                      <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        {attr.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuisines */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">Must-Try Cuisines</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRec.destination.cuisines.map(food => (
                    <span key={food} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2 py-1 rounded font-medium">
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handlePlanClick(selectedRec.destination.id)}
                  className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  Plan Trip to {selectedRec.destination.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm text-center text-slate-400 py-16 flex flex-col items-center justify-center">
              <Info className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs">Click on any destination card to display detailed sightseeing, cuisines, and planning options here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
