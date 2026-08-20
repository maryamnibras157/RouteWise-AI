'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Map,
  Shield,
  Layers,
  CheckCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { authService } from '@/lib/storage/storageService';

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#0f0f11] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">
            RouteWise AI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Introducing RouteWise AI
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-3xl leading-tight">
          RouteWise AI
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-3 mb-6">
          Your Intelligent Travel Companion
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10">
          Plan smarter, capture every moment, and travel with confidence. RouteWise is the local-first, offline-ready travel workspace that puts all your trip information in one elegant space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-16">
          <Link
            href={isLoggedIn ? "/plan" : "/signup"}
            className="flex items-center justify-center gap-2 px-6 h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition"
          >
            Plan Your Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="flex items-center justify-center h-12 px-6 rounded-md border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-medium transition"
          >
            Explore RouteWise
          </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="w-full max-w-4xl rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden text-left p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              routewiseai.vercel.app/dashboard
            </div>
            <div className="w-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Stats */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Upcoming Destination</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">Pondicherry</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Departure: In 2 Days</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Total Travel Days</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">7 Days</p>
              </div>
            </div>

            {/* Middle Column: Current Trip Progress */}
            <div className="md:col-span-2 p-5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Active Trip: Chennai to Ooty</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">4 Days, 4 Travelers</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 text-xs font-semibold">Completed</span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Itinerary Completed</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-full" />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 dark:border-zinc-800 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Budget Limit</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">INR 15,000</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Spent</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 text-blue-600 dark:text-blue-400">INR 12,100</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Items Packed</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">7 of 7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-[#121214] py-20 px-6 md:px-12 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              One Workspace for Every Journey
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 mt-4">
              Everything you need to plan, track, and enjoy your travels, consolidated into a clean, modern interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Intelligent Trip Planning</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Generate tailored, day-by-day itineraries instantly based on your destination, duration, budget tier, and interests. Works completely locally.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Expense Tracker</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Categorize budgets, track purchases, and visualize where your money goes. Receive prompt warnings as you approach 75%, 90%, and 100% limits.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Context-Aware Packing</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Get a checklist custom generated for your trip. Auto-suggests beach gear for coasts, sweaters for hill stations, and umbrellas for rainy days.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <Map className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Open Maps Integration</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Visualize itineraries on interactive maps powered by OpenStreetMap + Leaflet. Robust coordinate fallbacks keep it running without internet access.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trip Memories & Timeline</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Maintain a trip journal with notes and photo placeholders. Aggregate everything—activities, spends, notes—into a unified chronological timeline feed.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Emergency Safety Center</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Access local police, fire, and medical contacts for specific destinations. Get offline emergency checkups and safety guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 md:px-12 bg-slate-50 dark:bg-[#0f0f11]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-16 tracking-tight">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-left">
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-blue-600 mb-2 font-mono">01</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Enter Details</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Specify dates, budget cap, number of travelers, and interests.</p>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-blue-600 mb-2 font-mono">02</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Build Plan</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">The local engine curates matching spots into an itinerary.</p>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-blue-600 mb-2 font-mono">03</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Customize</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Mark items complete, add custom events, or adjust expenditures.</p>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-blue-600 mb-2 font-mono">04</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Capture</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Note down thoughts, save expense logs, and add trip memories.</p>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-blue-600 mb-2 font-mono">05</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">Review</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Read a complete compiled summary and look back at stats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-slate-900 dark:bg-zinc-950 text-white py-16 px-6 text-center border-t border-slate-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Better?</h2>
          <p className="text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
            Plan your next journey with RouteWise. Sign up in seconds to start building your travel companion dashboard. No internet keys required.
          </p>
          <Link
            href={isLoggedIn ? "/plan" : "/signup"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Plan Your Next Journey
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
          <p className="text-xs text-slate-500 mt-12">
            RouteWise AI © {new Date().getFullYear()}. All Rights Reserved. Built locally and securely.
          </p>
        </div>
      </section>
    </div>
  );
}
