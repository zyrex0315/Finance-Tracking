import React from 'react';
import { 
  calculateTotalBalance, 
  calculateMonthlyIncome, 
  calculateMonthlyExpenses 
} from '../data/mockData.js';
import { ArrowDownRight, ArrowUpRight, Banknote, Wallet } from 'lucide-react';

export default function DashboardSummary() {
  const totalBalance = calculateTotalBalance();
  const monthlyIncome = calculateMonthlyIncome();
  const monthlyExpenses = calculateMonthlyExpenses();
  
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              NRs.{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
            <Wallet className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
        </div>
        
        <div className="flex items-center mt-4">
           </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              NRs.{monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900 rounded-lg">
            <Banknote className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="flex items-center mt-4">

        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              NRs.{monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-900 rounded-lg">
            <ArrowUpRight className="text-red-600 dark:text-red-400" size={24} />
          </div>
        </div>
        
        <div className="flex items-center mt-4">
           </div>
      </div>
    </div>
  );
}
