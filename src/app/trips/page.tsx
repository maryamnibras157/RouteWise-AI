'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Compass,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  Clock,
  CheckCircle,
  MapPin,
  Wallet,
  Settings,
  Edit2
} from 'lucide-react';
import { tripService } from '@/lib/storage/storageService';
import { Trip } from '@/types';

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState(0);

  useEffect(() => {
    setTrips(tripService.getTrips());
  }, []);

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
      setTrips(tripService.getTrips());
    }
  };

  const handleStartEditBudget = (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingTripId(trip.id);
    setNewBudget(trip.budgetLimit);
  };

  const handleSaveBudget = (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = { ...trip, budgetLimit: newBudget };
    tripService.saveTrip(updated);
    setTrips(tripService.getTrips());
    setEditingTripId(null);
  };

  const ongoingTrips = trips.filter(t => t.status === 'ongoing');
  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');

  const filteredTrips = () => {
    switch (activeTab) {
      case 'ongoing': return ongoingTrips;
      case 'upcoming': return upcomingTrips;
      case 'completed': return completedTrips;
      default: return trips;
    }
  };

  return (
    <div className="flex-grow p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Journeys
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Review and manage all your active, planned, and past travels.
          </p>
        </div>
        <Link
          href="/plan"
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-6 overflow-x-auto no-scrollbar">
        {(['all', 'ongoing', 'upcoming', 'completed'] as const).map(tab => {
          const count = tab === 'all' ? trips.length : trips.filter(t => t.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Trips Grid */}
      {filteredTrips().length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-center max-w-md mx-auto my-12 shadow-xs">
          <Calendar className="w-10 h-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No trips found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            There are no journeys matching this category.
          </p>
          <Link
            href="/plan"
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs"
          >
            Create a Plan Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips().map(trip => {
            const tripSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
            const isEditing = editingTripId === trip.id;

            return (
              <div
                key={trip.id}
                onClick={() => !isEditing && router.push(`/trips/${trip.id}`)}
                className={`bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${
                  isEditing ? 'ring-2 ring-blue-500/20 border-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {trip.destinationName}
                      </h3>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                      trip.status === 'ongoing'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                        : trip.status === 'completed'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {trip.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {trip.startDate} to {trip.endDate} ({trip.duration} Days)
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Budget Cap</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-1" onClick={e => e.stopPropagation()}>
                          <span className="text-xs text-slate-600 dark:text-zinc-400">₹</span>
                          <input
                            type="number"
                            value={newBudget}
                            onChange={(e) => setNewBudget(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 px-1 py-0.5 border rounded bg-transparent text-xs text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={(e) => handleSaveBudget(trip, e)}
                            className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                            ₹{trip.budgetLimit.toLocaleString()}
                          </span>
                          <button
                            onClick={(e) => handleStartEditBudget(trip, e)}
                            className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600"
                            title="Edit Budget"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
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
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                      <span>Activities Completed</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="px-6 py-3 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Open Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDuplicate(trip.id, e)}
                      title="Duplicate Journey"
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      title="Delete Journey"
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
      )}
    </div>
  );
}
