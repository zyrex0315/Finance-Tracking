import { useState } from 'react';
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import useTransactionStore from '../../context/transactionStore';
import useCurrencyStore from '../../context/currencyStore';
import clsx from 'clsx';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const { addTransaction } = useTransactionStore();
    const { getCurrencyInfo } = useCurrencyStore();
    const [isLoading, setIsLoading] = useState(false);

    const currencyInfo = getCurrencyInfo();

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">New Record</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Capture your financial activity</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Type Toggle */}
                    <div className="flex bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all",
                                type === 'expense'
                                    ? "bg-white dark:bg-gray-800 text-red-600 shadow-sm"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            EXPENSE
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all",
                                type === 'income'
                                    ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            INCOME
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-blue-500 transition-colors">
                                    {currencyInfo.symbol}
                                </div>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-lg"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold appearance-none"
                            >
                                <option value="" disabled>Choose Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Memo</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
                            <textarea
                                rows="2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add notes (optional)..."
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all border border-gray-100 dark:border-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'PROCESSING...' : 'ADD TRANSACTION'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;

