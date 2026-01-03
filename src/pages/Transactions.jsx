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
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your income and expenses</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-bold"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all"
                    />
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl">
                    {['all', 'income', 'expense'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={clsx(
                                "px-5 py-1.5 rounded-lg text-sm font-bold capitalize transition-all",
                                filterType === type
                                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                {loading ? (
                    <div className="p-20 text-center animate-pulse text-gray-400 font-medium">Updating transaction history...</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                            <Plus className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Record Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-[240px]">Start tracking your finances by adding your first transaction.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-750">
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium">
                                            {t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                    t.type === 'income' ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                                                )}>
                                                    {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                                </div>
                                                <span className="font-bold tracking-tight">{t.description || "Unspecified Record"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className={clsx(
                                            "px-6 py-5 whitespace-nowrap text-right font-black text-base",
                                            t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                                        )}>
                                            {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};


export default Transactions;
