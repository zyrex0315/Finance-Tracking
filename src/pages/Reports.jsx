import React, { useState } from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { ArrowDownRight, ChevronDown, Download, Printer } from 'lucide-react';
import { getCategorySpending, getMonthlySpending } from '../data/mockData.js';

const COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981', 
  '#3B82F6', '#F59E0B', '#06B6D4', '#6B7280', '#4F46E5'
];

export default function Reports() {
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  const monthlyData = getMonthlySpending();
  const categoryData = getCategorySpending();
  
  const compareWithPreviousPeriod = () => {
    const currentTotal = monthlyData.slice(-3).reduce((sum, month) => sum + month.amount, 0);
    const previousTotal = monthlyData.slice(-6, -3).reduce((sum, month) => sum + month.amount, 0);
    
    const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    return {
      change: percentChange.toFixed(1),
      isPositive: percentChange < 0 // For expenses, negative change is positive
    };
  };
  
  const comparison = compareWithPreviousPeriod();
  
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Financial Reports</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your spending and identify trends</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          
          <div className="relative">
            <button className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors flex items-center gap-2">
              {timeframe}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Spending Overview</h3>
              <div className="flex items-center mt-1">
                <span className={`text-xl sm:text-2xl font-bold ${comparison.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {comparison.isPositive ? '↓' : '↑'} {Math.abs(Number(comparison.change))}%
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
              </div>
            </div>
          </div>
          
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
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
                <Tooltip 
                  formatter={(value) => [`NRs.${value}`, 'Spending']}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                >
                  {monthlyData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === monthlyData.length - 1 ? '#6366F1' : '#A5B4FC'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Category Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Where your money is going</p>
          </div>
          
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`NRs.${value.toFixed(2)} (${props.payload.percentage}%)`, name]}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value, entry) => {
                    const { payload } = entry;
                    return `${value} (${payload.percentage}%)`;
                  }}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { 
            title: 'Total Spending', 
            value: `NRs.${monthlyData.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US')}`,
            trend: `-${comparison.change}%`,
            isPositive: comparison.isPositive,
            description: 'Total expenses during this period'
          },
          { 
            title: 'Average Monthly', 
            value: `NRs.${Math.round(monthlyData.reduce((sum, item) => sum + item.amount, 0) / monthlyData.length).toLocaleString('en-US')}`,
            trend: '-2.3%',
            isPositive: true,
            description: 'Average monthly spending'
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">{stat.value}</p>
              
              <div className="flex items-center mt-2">
                <span className={`flex items-center text-sm font-medium ${
                  stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <ArrowDownRight 
                    size={16} 
                    className={`mr-1 transform ${!stat.isPositive ? 'rotate-180' : ''}`}
                  />
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs previous period</span>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
