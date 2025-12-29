import React, { useEffect, useState } from 'react';
import DashboardSummary from '../components/DashboardSummary.jsx';
import SpendingChart from '../components/SpendingChart.jsx';
import CategoryBreakdown from '../components/CategoryBreakdown.jsx';
import RecentTransactions from '../components/RecentTransactions.jsx';
import { fetchTransactions } from '../data/api.js';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch enough transactions for charts and summary (last ~200 should suffice for now)
        const data = await fetchTransactions({ limit: 200 });
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white text-gray-900 min-h-screen">
      <DashboardSummary transactions={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SpendingChart transactions={transactions} />
        <CategoryBreakdown transactions={transactions} />
      </div>

      <div>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
