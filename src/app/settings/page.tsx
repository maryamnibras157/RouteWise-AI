'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings as SettingsIcon,
  User,
  Heart,
  Briefcase,
  Moon,
  Sun,
  Bell,
  Trash2,
  Check,
  Save,
  Activity
} from 'lucide-react';
import { settingsService } from '@/lib/storage/storageService';
import { Settings } from '@/types';

const INTEREST_OPTIONS = [
  'Nature', 'Adventure', 'History', 'Culture', 'Food', 'Shopping',
  'Nightlife', 'Photography', 'Relaxation', 'Family', 'Spiritual', 'Architecture'
];

const STYLE_OPTIONS = [
  { id: 'relaxed', name: 'Relaxed' },
  { id: 'balanced', name: 'Balanced' },
  { id: 'fast-paced', name: 'Fast-paced' },
  { id: 'backpacker', name: 'Backpacker' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'family-friendly', name: 'Family-friendly' }
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loaded = settingsService.getSettings();
    setSettings(loaded);
  }, []);

  const handleInterestToggle = (interest: string) => {
    if (!settings) return;
    const current = settings.preferredInterests;
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setSettings({ ...settings, preferredInterests: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    settingsService.saveSettings(settings);

    // Apply theme changes instantly to document HTML
    const theme = settings.theme;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 600);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all workspace data? This will delete all custom trips, expenses, journals, and restore default demo data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!settings) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 dark:bg-[#0f0f11] min-h-screen">
        <Activity className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Customize your default traveler preferences, currency configurations, and app theme.
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section: Profile Info */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Traveler Profile
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Preferred Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Section: Default Travel Preferences */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-600" />
              Default Travel Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Preferred Interests (Select Multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const active = settings.preferredInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`py-1.5 px-3 rounded border text-xs font-medium flex items-center justify-between transition ${
                          active
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <span>{interest}</span>
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Default Travel Style
                </label>
                <select
                  value={settings.travelStyle}
                  onChange={(e) => setSettings({ ...settings, travelStyle: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="dark:bg-zinc-950">
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: App Settings */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-blue-600" />
              Application Preferences
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Default Currency
                  </label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                  >
                    <option value="INR" className="dark:bg-zinc-950">INR (₹)</option>
                    <option value="USD" className="dark:bg-zinc-950">USD ($)</option>
                    <option value="EUR" className="dark:bg-zinc-950">EUR (€)</option>
                    <option value="GBP" className="dark:bg-zinc-950">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Interface Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                    className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                  >
                    <option value="light" className="dark:bg-zinc-950">Light Mode</option>
                    <option value="dark" className="dark:bg-zinc-950">Dark Mode</option>
                    <option value="system" className="dark:bg-zinc-950">System Sync</option>
                  </select>
                </div>
              </div>

              {/* Notification toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950/40 rounded border border-slate-100 dark:border-zinc-850">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Local Reminders</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Alert me when budget health reaches warning levels or packing is incomplete.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            
            {success && (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                Settings saved successfully!
              </span>
            )}
          </div>
        </form>

        {/* Section: Dangerous / Reset Options */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/40 rounded-xl p-6">
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Trash2 className="w-4.5 h-4.5" />
              Reset Workspace Data
            </h3>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-normal mb-4">
              This action will permanently delete all your custom travel plans, saved budgets, journal notes, and profile settings, and re-seed the system with default trips. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleResetData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition shadow-sm"
            >
              Reset All Workspace Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
