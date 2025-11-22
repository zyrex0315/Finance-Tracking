import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CategoryBreakdown({ transactions = [] }) {
  const getCategorySpending = () => {
    const byCategory = {};
    transactions.forEach((tx) => {
      if (!tx.isIncome) {
        if (!byCategory[tx.category]) byCategory[tx.category] = 0;
        byCategory[tx.category] += tx.amount;
      }
    });
    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const data = getCategorySpending();


  const displayData = data.slice(0, 5);

  const otherSum = data.slice(5).reduce((sum, item) => sum + item.amount, 0);
  const otherPercentage = data.slice(5).reduce((sum, item) => sum + item.percentage, 0);


  if (data.length > 5) {
    displayData.push({
      category: 'Other',
      amount: otherSum,
      percentage: otherPercentage
    });
  }

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#6B7280'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Spending by Category</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Where your money is going</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="amount"
              nameKey="category"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [`NRs.${value.toFixed(2)} (${props.payload.percentage}%)`, name]}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry) => {
                const { payload } = entry;
                return `${value} (${payload.percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
