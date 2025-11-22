import React, { useState } from 'react';
import { fetchTransactions } from '../data/api.js';

export default function Transactions() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setAllTransactions(data);
        setTransactions(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const categories = [
    'Food & Dining',
    'Shopping',
    'Housing',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Utilities',
    'Education',
    'Other'
  ];

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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === '') {
      setTransactions(allTransactions.slice(0, 10));
      return;
    }

    const filteredTransactions = allTransactions.filter(
      transaction =>
        transaction.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
        transaction.category.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setTransactions(filteredTransactions.slice(0, 10));
  };

  const toggleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const applyFilters = () => {
    let filtered = allTransactions;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedCategories.includes(transaction.category)
      );
    }

    // Apply date range filter
    if (dateRange.from) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= new Date(dateRange.from)
      );
    }

    if (dateRange.to) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) <= new Date(dateRange.to)
      );
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        transaction =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTransactions(filtered.slice(0, 10));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setDateRange({ from: '', to: '' });
    setSearchTerm('');
    setTransactions(allTransactions.slice(0, 10));
    setShowFilters(false);
  };

  const loadMore = () => {
    setTransactions(prev => [...prev, ...allTransactions.slice(prev.length, prev.length + 10)]);
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Transactions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your expenses and income</p>
        </div>

        <div className="flex flex-wrap gap-2">

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

            <button className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Calendar size={16} className="hidden sm:inline" />
              This Month
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

        {transactions.length < allTransactions.length && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={loadMore}
              className="w-full py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
