import { useEffect } from 'react';
import { CreditCard, TrendingDown, TrendingUp, History } from 'lucide-react';
import useTransactionStore from '../context/transactionStore';
import { Link } from 'react-router-dom';

const DashboardStats = ({ title, amount, type, icon: Icon }) => {
    const isIncome = type === 'income';
    const isExpense = type === 'expense';

    let colorClass = 'text-gray-900 dark:text-white';
    if (isIncome) colorClass = 'text-green-600 dark:text-green-400';
    if (isExpense) colorClass = 'text-red-600 dark:text-red-400';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${isIncome ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                        isExpense ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>
                    ${amount.toFixed(2)}
                </h3>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { transactions, fetchTransactions, loading } = useTransactionStore();

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back, here's your financial overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardStats
                    title="Total Balance"
                    amount={balance}
                    type="balance"
                    icon={CreditCard}
                />
                <DashboardStats
                    title="Total Income"
                    amount={income}
                    type="income"
                    icon={TrendingUp}
                />
                <DashboardStats
                    title="Total Expenses"
                    amount={expense}
                    type="expense"
                    icon={TrendingDown}
                />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <History className="text-gray-400" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                    </div>
                    <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading data...</div>
                ) : recentTransactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No recent transactions</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recentTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {t.description || "No description"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
