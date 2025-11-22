import React from 'react';
import { BarChart3, CreditCard, LayoutDashboard, PiggyBank } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <CreditCard size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Budget', path: '/budget', icon: <PiggyBank size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-64 py-6 px-3 hidden sm:flex">
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center">
          <span className="bg-indigo-600 text-white p-1 rounded mr-2">
            <PiggyBank size={20} />
          </span>
          Smart Finance
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {({ isActive }) => (
              <>
                <span className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
