'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Activity, Compass, Plus } from 'lucide-react';
import { tripService } from '@/lib/storage/storageService';

export default function ExpensesLanding() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasTrip, setHasTrip] = useState(false);

  useEffect(() => {
    const trips = tripService.getTrips();
    // Find ongoing or nearest upcoming trip
    const active = trips.find(t => t.status === 'ongoing') || trips.find(t => t.status === 'upcoming') || trips[0];
    
    if (active) {
      router.replace(`/trips/${active.id}?tab=expenses`);
    } else {
      setHasTrip(false);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 dark:bg-[#0f0f11] min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading expenses tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active trip found</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto">
          We need an active travel itinerary to log your expenses. Create a trip or open an existing one to track currency metrics.
        </p>
        <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href="/plan"
            className="py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
          >
            Plan a New Trip
          </Link>
          <Link
            href="/dashboard"
            className="py-2.5 rounded border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold text-xs hover:bg-slate-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
