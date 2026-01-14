import { useState } from 'react';
import { createPortal } from 'react-dom';
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

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border-t sm:border border-gray-100 dark:border-white/10 animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 sm:duration-200 flex flex-col max-h-[96dvh] sm:max-h-[min(90vh,800px)]">

                {/* Mobile Handle */}
                <div className="sm:hidden flex justify-center pt-3 shrink-0">
                    <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="p-4 md:p-8 border-b border-gray-50 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 shrink-0">
                    <div>
                        <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">New Record</h3>
                        <p className="text-gray-400 text-[10px] md:text-sm mt-0.5">Capture your financial activity</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 p-4 md:p-8 space-y-4 md:space-y-5 overflow-y-auto min-h-0 scroll-smooth">
                        {/* Type Toggle */}
                        <div className="flex bg-gray-50 dark:bg-[#0f172a] p-1 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 shrink-0">
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={clsx(
                                    "flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all",
                                    type === 'expense'
                                        ? "bg-white dark:bg-gray-800 text-rose-500 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                EXPENSE
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={clsx(
                                    "flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all",
                                    type === 'income'
                                        ? "bg-white dark:bg-gray-800 text-emerald-500 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                INCOME
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Amount */}
                            <div className="space-y-1">
                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount</label>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-blue-500 transition-colors">
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
                                        className="w-full pl-9 pr-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-base md:text-lg"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-1">
                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold appearance-none text-sm"
                                >
                                    <option value="" disabled>Choose Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1 pb-2 md:pb-4">
                            <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Memo</label>
                            <div className="relative">
                                <FileText className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                                <textarea
                                    rows="1"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add notes (optional)..."
                                    className="w-full pl-10 pr-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm md:text-base"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pb-10 md:p-8 border-t border-gray-50 dark:border-white/10 flex gap-3 md:gap-4 bg-white dark:bg-[#111827] shrink-0 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-gray-100 dark:border-white/10 text-xs md:text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 text-xs md:text-base active:scale-[0.98] uppercase tracking-widest"
                        >
                            {isLoading ? '...' : 'Secure Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTransactionModal;

