'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Compass,
  PlusCircle,
  Wallet,
  BookOpen,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { authService } from '@/lib/storage/storageService';
import { User as UserType } from '@/types';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load current user
    const user = authService.getCurrentUser();
    if (!user && pathname !== '/' && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    } else {
      setCurrentUser(user);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  // If we are on public pages or login, do not show side/bottom nav
  const isAuthPage = ['/', '/login', '/signup'].includes(pathname);
  if (isAuthPage) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', href: '/trips', icon: Calendar },
    { name: 'Plan Trip', href: '/plan', icon: PlusCircle },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Expenses', href: '/expenses', icon: Wallet },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Safety', href: '/safety', icon: Shield },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#18181b] border-r border-slate-200 dark:border-zinc-800 h-screen sticky top-0">
        {/* Branding Wordmark */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">
              RouteWise AI
            </span>
          </Link>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER (Only mobile/tablet) */}
      <header className="md:hidden h-14 bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 z-40 sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-base text-slate-950 dark:text-white">
            RouteWise
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-600 dark:text-zinc-300 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
        </button>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white dark:bg-[#18181b] z-50 overflow-y-auto flex flex-col p-4">
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-200 dark:border-zinc-800 pt-4 pb-16">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all text-left"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION TAB BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-[#18181b] border-t border-slate-200 dark:border-zinc-800 flex items-center justify-around px-2 z-40">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-12 h-full text-slate-500 dark:text-zinc-400 ${
            pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </Link>

        <Link
          href="/trips"
          className={`flex flex-col items-center justify-center w-12 h-full text-slate-500 dark:text-zinc-400 ${
            pathname.startsWith('/trips') ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Trips</span>
        </Link>

        <Link
          href="/plan"
          className={`flex flex-col items-center justify-center w-12 h-full text-slate-500 dark:text-zinc-400 ${
            pathname === '/plan' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Plan</span>
        </Link>

        <Link
          href="/explore"
          className={`flex flex-col items-center justify-center w-12 h-full text-slate-500 dark:text-zinc-400 ${
            pathname === '/explore' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Explore</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-12 h-full text-slate-500 dark:text-zinc-400 ${
            pathname === '/settings' ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Profile</span>
        </Link>
      </div>
    </>
  );
}
