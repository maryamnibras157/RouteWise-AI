'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Check,
  CheckCircle,
  Activity,
  Heart,
  Briefcase
} from 'lucide-react';
import { DESTINATIONS } from '@/lib/intelligence/destinationEngine';
import { generateItinerary } from '@/lib/intelligence/itineraryEngine';
import { generatePackingList } from '@/lib/intelligence/packingEngine';
import { estimateTripCost } from '@/lib/intelligence/budgetEngine';
import { tripService } from '@/lib/storage/storageService';
import { Trip, PackingItem, ItineraryDay } from '@/types';

const INTEREST_OPTIONS = [
  'Nature', 'Adventure', 'History', 'Culture', 'Food', 'Shopping',
  'Nightlife', 'Photography', 'Relaxation', 'Family', 'Spiritual', 'Architecture'
];

const STYLE_OPTIONS = [
  { id: 'relaxed', name: 'Relaxed', desc: 'Slower pace, fewer activities, more downtime.' },
  { id: 'balanced', name: 'Balanced', desc: 'A moderate mix of sights, meals, and rest.' },
  { id: 'fast-paced', name: 'Fast-paced', desc: 'Jam-packed days, maximizing places seen.' },
  { id: 'backpacker', name: 'Backpacker', desc: 'Focus on low-cost options, hostels, public transit.' },
  { id: 'luxury', name: 'Luxury', desc: 'Premium accommodation, private transport, fine dining.' },
  { id: 'family-friendly', name: 'Family-friendly', desc: 'Safe, easy-going attractions fit for kids and elders.' }
];

export default function TripPlanner() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [destinationId, setDestinationId] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [budgetLimit, setBudgetLimit] = useState(10000);
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'premium' | 'luxury'>('moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState('balanced');

  // Generation Loading State
  const [generating, setGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState<Trip | null>(null);

  const duration = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Run intelligence engines to draft trip
  const handleGenerate = () => {
    if (!destinationId || !startDate || !endDate) return;

    setGenerating(true);
    
    // Simulate generation loading delay
    setTimeout(() => {
      const dest = DESTINATIONS.find(d => d.id === destinationId);
      if (!dest) return;

      const itinerary = generateItinerary(destinationId, startDate, duration, budgetLevel, selectedInterests, travelStyle);
      const packingList = generatePackingList(destinationId, duration, 'Clear', selectedInterests, travelStyle);
      const estimation = estimateTripCost(duration, travelers, budgetLevel);

      const tripId = Math.random().toString(36).substr(2, 9);
      
      const newTrip: Trip = {
        id: tripId,
        destinationId,
        destinationName: dest.name,
        startDate,
        endDate,
        duration,
        travelers,
        budgetLevel,
        budgetLimit,
        interests: selectedInterests,
        travelStyle,
        itinerary,
        packingList,
        expenses: [],
        journalEntries: [],
        status: 'upcoming',
        visitedPlaces: [],
        progress: 0,
        events: [
          {
            id: Math.random().toString(36).substr(2, 9),
            type: 'custom',
            title: 'Trip Workspace Created',
            description: `Generated itinerary and packing guide for ${dest.name}`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      setGeneratedTrip(newTrip);
      setGenerating(false);
      setStep(7);
    }, 1500);
  };

  const handleSave = () => {
    if (!generatedTrip) return;
    tripService.saveTrip(generatedTrip);
    router.push(`/trips/${generatedTrip.id}`);
  };

  return (
    <div className="flex-grow p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        
        {/* Step Indicator */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              <span>Step {step} of 6</span>
              <span>{Math.round(((step - 1) / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    step >= i ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Destination Selection */}
        {step === 1 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Where are you headed?
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Select your travel destination and starting hub.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Destination
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                >
                  <option value="" disabled className="dark:bg-zinc-950">Select a Destination</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id} className="dark:bg-zinc-950">
                      {d.name} — {d.bestTime}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Starting Point
                </label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g. Chennai International Airport"
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={nextStep}
                disabled={!destinationId}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition disabled:opacity-50"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Travel Dates */}
        {step === 2 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Select Dates
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Choose your travel period. Duration will calculate automatically.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {duration > 0 && (
              <div className="mt-6 p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 rounded text-center text-sm font-semibold">
                Total Duration: {duration} Days
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded font-medium text-slate-700 dark:text-zinc-200 text-sm hover:bg-slate-50 dark:hover:bg-zinc-850 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!startDate || !endDate || duration <= 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition disabled:opacity-50"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Travelers */}
        {step === 3 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              How many travelers?
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Select the size of your group.
            </p>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Number of Travelers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={travelers}
                onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
              />
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded font-medium text-slate-700 dark:text-zinc-200 text-sm hover:bg-slate-50 dark:hover:bg-zinc-850 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Budget Configuration */}
        {step === 4 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Budget details
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Provide your overall spending target cap and pick a style tier.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Total Budget Cap (INR)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Budget Style Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['budget', 'moderate', 'premium', 'luxury'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setBudgetLevel(lvl)}
                      className={`py-2 px-3 rounded border text-xs font-semibold capitalize text-center transition ${
                        budgetLevel === lvl
                          ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded font-medium text-slate-700 dark:text-zinc-200 text-sm hover:bg-slate-50 dark:hover:bg-zinc-850 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={budgetLimit <= 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition disabled:opacity-50"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Interests Selection */}
        {step === 5 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              What are your interests?
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Select multiple tags to personalize recommendations.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`py-2.5 px-3 rounded border text-xs font-semibold flex items-center justify-between transition ${
                      active
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <span>{interest}</span>
                    {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded font-medium text-slate-700 dark:text-zinc-200 text-sm hover:bg-slate-50 dark:hover:bg-zinc-850 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Travel Style Selection */}
        {step === 6 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Choose travel style
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              This configures the daily pace and recommendations.
            </p>

            <div className="mt-6 space-y-3">
              {STYLE_OPTIONS.map((opt) => {
                const active = travelStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTravelStyle(opt.id)}
                    className={`w-full p-4 rounded border text-left flex items-start justify-between transition ${
                      active
                        ? 'border-blue-600 bg-blue-50/20 text-blue-700 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white capitalize">{opt.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal">{opt.desc}</p>
                    </div>
                    {active && <Check className="w-4 h-4 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded font-medium text-slate-700 dark:text-zinc-200 text-sm hover:bg-slate-50 dark:hover:bg-zinc-850 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition shadow-sm disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate My Plan
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Plan Review & Save */}
        {step === 7 && generatedTrip && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Draft Prepared!</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Your personalized travel workspace is ready for review.
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Destination</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{generatedTrip.destinationName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Duration</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{generatedTrip.duration} Days</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Travelers</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{generatedTrip.travelers}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Budget Limit</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">₹{generatedTrip.budgetLimit.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-lg space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Personalization Summary
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-normal">
                  - Curated <span className="font-semibold">{generatedTrip.itinerary.reduce((sum, d) => sum + d.activities.length, 0)} activities</span> across {generatedTrip.duration} days.
                </p>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-normal">
                  - Generated <span className="font-semibold">{generatedTrip.packingList.length} checklist items</span> adjusted for {generatedTrip.destinationName}.
                </p>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-normal">
                  - Budget level set to <span className="font-semibold capitalize">{generatedTrip.budgetLevel}</span> with customized activity estimates.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(6)}
                className="flex-1 py-2.5 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-850 font-semibold text-sm transition"
              >
                Reconfigure
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
              >
                Save and Open Workspace
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
