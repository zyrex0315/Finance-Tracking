import React, { useState } from 'react';
import {
  getCategorySpending,
  calculateMonthlyExpenses,
  calculateMonthlyIncome
} from '../data/mockData.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Plus, Squircle, Trash2 } from 'lucide-react';

export default function Budget() {
  const categorySpending = getCategorySpending();
  const monthlyExpenses = calculateMonthlyExpenses();
  const monthlyIncome = calculateMonthlyIncome();

  // Mock budget limits
  const [budgets, setBudgets] = useState([
    { category: 'Food & Dining', limit: 25000, spent: 18500 },
    { category: 'Transportation', limit: 10000, spent: 8200 },
    { category: 'Entertainment', limit: 5000, spent: 3500 },
    { category: 'Shopping', limit: 15000, spent: 12000 },
    { category: 'Utilities', limit: 8000, spent: 6500 },
  ]);

  // Calculate remaining and percentage
  const calculatedBudgets = budgets.map(budget => ({
    ...budget,
    remaining: budget.limit - budget.spent,
    percentage: Math.min(Math.round((budget.spent / budget.limit) * 100), 100)
  }));

  // Format for chart
  const chartData = calculatedBudgets.map(budget => ({
    category: budget.category,
    limit: budget.limit,
    spent: budget.spent
  }));

  // Total budget stats
  const totalBudgeted = calculatedBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = calculatedBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalBudgeted) * 100);

  return (
    <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Budget Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your spending limits</p>
        </div>

        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budgeted</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">NRs.{totalBudgeted.toLocaleString('en-US')}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. NRs.{monthlyIncome.toLocaleString('en-US')} income</div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-700 rounded-full"
              style={{ width: `${Math.min(Math.round((totalBudgeted / monthlyIncome) * 100), 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">NRs.{totalSpent.toLocaleString('en-US')}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{overallPercentage}% of total budget</div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${overallPercentage > 90 ? 'bg-red-500 dark:bg-red-700' : overallPercentage > 75 ? 'bg-amber-500 dark:bg-amber-700' : 'bg-green-500 dark:bg-green-700'
                }`}
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">NRs.{totalRemaining.toLocaleString('en-US')}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">for this month</div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${totalRemaining < 0 ? 'bg-red-500 dark:bg-red-700' : 'bg-green-500 dark:bg-green-700'
                }`}
              style={{ width: `${Math.min(Math.round((totalRemaining / totalBudgeted) * 100), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget vs. Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  height={40}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `NRs.${value}`}
                />
                <Tooltip
                  formatter={(value) => [`NRs.${value}`, '']}
                  labelStyle={{ fontWeight: 'bold' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  name="Budget Limit"
                  dataKey="limit"
                  fill="#A5B4FC"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Spent"
                  dataKey="spent"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.spent > entry.limit ? '#EF4444' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget Status</h3>
          <div className="space-y-6">
            {calculatedBudgets.map((budget) => (
              <div key={budget.category}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{budget.category}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    NRs.{budget.spent.toFixed(0)} / NRs.{budget.limit}
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${budget.percentage > 100
                        ? 'bg-red-500 dark:bg-red-700'
                        : budget.percentage > 85
                          ? 'bg-amber-500 dark:bg-amber-700'
                          : 'bg-green-500 dark:bg-green-700'
                      }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    {budget.percentage > 100
                      ? `${budget.percentage - 100}% over budget`
                      : `${budget.percentage}% used`}
                  </div>
                  <div>NRs.{budget.remaining.toFixed(0)} left</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Budget Details</h3>
          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            Edit All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
              <tr>
                <th className="py-3 px-4 text-left">CATEGORY</th>
                <th className="py-3 px-4 text-right">BUDGET LIMIT</th>
                <th className="py-3 px-4 text-right">SPENT</th>
                <th className="py-3 px-4 text-right">REMAINING</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {calculatedBudgets.map((budget) => (
                <tr key={budget.category} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800 dark:text-gray-100">NRs.{budget.category}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-600 dark:text-gray-300">NRs.{budget.limit.toFixed(0)}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-600 dark:text-gray-300">NRs.{budget.spent.toFixed(0)}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-medium ${budget.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>NRs.{budget.remaining.toFixed(0)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full
                          ${budget.percentage > 100
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                            : budget.percentage > 85
                              ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          }`}
                      >
                        {budget.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <Squircle size={16} className="text-gray-500" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <Trash2 size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
