import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SpendingChart({ transactions = [] }) {
  const getMonthlySpending = () => {
    const monthly = {};
    transactions.forEach((tx) => {
      if (!tx.isIncome) {
        const month = tx.date.slice(0, 7); // yyyy-MM
        if (!monthly[month]) monthly[month] = 0;
        monthly[month] += tx.amount;
      }
    });
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount: Math.round(amount * 100) / 100 }));
  };

  const data = getMonthlySpending();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Monthly Spending Trend</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your spending patterns over the last 6 months</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `NRs.${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <Tooltip
              formatter={(value) => [`NRs.${value}`, 'Spending']}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366F1"
              fillOpacity={1}
              fill="url(#colorSpending)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
