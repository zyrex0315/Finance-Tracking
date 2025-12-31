import { useState, useEffect, useMemo } from 'react';
import { Plus, Target, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import useBudgetStore from '../context/budgetStore';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import clsx from 'clsx';

const BudgetCard = ({ category, spent, limit, onDelete, onEdit }) => {
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
                        <h3 className="font-bold text-gray-900 dark:text-white">{category}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Monthly Budget</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">${spent.toFixed(0)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">of ${limit.toFixed(0)}</span></span>
                    <span className={clsx(
                        "text-sm font-bold",
                        isOver ? "text-red-600 dark:text-red-400" :
                            isNear ? "text-amber-600 dark:text-amber-400" :
                                "text-blue-600 dark:text-blue-400"
                    )}>
                        {percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-1000",
                            isOver ? "bg-red-500" :
                                isNear ? "bg-amber-500" :
                                    "bg-blue-500"
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs font-medium pt-1">
                    <span className="text-gray-400">{isOver ? 'Over budget by' : 'Remaining'}</span>
                    <span className={clsx(isOver ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
                        ${Math.abs(limit - spent).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const BudgetModal = ({ isOpen, onClose, initialData = null }) => {
    const { upsertBudget } = useBudgetStore();
    const [category, setCategory] = useState(initialData?.category || '');
    const [limit, setLimit] = useState(initialData?.limit || '');
    const [isSaving, setIsSaving] = useState(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Budget' : 'Set Category Budget'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            required
                            disabled={!!initialData}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Limit ($)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {isSaving ? 'Saving...' : 'Save Budget'}
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
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Budgets</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your category spending targets</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Set Budget</span>
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl text-center border-2 border-dashed border-gray-100 dark:border-gray-700">
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No budgets set yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                        Setting budgets helps you save more and control your spending habits.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                        Create your first budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
                <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-400">How budgets work</h4>
                    <p className="text-amber-800/80 dark:text-amber-400/80 text-sm mt-1">
                        Budgets track your expenses for the current calendar month. They reset automatically on the 1st of every month.
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
