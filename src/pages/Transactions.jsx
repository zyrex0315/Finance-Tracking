import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Plus, Calendar,
  ArrowUp, ArrowDown,
  Coffee, ShoppingBag, House, Car, Film, Activity, Plane, Zap, BookOpen, CircleDollarSign, Loader2
} from 'lucide-react';
import { fetchTransactions, addTransaction } from '../data/api.js';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // Backend currently supports single category filter, or we need to update backend to support array. Let's stick to single or first for now or update backend later.
        startDate: dateRange.from,
        endDate: dateRange.to
      };

      const data = await fetchTransactions(params);

      if (reset) {
        setTransactions(data.transactions);
        setPage(2); // Next page will be 2
      } else {
        setTransactions(prev => [...prev, ...data.transactions]);
        setPage(prev => prev + 1);
      }

      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategories, dateRange, loading]);

  // Initial load
  useEffect(() => {
    loadTransactions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search Debounce could be added here, currently triggers on Enter or explicit button, 
  // but to keep it simple let's trigger on Enter or blur for search? 
  // Or just rely on the 'Apply Filters' / 'Search' logic.
  // Converting search to live search with server might be heavy without debounce.
  // For now, let's make Search trigger only on Enter or when "Apply Filters" happens.

  const categories = [
    'Food & Dining', 'Shopping', 'Housing', 'Transportation',
    'Entertainment', 'Healthcare', 'Travel', 'Utilities',
    'Education', 'Other'
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food & Dining': return <Coffee size={16} />;
      case 'Shopping': return <ShoppingBag size={16} />;
      case 'Housing': return <House size={16} />;
      case 'Transportation': return <Car size={16} />;
      case 'Entertainment': return <Film size={16} />;
      case 'Healthcare': return <Activity size={16} />;
      case 'Travel': return <Plane size={16} />;
      case 'Utilities': return <Zap size={16} />;
      case 'Education': return <BookOpen size={16} />;
      default: return <CircleDollarSign size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      loadTransactions(true);
    }
  };

  const toggleCategoryFilter = (category) => {
    // For now, simple single select or toggle. 
    // Backend example supported single 'category' param.
    // Let's implement single select behavior to match backend simplicity for now.
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const applyFilters = () => {
    loadTransactions(true);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setDateRange({ from: '', to: '' });
    setSearchTerm('');
    // We need to trigger reload after cleaning state. 
    // State updates are async, so we can't call loadTransactions immediately with new state.
    // A clearer way:
    // setStates... then useEffect triggers? No, that causes double fetches.
    // We can pass empty params explicitly.
    // But simplest is to just reset state and let user click 'Apply' or auto-trigger? 
    // Let's auto trigger.

    // Hacky but works for now:
    setSearchTerm('');
    setSelectedCategories([]);
    setDateRange({ from: '', to: '' });
    setTimeout(() => loadTransactions(true), 0);
  };

  const handleLoadMore = () => {
    loadTransactions(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Transactions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your expenses and income</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Add Transaction Logic TODO */}
          <button className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleSearchSubmit}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filter
              {selectedCategories.length > 0 && (
                <span className="ml-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategoryFilter(category)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5
                      ${selectedCategories.includes(category)
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      } border transition-colors`}
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Date Range</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 text-center text-red-600 bg-red-50 dark:bg-red-900/20">
            {error}
            <button onClick={() => loadTransactions(true)} className="ml-2 underline hover:text-red-800">Retry</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && transactions.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No transactions found.</p>
          </div>
        )}

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
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id || transaction.id} // MongoDB uses _id
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
                      ${transaction.isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
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

        {/* Load More / Loading State */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="animate-spin text-indigo-600" size={24} />
            </div>
          ) : hasMore ? (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Load More
            </button>
          ) : transactions.length > 0 && (
            <p className="text-center text-sm text-gray-500">No more transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}
