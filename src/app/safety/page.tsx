'use client';

import React, { useState } from 'react';
import {
  Shield,
  Phone,
  Plus,
  AlertTriangle,
  Info,
  MapPin,
  CheckSquare,
  FileText
} from 'lucide-react';
import { DESTINATIONS } from '@/lib/intelligence/destinationEngine';

export default function SafetyCenterPage() {
  const [selectedDestId, setSelectedDestId] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Download offline maps for the destination area.', checked: true },
    { id: 2, text: 'Backup passport, visa, and IDs to cloud/local storage.', checked: true },
    { id: 3, text: 'Inform a family member or friend of your exact itinerary.', checked: false },
    { id: 4, text: 'Check weather forecasts and warning alerts.', checked: false },
    { id: 5, text: 'Keep a physical copy of emergency numbers in your wallet.', checked: false },
    { id: 6, text: 'Prepare a basic first-aid kit with personal prescriptions.', checked: false }
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const selectedDest = DESTINATIONS.find(d => d.id === selectedDestId);

  return (
    <div className="flex-grow p-6 md:p-10 bg-slate-50 dark:bg-[#0f0f11] min-h-screen pb-20 md:pb-10 font-sans transition-colors duration-200">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Safety Center
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Access immediate emergency resources, local safety guidelines, and trip preparation checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Localized Safety Finder */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Destination Specific Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Destination Specific Guidelines
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              Select your travel destination to retrieve local emergency contacts and safety advisories.
            </p>

            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-white mb-6"
            >
              <option value="" className="dark:bg-zinc-950">Select a Destination</option>
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id} className="dark:bg-zinc-950">{d.name}</option>
              ))}
            </select>

            {selectedDest ? (
              <div className="space-y-6 border-t border-slate-100 dark:border-zinc-800 pt-6">
                
                {/* Local Helplines */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Local Emergency Numbers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Police</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedDest.emergencyContacts.police}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <Phone className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hospital / Medical</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedDest.emergencyContacts.hospital}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800 rounded flex items-center gap-3">
                      <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fire Force</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedDest.emergencyContacts.fire}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Tips */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
                    Safety Advisories for {selectedDest.name}
                  </h4>
                  <div className="space-y-2">
                    {selectedDest.safetyTips.map((tip, idx) => (
                      <div key={idx} className="p-3 rounded bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-400 flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 rounded text-slate-400 text-xs">
                Select a destination from the list above to show localized helplines and safety warnings.
              </div>
            )}
          </div>

          {/* Emergency Preparation Checklist */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Pre-Trip Safety Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              Complete these tasks before departure to ensure a secure travel experience.
            </p>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-center gap-3 p-3 rounded border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/30 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 w-4 h-4 shrink-0 pointer-events-none"
                  />
                  <span className={`flex-1 font-medium ${item.checked ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-700 dark:text-zinc-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: General Safety Advice */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                <FileText className="w-4.5 h-4.5 text-blue-600" />
                General Guidelines
              </h3>
              <p className="text-xs text-slate-500 mt-1">Universal guidelines for safe travel</p>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-zinc-200">Secure Digital Vault</h4>
                  <p className="mt-0.5">Always store scans of tickets and credentials in secure local folders or secure online portals.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-zinc-200">Emergency Funds</h4>
                  <p className="mt-0.5">Keep cash split in different luggage compartments. Do not store all currency in a single pocket.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-zinc-200">Local Customs</h4>
                  <p className="mt-0.5">Familiarize yourself with local culture dress-codes and customs before visiting remote spiritual shrines.</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider block mb-1">
                National Helpline (India)
              </span>
              <span className="text-lg font-extrabold text-blue-800 dark:text-blue-300 block">
                112
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">
                Single emergency helpline number for all emergency demands across India.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
