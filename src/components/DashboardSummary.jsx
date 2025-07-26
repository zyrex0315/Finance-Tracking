import React from 'react';
import { 
  calculateTotalBalance, 
  calculateMonthlyIncome, 
  calculateMonthlyExpenses,
  calculatePreviousMonthlyIncome,
  calculatePreviousMonthlyExpenses,
  calculatePreviousMonthlySaving
} from '../data/mockData.js';
import { ArrowDownRight, ArrowUpRight, ArrowRight, Banknote, Wallet, PiggyBank } from 'lucide-react';

export default function DashboardSummary() {
  const totalBalance = calculateTotalBalance();
  const monthlyIncome = calculateMonthlyIncome();
  const monthlyExpenses = calculateMonthlyExpenses();
  const previousIncome = calculatePreviousMonthlyIncome();
  const previousExpenses = calculatePreviousMonthlyExpenses();
  const monthlySaving = monthlyIncome - monthlyExpenses;
  const previousSaving = calculatePreviousMonthlySaving();

  // Calculate percentage changes
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  const incomeChange = getPercentageChange(monthlyIncome, previousIncome);
  const expenseChange = getPercentageChange(monthlyExpenses, previousExpenses);
  const savingChange = getPercentageChange(monthlySaving, previousSaving);

  // Helper for trend arrow
  const TrendArrow = ({ change }) => {
    if (change > 0) return <ArrowUpRight className="text-green-500" size={18} />;
    if (change < 0) return <ArrowDownRight className="text-red-500" size={18} />;
    return <ArrowRight className="text-gray-400" size={18} />;
  };
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Total Income Card */}
      <div className="bg-green-50 rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              NRs.{monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <Banknote className="text-green-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <TrendArrow change={incomeChange} />
          <span className={`ml-2 text-sm font-medium ${incomeChange > 0 ? 'text-green-600' : incomeChange < 0 ? 'text-red-600' : 'text-gray-500'}`}>{incomeChange.toFixed(1)}%</span>
          <span className="ml-2 text-xs text-gray-400">vs last month</span>
        </div>
      </div>
      {/* Total Expense Card */}
      <div className="bg-red-50 rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expense</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              NRs.{monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <ArrowUpRight className="text-red-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <TrendArrow change={expenseChange} />
          <span className={`ml-2 text-sm font-medium ${expenseChange > 0 ? 'text-red-600' : expenseChange < 0 ? 'text-green-600' : 'text-gray-500'}`}>{expenseChange.toFixed(1)}%</span>
          <span className="ml-2 text-xs text-gray-400">vs last month</span>
        </div>
      </div>
      {/* Total Saving Card */}
      <div className="bg-blue-50 rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Saving</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              NRs.{monthlySaving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <PiggyBank className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <TrendArrow change={savingChange} />
          <span className={`ml-2 text-sm font-medium ${savingChange > 0 ? 'text-green-600' : savingChange < 0 ? 'text-red-600' : 'text-gray-500'}`}>{savingChange.toFixed(1)}%</span>
          <span className="ml-2 text-xs text-gray-400">vs last month</span>
        </div>
      </div>
    </div>
  );
}
