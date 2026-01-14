import { useEffect, useState } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, Trash2, AlertCircle } from 'lucide-react';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';
import AddTransactionModal from '../components/Modals/AddTransactionModal';
import clsx from 'clsx';


const Transactions = () => {
    const { transactions, fetchTransactions, loading, error, deleteTransaction } = useTransactionStore();
    const { currentUser } = useAuthStore();
    const { formatAmount } = useCurrencyStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, income, expense



    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        }
    }, [fetchTransactions, currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Transactions</h1>
                    <p className="hidden md:block text-slate-500 dark:text-slate-400 mt-1 italic">Manage your income and expenses with precision</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] md:text-xs w-full md:w-auto mt-2 md:mt-0 shadow-lg"
                >
                    <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                    Add Transaction
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-400 p-3 md:p-5 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 animate-in slide-in-from-top-4 duration-500">
                    <AlertCircle size={20} className="md:w-6 md:h-6" />
                    <p className="text-[11px] md:text-sm font-bold tracking-tight">{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3 md:gap-6 items-stretch lg:items-center justify-between bg-white dark:bg-white/5 backdrop-blur-xl p-3 md:p-6 rounded-2xl md:rounded-[32px] border border-gray-100 dark:border-white/10 shadow-xl">
                <div className="relative w-full lg:w-[450px] group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 md:py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#1e293b] dark:text-white transition-all text-sm md:text-base font-medium"
                    />
                </div>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl md:rounded-2xl border border-transparent dark:border-white/5">
                    {['all', 'income', 'expense'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={clsx(
                                "px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black capitalize transition-all tracking-widest flex-1 md:flex-none",
                                filterType === type
                                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg shadow-blue-600/20"
                                    : "text-slate-500 hover:text-blue-600 dark:hover:text-white"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-24 text-center animate-pulse text-slate-500 font-bold uppercase tracking-[0.2em]">Synchronizing Records...</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-24 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-transparent dark:border-white/5 shadow-inner">
                            <Plus className="text-slate-300" size={36} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Empty Vault</h3>
                        <p className="text-slate-500 mt-2 max-w-[280px] font-medium italic">Your financial history starts with a single transaction.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile List View (Card-based) */}
                        <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
                            {filteredTransactions.map((t) => (
                                <div key={t.id} className="p-3 flex items-center justify-between hover:bg-blue-500/5 transition-all group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={clsx(
                                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm shrink-0",
                                            t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                        )}>
                                            {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-gray-900 dark:text-white text-[13px] truncate">{t.description || "Unnamed Entry"}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate mt-0.5">
                                                {t.category} • {t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right">
                                            <p className={clsx(
                                                "font-black text-[13px] tracking-tight",
                                                t.type === 'income' ? "text-emerald-500" : "text-gray-900 dark:text-white"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-slate-300 hover:text-rose-500 w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-gray-50 dark:bg-white/5"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-500/5 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                                    <tr>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5">Transaction</th>
                                        <th className="px-8 py-5">Category</th>
                                        <th className="px-8 py-5 text-right">Amount</th>
                                        <th className="px-8 py-5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {filteredTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-blue-500/5 transition-all group">
                                            <td className="px-8 py-6 whitespace-nowrap text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                {t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className={clsx(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm",
                                                        t.type === 'income' ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10" : "bg-rose-500/10 text-rose-500 shadow-rose-500/10"
                                                    )}>
                                                        {t.type === 'income' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white tracking-tight text-base">{t.description || "Unnamed Entry"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="px-5 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-[0.15em] bg-gray-50 dark:bg-white/5 text-slate-500 border border-gray-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className={clsx(
                                                "px-8 py-6 whitespace-nowrap text-right font-bold text-xl tracking-tight",
                                                t.type === 'income' ? "text-emerald-500" : "text-gray-900 dark:text-white"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110 active:scale-90"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Mobile FAB */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform shadow-blue-600/40"
            >
                <Plus size={28} />
            </button>
        </div>
    );
};


export default Transactions;
