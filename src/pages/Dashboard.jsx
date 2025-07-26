import React from 'react';
import DashboardSummary from '../components/DashboardSummary.jsx';
import SpendingChart from '../components/SpendingChart.jsx';
import CategoryBreakdown from '../components/CategoryBreakdown.jsx';
import RecentTransactions from '../components/RecentTransactions.jsx';

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white text-gray-900 min-h-screen">
      <DashboardSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SpendingChart />
        <CategoryBreakdown />
      </div>
      
      <div>
        <RecentTransactions />
      </div>
    </div>
  );
}
