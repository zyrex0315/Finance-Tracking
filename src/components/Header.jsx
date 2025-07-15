import React, { useEffect, useState } from 'react';
import { Bell, Menu, Search, Sun, Moon, X } from 'lucide-react';
import { calculateTotalBalance } from '../data/mockData.js';

export default function Header({ activePage, setActivePage }) {
  const balance = calculateTotalBalance();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar */}
          <div className="relative w-64 bg-white dark:bg-gray-900 h-full shadow-lg z-50 flex flex-col p-6">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
            <nav className="mt-10 space-y-4">
              <button onClick={() => { setActivePage('Dashboard'); setSidebarOpen(false); }} className={`block text-left w-full text-lg font-medium px-0 py-2 rounded ${activePage === 'Dashboard' ? 'text-indigo-600' : 'text-gray-800 dark:text-gray-100'} hover:text-indigo-600`}>Dashboard</button>
              <button onClick={() => { setActivePage('Transactions'); setSidebarOpen(false); }} className={`block text-left w-full text-lg font-medium px-0 py-2 rounded ${activePage === 'Transactions' ? 'text-indigo-600' : 'text-gray-800 dark:text-gray-100'} hover:text-indigo-600`}>Transactions</button>
              <button onClick={() => { setActivePage('Budget'); setSidebarOpen(false); }} className={`block text-left w-full text-lg font-medium px-0 py-2 rounded ${activePage === 'Budget' ? 'text-indigo-600' : 'text-gray-800 dark:text-gray-100'} hover:text-indigo-600`}>Budget</button>
              <button onClick={() => { setActivePage('Reports'); setSidebarOpen(false); }} className={`block text-left w-full text-lg font-medium px-0 py-2 rounded ${activePage === 'Reports' ? 'text-indigo-600' : 'text-gray-800 dark:text-gray-100'} hover:text-indigo-600`}>Reports</button>
            </nav>
          </div>
        </div>
      )}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 flex items-center justify-between">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      
      <div className="hidden sm:block">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500 dark:text-gray-400" />}
        </button>
        <div className="hidden sm:block text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
          <p className="font-semibold text-gray-800 dark:text-gray-100">NRs.{balance.toLocaleString('en-US')}</p>
        </div>
        
        
        
        <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src="/Finance-Tracking/118238820.jpg"
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
    </>
  );
}
