import { useState, useMemo, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, Calendar, Activity, PieChart as PieChartIcon } from 'lucide-react';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';
import clsx from 'clsx';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const SummaryCard = ({ title, amount, icon: Icon, color, subtitle }) => {
    const { formatAmount } = useCurrencyStore();
    return (
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary-600/10 duration-300 group">
            <div className="flex items-center gap-6">
                <div className={clsx(
                    "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                    color
                )}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{formatAmount(amount)}</h3>
                    {subtitle && <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 italic opacity-80">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

const Analytics = () => {
    const { transactions, fetchTransactions, loading } = useTransactionStore();
    const { currentUser } = useAuthStore();
    const { formatAmount } = useCurrencyStore();
    const [timeRange, setTimeRange] = useState('30'); // '7', '30', '90', 'all'

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        }
    }, [currentUser, fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        if (timeRange === 'all') return transactions;
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - parseInt(timeRange));
        return transactions.filter(t => {
            const d = t.date instanceof Date ? t.date : new Date(t.date);
            return d >= cutoff;
        });
    }, [transactions, timeRange]);

    const categoryData = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const grouped = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    const trendData = useMemo(() => {
        const grouped = filteredTransactions.reduce((acc, curr) => {
            const d = curr.date instanceof Date ? curr.date : new Date(curr.date);
            const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
            if (curr.type === 'income') acc[dateStr].income += curr.amount;
            else acc[dateStr].expense += curr.amount;
            return acc;
        }, {});

        return Object.values(grouped);
    }, [filteredTransactions]);

    const totalIncome = useMemo(() =>
        filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
        , [filteredTransactions]);

    const totalExpense = useMemo(() =>
        filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
        , [filteredTransactions]);

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    if (loading && transactions.length === 0) {
        return (
            <div className="p-16 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse text-center">Crunching your financial data...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Intelligence Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 italic">Deep analytical insights for your wealth strategy</p>
                </div>

                <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg">
                    {[
                        { label: '7D', value: '7' },
                        { label: '30D', value: '30' },
                        { label: '90D', value: '90' },
                        { label: 'ALL', value: 'all' }
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                timeRange === range.value
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-500 hover:text-primary-500 hover:bg-white/10'
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SummaryCard
                    title="Total Income"
                    amount={totalIncome}
                    icon={TrendingUp}
                    color="bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={totalExpense}
                    icon={TrendingDown}
                    color="bg-rose-500/10 text-rose-500 shadow-rose-500/20"
                />
                <SummaryCard
                    title="Liquid Savings"
                    amount={savings}
                    icon={PiggyBank}
                    color="bg-primary-500/10 text-primary-500 shadow-primary-500/20"
                    subtitle={`Efficiency: ${savingsRate.toFixed(1)}%`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Category Mix */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                            <PieChartIcon size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Category Distribution</h2>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', color: '#fff', padding: '16px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        formatter={(val) => formatAmount(val)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 italic space-y-4">
                                <Activity className="w-12 h-12 opacity-20" />
                                <p className="font-bold">No expenditure recorded</p>
                            </div>
                        )}
                    </div>
                    {/* Decorative bottom effect */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                {/* Trend Analysis */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Flow Analysis</h2>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 12 }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', color: '#fff', padding: '16px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val) => formatAmount(val)}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[8, 8, 0, 0]} barSize={16} />
                                    <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[8, 8, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 italic space-y-4">
                                <Activity className="w-12 h-12 opacity-20" />
                                <p className="font-bold">Awaiting financial patterns</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Granular Breakdown */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 lg:col-span-2 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                            <TrendingDown size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Spending Structural Breakdown</h2>
                    </div>

                    {categoryData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {categoryData.map((cat, index) => {
                                const percentage = (cat.value / totalExpense) * 100;
                                const color = COLORS[index % COLORS.length];
                                return (
                                    <div key={cat.name} className="space-y-4 group">
                                        <div className="flex justify-between items-end px-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.name}</span>
                                                <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{formatAmount(cat.value)}</p>
                                            </div>
                                            <span className="text-xs font-black text-primary-500 bg-primary-500/10 px-3 py-1 rounded-lg">{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-500/10 rounded-full h-3.5 p-0.5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: color,
                                                    boxShadow: `0 0 15px ${color}40`
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No structural data available for this range</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
