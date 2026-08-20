'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/lib/storage/storageService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, skip to dashboard
    const user = authService.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    // Simulate mock network latency
    setTimeout(() => {
      const user = authService.login(email);
      setLoading(false);
      if (user) {
        router.push('/dashboard');
      } else {
        setError('No account found with this email. Click Sign Up below to create a demo profile.');
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0f0f11] px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
            Sign in to access your RouteWise workspace
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
              For demo mode, you can type any email or use our pre-seeded data.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-zinc-800 rounded bg-transparent dark:bg-zinc-950 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Don&#39;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
