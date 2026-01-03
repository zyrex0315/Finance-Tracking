import { useState, useMemo, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];


const SummaryCard = ({ title, amount, icon: Icon, color, subtitle }) => {
    const { formatAmount } = useCurrencyStore();
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatAmount(amount)}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
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
    // ... (logic remains the same)
    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        }
    }, [currentUser, fetchTransactions]);

    // Filter transactions based on time range
    const filteredTransactions = useMemo(() => {
        if (timeRange === 'all') return transactions;
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - parseInt(timeRange));
        return transactions.filter(t => new Date(t.date) >= cutoff);
    }, [transactions, timeRange]);

    // Prepare data for Category Pie Chart (Expenses only)
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

    // Prepare data for Monthly Comparison (Bar Chart)
    const trendData = useMemo(() => {
        const grouped = filteredTransactions.reduce((acc, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
            if (curr.type === 'income') acc[dateStr].income += curr.amount;
            else acc[dateStr].expense += curr.amount;
            return acc;
        }, {});

        return Object.values(grouped).reverse();
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
        return <div className="p-6 text-center animate-pulse dark:text-gray-400">Analyzing your data...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">Deep dive into your spending and income trends</p>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {[
                        { label: '7D', value: '7' },
                        { label: '30D', value: '30' },
                        { label: '90D', value: '90' },
                        { label: 'All', value: 'all' }
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === range.value
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Income"
                    amount={totalIncome}
                    icon={TrendingUp}
                    color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={totalExpense}
                    icon={TrendingDown}
                    color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                />
                <SummaryCard
                    title="Net Savings"
                    amount={savings}
                    icon={PiggyBank}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    subtitle={`Savings Rate: ${savingsRate.toFixed(1)}%`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expenses by Category</h2>
                    <div className="h-[300px] w-full">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val) => formatAmount(val)}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No expense data for this period</div>
                        )}
                    </div>
                </div>

                {/* Trend Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Income vs Expenses</h2>
                    <div className="h-[300px] w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                        formatter={(val) => formatAmount(val)}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No trend data for this period</div>
                        )}
                    </div>
                </div>

                {/* Top Spending Categories List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 transition-colors duration-200">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending Breakdown</h2>
                    {categoryData.length > 0 ? (
                        <div className="space-y-4">
                            {categoryData.map((cat, index) => {
                                const percentage = (cat.value / totalExpense) * 100;
                                return (
                                    <div key={cat.name} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                            <span className="text-gray-900 dark:text-white font-bold">{formatAmount(cat.value)} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">Add some expenses to see a breakdown</div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Analytics;
