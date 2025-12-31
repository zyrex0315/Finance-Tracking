import { useEffect, useMemo } from 'react';
import { CreditCard, TrendingDown, TrendingUp, History, PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import useTransactionStore from '../context/transactionStore';
import useBudgetStore from '../context/budgetStore';
import useAuthStore from '../context/authStore';
import { Link } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
    const { budgets, fetchBudgets } = useBudgetStore();
    const { currentUser } = useAuthStore();

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
            fetchBudgets();
        }
    }, [currentUser, fetchTransactions, fetchBudgets]);

    // Summary Stats
    const income = useMemo(() => transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0), [transactions]);

    const expense = useMemo(() => transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0), [transactions]);

    const balance = income - expense;

    // Budget Alerts: Find categories over 90%
    const budgetAlerts = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t =>
            t.type === 'expense' && new Date(t.date) >= startOfMonth
        );

        const categorySpending = monthlyTransactions.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        return budgets
            .map(b => ({
                ...b,
                spent: categorySpending[b.category] || 0
            }))
            .filter(b => b.spent >= b.limit * 0.9)
            .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit));
    }, [transactions, budgets]);

    // Chart Data: Balance Trend (Last 10 transactions of activity)
    const trendData = useMemo(() => {
        const grouped = transactions.slice(0, 10).reduce((acc, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, amount: 0 };
            acc[dateStr].amount += curr.type === 'income' ? curr.amount : -curr.amount;
            return acc;
        }, {});
        return Object.values(grouped);
    }, [transactions]);

    // Chart Data: Expense Categories
    const categoryData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const grouped = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <div className="mb-0 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, {currentUser?.displayName || 'User'}</p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-400">Current Balance</p>
                    <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Budget Alerts Section */}
            {budgetAlerts.length > 0 && (
                <div className="space-y-3">
                    {budgetAlerts.map(alert => (
                        <div key={alert.id} className="bg-white dark:bg-gray-800 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-center justify-between group transition-all hover:translate-x-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        Budget Alert: {alert.category}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        You've spent ${alert.spent.toFixed(0)} of your ${alert.limit.toFixed(0)} monthly limit.
                                    </p>
                                </div>
                            </div>
                            <Link to="/budgets" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-tight">
                                Manage
                            </Link>
                        </div>
                    ))}
                </div>
            )}

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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Balance Trend */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="text-blue-500" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Financial Activity</h2>
                    </div>
                    <div className="h-[240px] w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic py-12">Add transactions to see charts</div>
                        )}
                    </div>
                </div>

                {/* Spending by Category */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <PieIcon className="text-purple-500" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Categories</h2>
                    </div>
                    <div className="h-[240px] w-full flex items-center">
                        {categoryData.length > 0 ? (
                            <>
                                <div className="w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={65}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 space-y-3 pl-4">
                                    {categoryData.map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                <span className="text-gray-500 dark:text-gray-400 truncate max-w-[80px]">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-700 dark:text-gray-200">${item.value.toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">Categorized spending shows here</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <History className="text-gray-400" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    </div>
                    <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                        View History
                    </Link>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 animate-pulse">Updating activity...</div>
                ) : recentTransactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 italic">Start tracking your transactions!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recentTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white leading-none mb-1">{t.description || "No description"}</p>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">{t.category} • {t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
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
