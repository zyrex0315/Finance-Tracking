import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { calculateTotalBalance } from '../data/mockData.js';
import { useLocation, Link } from 'react-router-dom';

export default function Header() {
  const balance = calculateTotalBalance();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/transactions':
        return 'Transactions';
      case '/reports':
        return 'Reports';
      case '/budget':
        return 'Budget';
      default:
        return 'Dashboard';
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Reports', path: '/reports' },
    { name: 'Budget', path: '/budget' },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">

          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>

          <div className="relative w-64 bg-white dark:bg-gray-900 h-full shadow-lg z-50 flex flex-col p-6">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
            <nav className="mt-10 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`block text-left w-full text-lg font-medium px-0 py-2 rounded ${location.pathname === item.path
                      ? 'text-indigo-600'
                      : 'text-gray-800 dark:text-gray-100'
                    } hover:text-indigo-600`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center">
          <button
            className="mr-4 text-gray-500 focus:outline-none sm:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
        </div>
        <div className="flex items-center space-x-4">
          {/* Remove theme toggle button */}
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="font-semibold text-gray-800">NRs.{balance.toLocaleString('en-US')}</p>
          </div>
          <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="./118238820.jpg"
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>
    </>
  );
}
