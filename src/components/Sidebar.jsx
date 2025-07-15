import React from 'react';
import { BarChart3, CreditCard, LayoutDashboard, LogOut, PiggyBank, Settings } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', icon: <CreditCard size={20} /> },
    { name: 'Reports', icon: <BarChart3 size={20} /> },
    { name: 'Budget', icon: <PiggyBank size={20} /> },
  ];

  

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 py-6 px-3 hidden sm:flex">
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
          <span className="bg-indigo-600 dark:bg-indigo-500 text-white p-1 rounded mr-2">
            <PiggyBank size={20} />
          </span>
          Smart Finance
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${
              activePage === item.name
                ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`mr-3 ${activePage === item.name ? 'text-indigo-500 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
              {item.icon}
            </span>
            {item.name}
          </button>
        ))}
      </nav>
      
      
    </div>
  );
}
