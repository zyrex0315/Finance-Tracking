import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import useTransactionStore from '../../context/transactionStore';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const { addTransaction } = useTransactionStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addTransaction({
                type,
                amount: parseFloat(amount),
                category,
                date: new Date(date),
                description
            });

            // Reset and close
            setAmount('');
            setCategory('');
            setDescription('');
            setType('expense');
            setDate(new Date().toISOString().split('T')[0]);
            onClose();
        } catch (error) {
            console.error("Failed to add transaction", error);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = type === 'expense'
        ? ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other']
        : ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Overlay */}
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Modal Panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">

                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Add New Transaction
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="px-4 py-5 sm:p-6 space-y-4">

                            {/* Type Selection */}
                            <div className="flex rounded-md shadow-sm" role="group">
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium border rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500 transition-colors ${type === 'expense'
                                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-650'
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 transition-colors ${type === 'income'
                                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-650'
                                        }`}
                                >
                                    Income
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="" disabled className="dark:bg-gray-800">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="dark:bg-gray-800">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                                <textarea
                                    rows="2"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="What was this for?"
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-gray-700">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Saving...' : 'Add Transaction'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;
