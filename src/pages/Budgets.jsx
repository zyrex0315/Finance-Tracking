import { useState, useEffect, useMemo } from 'react';
import { Plus, Target, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import useBudgetStore from '../context/budgetStore';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';
import clsx from 'clsx';


const BudgetCard = ({ category, spent, limit, onDelete, onEdit }) => {
    const { formatAmount } = useCurrencyStore();
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOver = spent > limit;
    const isNear = spent > limit * 0.8 && !isOver;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "p-2 rounded-lg",
                        isOver ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                            isNear ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{category}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Monthly Budget</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={onEdit} className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-400">Spent</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                            {formatAmount(spent)}
                            <span className="text-xs font-normal text-gray-400 ml-1.5 tracking-tight italic">/ {formatAmount(limit)}</span>
                        </span>
                    </div>
                    <div className={clsx(
                        "px-3 py-1 rounded-lg text-xs font-black",
                        isOver ? "bg-red-50 text-red-600 dark:bg-red-900/20" :
                            isNear ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" :
                                "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                    )}>
                        {percentage.toFixed(0)}%
                    </div>
                </div>

                <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-1000",
                            isOver ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" :
                                isNear ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]" :
                                    "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-[11px] font-bold py-1 px-1 mt-1">
                    <span className="text-gray-400 bg-gray-50 dark:bg-gray-900 px-2.5 py-1 rounded-md">{isOver ? 'EXCEEDED BY' : 'REMAINING'}</span>
                    <span className={clsx(
                        "px-2.5 py-1 rounded-md",
                        isOver ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-green-50 text-green-600 dark:bg-green-900/20"
                    )}>
                        {formatAmount(Math.abs(limit - spent))}
                    </span>
                </div>
            </div>
        </div>
    );
};

const BudgetModal = ({ isOpen, onClose, initialData = null }) => {
    const { upsertBudget } = useBudgetStore();
    const { getCurrencyInfo } = useCurrencyStore();
    const [category, setCategory] = useState(initialData?.category || '');
    const [limit, setLimit] = useState(initialData?.limit || '');
    const [isSaving, setIsSaving] = useState(false);
    const currencyInfo = getCurrencyInfo();

    useEffect(() => {
        if (initialData) {
            setCategory(initialData.category);
            setLimit(initialData.limit);
        } else {
            setCategory('');
            setLimit('');
        }
    }, [initialData, isOpen]);

    const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await upsertBudget({
                category,
                limit: parseFloat(limit),
                period: 'monthly'
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-50 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {initialData ? 'Edit Budget' : 'Smart Budget'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Define your monthly spending limit</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                        <select
                            required
                            disabled={!!initialData}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none disabled:opacity-50 transition-all font-bold"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Limit ({currencyInfo.symbol})</label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                min="1"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                placeholder="0.00"
                                className="w-full p-4 pl-12 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{currencyInfo.symbol}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/30"
                        >
                            {isSaving ? 'Processing...' : 'Save Limit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Budgets = () => {
    const { budgets, fetchBudgets, deleteBudget } = useBudgetStore();
    const { transactions, fetchTransactions } = useTransactionStore();
    const { currentUser } = useAuthStore();
    const { formatAmount } = useCurrencyStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchBudgets();
            fetchTransactions();
        }
    }, [currentUser, fetchBudgets, fetchTransactions]);

    // Calculate spending per category for current month
    const categorySpending = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t =>
            t.type === 'expense' && new Date(t.date) >= startOfMonth
        );

        return monthlyTransactions.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
    }, [transactions]);

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Smart Budgets</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your financial guardrails</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Set Budget</span>
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-20 rounded-[3rem] text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400">
                        <Target size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Plan Your Spending</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10 font-medium">
                        Set category limits to track your monthly spending habits and save more effectively.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                    >
                        Create Your First Budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {budgets.map(budget => (
                        <BudgetCard
                            key={budget.id}
                            category={budget.category}
                            limit={budget.limit}
                            spent={categorySpending[budget.category] || 0}
                            onDelete={() => {
                                if (window.confirm(`Delete budget for ${budget.category}?`)) {
                                    deleteBudget(budget.id);
                                }
                            }}
                            onEdit={() => handleEdit(budget)}
                        />
                    ))}
                </div>
            )}

            {/* Educational Note */}
            <div className="bg-blue-50 dark:bg-gray-800/50 p-8 rounded-[2rem] border border-blue-100 dark:border-gray-700 flex gap-6 items-start transition-all hover:border-amber-500/30">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <AlertTriangle className="text-amber-500" size={28} />
                </div>
                <div>
                    <h4 className="font-black text-blue-900 dark:text-white tracking-tight">How it works</h4>
                    <p className="text-blue-800/70 dark:text-gray-400 text-sm mt-1 leading-relaxed max-w-2xl font-medium">
                        Budgets track expenses for the current month and reset automatically on the 1st.
                        We'll notify you when you reach <span className="text-amber-500 font-bold">80%</span> of your limit.
                    </p>
                </div>
            </div>

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingBudget}
            />
        </div>
    );
};


export default Budgets;
