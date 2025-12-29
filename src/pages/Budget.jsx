import React from 'react';
import { PieChart } from 'lucide-react';

export default function Budget() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <PieChart size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Budgeting Coming Soon</h2>
        <p className="text-gray-500 dark:text-gray-400">
          The budgeting tools are being upgraded to support your real-time data.
          This feature will be available in Phase 3.
        </p>
      </div>
    </div>
  );
}
