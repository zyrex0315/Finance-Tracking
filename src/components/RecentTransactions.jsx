import React from 'react';
import { Activity, ArrowDown, ArrowRight, ArrowUp, BookOpen, Car, CircleDollarSign, Coffee, Film, House, Plane, ShoppingBag, Zap } from 'lucide-react';

export default function RecentTransactions({ transactions = [] }) {
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food & Dining':
        return <Coffee size={16} />;
      case 'Shopping':
        return <ShoppingBag size={16} />;
      case 'Housing':
        return <House size={16} />;
      case 'Transportation':
        return <Car size={16} />;
      case 'Entertainment':
        return <Film size={16} />;
      case 'Healthcare':
        return <Activity size={16} />;
      case 'Travel':
        return <Plane size={16} />;
      case 'Utilities':
        return <Zap size={16} />;
      case 'Education':
        return <BookOpen size={16} />;
      default:
        return <CircleDollarSign size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
          View All
          <ArrowRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
            <tr>
              <th className="py-3 px-4 text-left">DESCRIPTION</th>
              <th className="py-3 px-4 text-left">CATEGORY</th>
              <th className="py-3 px-4 text-left">DATE</th>
              <th className="py-3 px-4 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{transaction.description}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="p-1 mr-2 rounded-md bg-gray-100 dark:bg-gray-800">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{transaction.category}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(transaction.date)}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`font-medium flex items-center justify-end
                    ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.isIncome ? (
                      <ArrowDown size={14} className="mr-1" />
                    ) : (
                      <ArrowUp size={14} className="mr-1" />
                    )}
                    NRs.{transaction.amount.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
