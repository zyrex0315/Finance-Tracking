import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function Reports() {
  return (
    <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <BarChart2 size={40} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Reports Coming Soon</h2>
        <p className="text-gray-500 dark:text-gray-400">
          We're currently working on connecting the reporting engine to your live data.
          Check back in Phase 3!
        </p>
      </div>
    </div>
  );
}
