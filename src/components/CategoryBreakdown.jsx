import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategorySpending } from '../data/mockData.js';

export default function CategoryBreakdown() {
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
