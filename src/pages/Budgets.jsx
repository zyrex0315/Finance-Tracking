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
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-white/10 transition-all hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-blue-600/10 shadow-xl group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "p-3 rounded-2xl shadow-lg transition-transform group-hover:rotate-6",
                        isOver ? "bg-rose-500 text-white shadow-rose-500/30" :
                            isNear ? "bg-amber-500 text-white shadow-amber-500/30" :
                                "bg-blue-600 text-white shadow-sm"
                    )}>
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white tracking-tight text-lg md:text-xl">{category}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Control Limit</p>
                    </div>
                </div>
                <div className="flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-primary-500 rounded-xl transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onDelete} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Utilization</span>
                            <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {formatAmount(spent)}
                                <span className="text-xs md:text-sm font-bold text-slate-500 ml-1 md:ml-2 tracking-tight">/ {formatAmount(limit)}</span>
                            </span>
                        </div>
                        <div className={clsx(
                            "px-4 py-1.5 rounded-xl text-xs font-black shadow-sm",
                            isOver ? "bg-rose-500/10 text-rose-500" :
                                isNear ? "bg-amber-500/10 text-amber-500" :
                                    "bg-primary-500/10 text-primary-500"
                        )}>
                            {percentage.toFixed(0)}%
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-3.5 overflow-hidden p-0.5 border border-transparent dark:border-white/5">
                        <div
                            className={clsx(
                                "h-full rounded-full transition-all duration-1000 relative",
                                isOver ? "bg-rose-500" :
                                    isNear ? "bg-amber-500" :
                                        "bg-primary-600"
                            )}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between text-xs font-bold pt-4 border-t border-gray-50 dark:border-white/5">
                    <span className="text-slate-500 uppercase tracking-[0.1em]">{isOver ? 'Exceeded By' : 'Safe Margin'}</span>
                    <span className={clsx(
                        "font-black tracking-tight",
                        isOver ? "text-rose-500" : "text-emerald-500"
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
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-[#0f172a]/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#1e293b] rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border-t sm:border border-gray-100 dark:border-white/10 animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 sm:duration-300 relative">
                {/* Decorative blob in modal */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="p-6 md:p-10 border-b border-gray-50 dark:border-white/10 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {initialData ? 'Update Limit' : 'Smart Budgeting'}
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Set clear rules for your financial freedom</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Target Category</label>
                        <select
                            required
                            disabled={!!initialData}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4.5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 outline-none disabled:opacity-50 transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="">Choose Wisely</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Monthly Safeguard ({currencyInfo.symbol})</label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                min="1"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                placeholder="0.00"
                                className="w-full p-4.5 pl-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 outline-none transition-all font-black text-lg"
                            />
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 font-bold text-lg">{currencyInfo.symbol}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1 px-6 py-4 rounded-2xl uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary flex-1 px-6 py-4 rounded-2xl uppercase tracking-widest text-xs"
                        >
                            {isSaving ? 'Saving...' : 'Lock Goal'}
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Smart Thresholds</h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Create boundaries for a healthier financial life</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-2xl uppercase tracking-[0.15em] text-xs w-full md:w-auto"
                >
                    <Plus size={20} />
                    <span>Set Barrier</span>
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-10 md:p-24 rounded-[2rem] md:rounded-[4rem] text-center border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col items-center">
                    <div className="bg-blue-600/10 w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-10 text-blue-500 shadow-inner">
                        <Target size={40} className="md:w-[60px] md:h-[60px]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">Financial Discipline</h3>
                    <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto mb-8 md:mb-12 font-medium leading-relaxed italic">
                        Define how much you're willing to spend in each category. We'll watch your back and notify you if things get tight.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary px-8 md:px-10 py-3.5 md:py-4 rounded-2xl md:rounded-3xl uppercase tracking-widest text-xs"
                    >
                        Initialize Your First Budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
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

            {/* Insight Note */}
            <div className="bg-blue-600/10 backdrop-blur-md p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-blue-600/20 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center transition-all hover:border-amber-500/40 group">
                <div className="p-3 md:p-4 bg-amber-500 text-white rounded-xl md:rounded-2xl shadow-xl shadow-amber-500/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                    <AlertTriangle size={28} className="md:w-8 md:h-8" />
                </div>
                <div>
                    <h4 className="font-black text-gray-900 dark:text-white tracking-tight text-lg md:text-xl">How it works</h4>
                    <p className="text-slate-500 text-sm md:text-base mt-1 leading-relaxed max-w-3xl font-medium">
                        Your budgets automatically synchronize with your transactions. We'll signal a critical warning as you hit <span className="text-rose-500 font-black">90%</span> of your target, keeping you on the path to financial freedom.
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
