import { useEffect, useMemo } from 'react';
import { CreditCard, TrendingDown, TrendingUp, History, PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import useTransactionStore from '../context/transactionStore';
import useBudgetStore from '../context/budgetStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardStats = ({ title, amount, type, icon: Icon }) => {
    const { formatAmount } = useCurrencyStore();
    const isIncome = type === 'income';
    const isExpense = type === 'expense';

    let colorClass = 'text-gray-900 dark:text-white';
    if (isIncome) colorClass = 'text-emerald-500 dark:text-emerald-400';
    if (isExpense) colorClass = 'text-rose-500 dark:text-rose-400';

    return (
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-white/10 transition-all hover:translate-y-[-4px] hover:shadow-xl duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={clsx(
                    'p-3 rounded-2xl transition-colors duration-300',
                    isIncome ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' :
                        isExpense ? 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' :
                            'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                )}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className={`text-2xl font-bold mt-1 tracking-tight ${colorClass}`}>
                    {formatAmount(amount)}
                </h3>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { transactions, fetchTransactions, loading } = useTransactionStore();
    const { budgets, fetchBudgets } = useBudgetStore();
    const { currentUser } = useAuthStore();
    const { formatAmount } = useCurrencyStore();

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
            fetchBudgets();
        }
    }, [currentUser, fetchTransactions, fetchBudgets]);

    const { income, expense, balance } = useMemo(() => {
        return transactions.reduce((acc, t) => {
            const amount = Number(t.amount);
            if (t.type === 'income') acc.income += amount;
            else acc.expense += amount;
            acc.balance = acc.income - acc.expense;
            return acc;
        }, { income: 0, expense: 0, balance: 0 });
    }, [transactions]);

    const recentTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    }, [transactions]);

    const trendData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayAmount = transactions
                .filter(t => {
                    if (!t.date) return false;
                    const d = t.date instanceof Date ? t.date : new Date(t.date);
                    return d.toISOString().split('T')[0] === date;
                })
                .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
            return {
                date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                amount: dayAmount
            };
        });
    }, [transactions]);

    const categoryData = useMemo(() => {
        const categories = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        return Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [transactions]);

    const budgetAlerts = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyExpenses = transactions.filter(t =>
            t.type === 'expense' && new Date(t.date) >= startOfMonth
        );

        const spendingByCategory = monthlyExpenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        return budgets
            .map(budget => ({
                ...budget,
                spent: spendingByCategory[budget.category] || 0
            }))
            .filter(b => b.spent >= b.limit * 0.8)
            .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit));
    }, [transactions, budgets]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Ready to manage your wealth, {currentUser?.displayName?.split(' ')[0] || 'User'}?</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-end">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Balance</p>
                    <p className={`text-2xl font-bold tracking-tight ${balance >= 0 ? 'text-primary-500' : 'text-rose-500'}`}>
                        {formatAmount(balance)}
                    </p>
                </div>
            </div>

            {/* Budget Alerts Section */}
            {budgetAlerts.length > 0 && (
                <div className="space-y-4">
                    {budgetAlerts.map(alert => (
                        <div key={alert.id} className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 p-5 rounded-3xl flex items-center justify-between group animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                        Budget Alert: {alert.category}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        You've spent <span className="text-rose-400 font-semibold">{formatAmount(alert.spent)}</span> of your {formatAmount(alert.limit)} monthly limit.
                                    </p>
                                </div>
                            </div>
                            <Link to="/budgets" className="px-5 py-2 bg-rose-500/20 text-rose-500 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest">
                                Fix Now
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Balance Trend */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                                <BarChart3 size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Activity Trend</h2>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" opacity={0.1} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        formatter={(val) => formatAmount(val)}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm italic py-12">No data yet</div>
                        )}
                    </div>
                </div>

                {/* Spending by Category */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                            <PieIcon size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Category Mix</h2>
                    </div>
                    <div className="h-[280px] w-full flex flex-col md:flex-row items-center gap-8">
                        {categoryData.length > 0 ? (
                            <>
                                <div className="w-full md:w-1/2 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={85}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val) => formatAmount(val)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full md:w-1/2 space-y-4">
                                    {categoryData.map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}80` }} />
                                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatAmount(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm italic">Analyze your spending</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-500/10 text-slate-500 rounded-xl">
                            <History size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Recent Activity</h2>
                    </div>
                    <Link to="/transactions" className="px-5 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 uppercase tracking-widest">
                        Full History
                    </Link>
                </div>

                {loading ? (
                    <div className="p-16 text-center text-slate-500 animate-pulse font-medium">Processing records...</div>
                ) : recentTransactions.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 italic font-medium">No activity recorded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-500/5 text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em]">
                                <tr>
                                    <th className="px-8 py-4">Transaction</th>
                                    <th className="px-8 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {recentTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-primary-500/5 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110',
                                                    t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                )}>
                                                    {t.category[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white tracking-tight">{t.description || "Untitled"}</p>
                                                    <p className="text-[10px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">{t.category} • {t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-8 py-5 text-right font-bold text-lg tracking-tight ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
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
