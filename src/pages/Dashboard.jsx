
import { useEffect, useMemo, useState } from 'react';
import {
    CreditCard,
    TrendingDown,
    TrendingUp,
    History,
    PieChart as PieIcon,
    AlertCircle,
    Plus,
    ArrowUpRight,
    Wallet,
    CalendarDays,
    ArrowDownRight,
    Activity,
} from 'lucide-react';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

import { Link } from 'react-router-dom';
import clsx from 'clsx';

import useTransactionStore from '../context/transactionStore';
import useBudgetStore from '../context/budgetStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';

import AddTransactionModal from '../components/Modals/AddTransactionModal';

/* =========================================================
   DESIGN TOKENS
========================================================= */

const CHART_COLORS = [
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#14B8A6',
];

/* =========================================================
   STAT CARD
========================================================= */

const DashboardStats = ({
    title,
    amount,
    type,
    icon: Icon,
}) => {
    const { formatAmount } = useCurrencyStore();

    const isIncome = type === 'income';
    const isExpense = type === 'expense';

    return (
        <div
            className={clsx(
                'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300',
                'hover:-translate-y-0.5 hover:shadow-xl',
                'bg-white border-slate-200',
                'dark:bg-[#11151C] dark:border-white/[0.07]'
            )}
        >



            <div className="relative flex items-start justify-between">

                <div
                    className={clsx(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        isIncome
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : isExpense
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                    )}
                >
                    <Icon size={18} strokeWidth={1.8} />
                </div>

                <span
                    className={clsx(
                        'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider',
                        isIncome
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : isExpense
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                    )}
                >
                    {type === 'balance' ? 'Current' : type}
                </span>
            </div>

            <div className="relative mt-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {title}
                </p>

                <p
                    className={clsx(
                        'mt-1.5 truncate text-2xl font-bold tracking-tight md:text-[27px]',
                        isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isExpense
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-900 dark:text-white'
                    )}
                >
                    {formatAmount(amount)}
                </p>
            </div>

            <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.05]">
                <div
                    className={clsx(
                        'h-full rounded-full transition-all',
                        isIncome
                            ? 'w-[72%] bg-emerald-500'
                            : isExpense
                                ? 'w-[54%] bg-rose-500'
                                : 'w-[85%] bg-indigo-500'
                    )}
                />
            </div>
        </div>
    );
};

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

const ActivityTooltip = ({
    active,
    payload,
    label,
    formatAmount,
}) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#11151C]/95">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatAmount(payload[0].value)}
            </p>
        </div>
    );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
    icon: Icon,
    title,
    description,
    action,
}) => (
    <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                <Icon size={16} strokeWidth={1.8} />
            </div>

            <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>

                {description && (
                    <p className="mt-0.5 text-[10px] text-slate-400">
                        {description}
                    </p>
                )}
            </div>

        </div>

        {action}
    </div>
);

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
    const {
        transactions,
        fetchTransactions,
        loading,
    } = useTransactionStore();

    const {
        budgets,
        fetchBudgets,
    } = useBudgetStore();

    const { currentUser } = useAuthStore();

    const { formatAmount } = useCurrencyStore();

    const [isModalOpen, setIsModalOpen] = useState(false);

    /* =====================================================
       FETCH DATA
    ===================================================== */

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
            fetchBudgets();
        }
    }, [currentUser, fetchTransactions, fetchBudgets]);

    /* =====================================================
       FINANCIAL TOTALS
    ===================================================== */

    const { income, expense, balance } = useMemo(() => {
        return transactions.reduce(
            (acc, transaction) => {
                const amount = Number(transaction.amount) || 0;

                if (transaction.type === 'income') {
                    acc.income += amount;
                } else {
                    acc.expense += amount;
                }

                acc.balance = acc.income - acc.expense;

                return acc;
            },
            {
                income: 0,
                expense: 0,
                balance: 0,
            }
        );
    }, [transactions]);

    /* =====================================================
       RECENT TRANSACTIONS
    ===================================================== */

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) - new Date(a.date)
            )
            .slice(0, 5);
    }, [transactions]);

    /* =====================================================
       7 DAY ACTIVITY
    ===================================================== */

    const trendData = useMemo(() => {
        const last7Days = [...Array(7)]
            .map((_, index) => {
                const date = new Date();

                date.setDate(
                    date.getDate() - index
                );

                return date
                    .toISOString()
                    .split('T')[0];
            })
            .reverse();

        return last7Days.map((date) => {
            const amount = transactions
                .filter((transaction) => {
                    if (!transaction.date) return false;

                    const transactionDate =
                        transaction.date instanceof Date
                            ? transaction.date
                            : new Date(transaction.date);

                    return (
                        transactionDate
                            .toISOString()
                            .split('T')[0] === date
                    );
                })
                .reduce(
                    (total, transaction) =>
                        total +
                        (transaction.type === 'income'
                            ? Number(transaction.amount)
                            : -Number(transaction.amount)),
                    0
                );

            return {
                date: new Date(
                    date
                ).toLocaleDateString(undefined, {
                    weekday: 'short',
                }),
                amount,
            };
        });
    }, [transactions]);

    /* =====================================================
       CATEGORY DATA
    ===================================================== */

    const categoryData = useMemo(() => {
        const categories = transactions
            .filter(
                (transaction) =>
                    transaction.type === 'expense'
            )
            .reduce((acc, transaction) => {
                acc[transaction.category] =
                    (acc[transaction.category] || 0) +
                    Number(transaction.amount);

                return acc;
            }, {});

        return Object.entries(categories)
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [transactions]);

    /* =====================================================
       BUDGET ALERTS
    ===================================================== */

    const budgetAlerts = useMemo(() => {
        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const monthlyExpenses = transactions.filter(
            (transaction) =>
                transaction.type === 'expense' &&
                new Date(transaction.date) >= startOfMonth
        );

        const spendingByCategory =
            monthlyExpenses.reduce((acc, transaction) => {
                acc[transaction.category] =
                    (acc[transaction.category] || 0) +
                    Number(transaction.amount);

                return acc;
            }, {});

        return budgets
            .map((budget) => ({
                ...budget,
                spent:
                    spendingByCategory[budget.category] || 0,
            }))
            .filter(
                (budget) =>
                    budget.spent >= budget.limit * 0.8
            )
            .sort(
                (a, b) =>
                    b.spent / b.limit -
                    a.spent / a.limit
            );
    }, [transactions, budgets]);

    /* =====================================================
       USER
    ===================================================== */

    const firstName =
        currentUser?.displayName?.split(' ')[0] ||
        currentUser?.email?.split('@')[0] ||
        'there';

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-full bg-[#F6F7F9] text-slate-900 dark:bg-[#080B10] dark:text-slate-100">

            <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="mb-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                    Personal Finance
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
                                Good morning, {firstName}.
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Here's what's happening with your money today.
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-white/[0.07] dark:bg-[#11151C] sm:flex">

                                <CalendarDays
                                    size={15}
                                    className="text-slate-400"
                                />

                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {new Date().toLocaleDateString(
                                        undefined,
                                        {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }
                                    )}
                                </span>

                            </div>

                            <button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-950/10 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400"
                            >
                                <Plus
                                    size={15}
                                    className="transition-transform group-hover:rotate-90"
                                />

                                Add transaction
                            </button>

                        </div>

                    </div>

                </header>

                {/* =================================================
                    HERO BALANCE
                ================================================= */}

                <section className="mb-5 overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10 dark:border dark:border-white/[0.06] dark:bg-[#11151C] md:p-7">

                    <div className="relative">



                        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

                            <div>

                                <div className="mb-5 flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                                        <Wallet size={15} />
                                    </div>

                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                                        Total balance
                                    </span>

                                </div>

                                <p className="text-4xl font-bold tracking-[-0.04em] md:text-5xl">
                                    {formatAmount(balance)}
                                </p>

                                <div className="mt-4 flex items-center gap-2">

                                    {balance >= 0 ? (
                                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                                            <TrendingUp size={12} />
                                            Positive balance
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 rounded-full bg-rose-400/10 px-2.5 py-1 text-[10px] font-bold text-rose-300">
                                            <TrendingDown size={12} />
                                            Negative balance
                                        </div>
                                    )}

                                    <span className="text-[10px] text-white/40">
                                        Current financial position
                                    </span>

                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[430px]">

                                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                        Income
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-emerald-300">
                                        {formatAmount(income)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                        Expenses
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-rose-300">
                                        {formatAmount(expense)}
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm sm:col-span-1">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                                        Transactions
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-white">
                                        {transactions.length}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

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

                </section>

                {/* =================================================
                    BUDGET ALERTS
                ================================================= */}

                {budgetAlerts.length > 0 && (
                    <section className="mb-7 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 dark:border-amber-500/10 dark:bg-amber-500/[0.04]">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                    <AlertCircle size={16} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Budget attention
                                    </h2>

                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        Some categories are approaching their limits.
                                    </p>
                                </div>

                            </div>

                            <Link
                                to="/budgets"
                                className="text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                            >
                                View budgets
                            </Link>

                        </div>

                        <div className="grid gap-3 md:grid-cols-2">

                            {budgetAlerts.map((alert) => {

                                const percentage = Math.round(
                                    (alert.spent / alert.limit) * 100
                                );

                                const progress =
                                    Math.min(percentage, 100);

                                return (
                                    <div
                                        key={alert.id}
                                        className="rounded-xl border border-amber-200/70 bg-white/70 p-4 dark:border-amber-500/10 dark:bg-white/[0.025]"
                                    >

                                        <div className="mb-3 flex items-center justify-between">

                                            <div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {alert.category}
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-500">
                                                    {formatAmount(alert.spent)}
                                                    {' '}of{' '}
                                                    {formatAmount(alert.limit)}
                                                </p>
                                            </div>

                                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                                {percentage}%
                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                            <div
                                                className={clsx(
                                                    'h-full rounded-full transition-all',
                                                    progress >= 100
                                                        ? 'bg-rose-500'
                                                        : 'bg-amber-500'
                                                )}
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </section>
                )}

                {/* =================================================
                    ANALYTICS
                ================================================= */}

                <section className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">

                    {/* ACTIVITY */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="border-b border-slate-200 p-5 dark:border-white/[0.06]">

                            <SectionHeader
                                icon={Activity}
                                title="Financial activity"
                                description="Net movement across the last 7 days"
                                action={
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
                                        7 days
                                    </span>
                                }
                            />

                        </div>

                        <div className="h-[320px] p-4 pt-7">

                            {trendData.length > 0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart
                                        data={trendData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -25,
                                            bottom: 0,
                                        }}
                                    >



                                        <CartesianGrid
                                            vertical={false}
                                            stroke="#94a3b8"
                                            strokeOpacity={0.10}
                                        />

                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 10,
                                                fontWeight: 500,
                                            }}
                                            dy={10}
                                        />

                                        <YAxis hide />

                                        <Tooltip
                                            cursor={{
                                                stroke: '#6366F1',
                                                strokeOpacity: 0.15,
                                            }}
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => (
                                                <ActivityTooltip
                                                    active={active}
                                                    payload={payload}
                                                    label={label}
                                                    formatAmount={
                                                        formatAmount
                                                    }
                                                />
                                            )}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#6366F1"
                                            strokeWidth={2.5}
                                            fill="none"
                                            dot={{
                                                r: 3,
                                                fill: '#6366F1',
                                                strokeWidth: 2,
                                                stroke: '#11151C',
                                            }}
                                            activeDot={{
                                                r: 5,
                                                fill: '#6366F1',
                                                strokeWidth: 3,
                                                stroke: '#11151C',
                                            }}
                                        />

                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                    No activity recorded yet.
                                </div>
                            )}

                        </div>

                    </div>

                    {/* SPENDING */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="border-b border-slate-200 p-5 dark:border-white/[0.06]">

                            <SectionHeader
                                icon={PieIcon}
                                title="Spending breakdown"
                                description="Top expense categories"
                                action={
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        Expenses
                                    </span>
                                }
                            />

                        </div>

                        <div className="flex min-h-[320px] flex-col justify-center gap-5 p-5 sm:flex-row sm:items-center">

                            {categoryData.length > 0 ? (
                                <>
                                    <div className="relative h-[190px] w-[190px] shrink-0">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>

                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={58}
                                                    outerRadius={82}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {categoryData.map(
                                                        (
                                                            entry,
                                                            index
                                                        ) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    CHART_COLORS[
                                                                    index %
                                                                    CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatAmount(
                                                            value
                                                        )
                                                    }
                                                />

                                            </PieChart>
                                        </ResponsiveContainer>

                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                Total
                                            </p>

                                            <p className="mt-1 max-w-[100px] truncate text-sm font-bold text-slate-900 dark:text-white">
                                                {formatAmount(
                                                    categoryData.reduce(
                                                        (sum, item) =>
                                                            sum +
                                                            item.value,
                                                        0
                                                    )
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="w-full space-y-4">

                                        {categoryData.map(
                                            (item, index) => {

                                                const total =
                                                    categoryData.reduce(
                                                        (sum, value) =>
                                                            sum +
                                                            value.value,
                                                        0
                                                    );

                                                const percentage =
                                                    total > 0
                                                        ? Math.round(
                                                            (item.value /
                                                                total) *
                                                            100
                                                        )
                                                        : 0;

                                                return (
                                                    <div
                                                        key={
                                                            item.name
                                                        }
                                                    >

                                                        <div className="mb-1.5 flex items-center justify-between gap-3">

                                                            <div className="flex min-w-0 items-center gap-2">

                                                                <span
                                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            CHART_COLORS[
                                                                            index %
                                                                            CHART_COLORS.length
                                                                            ],
                                                                    }}
                                                                />

                                                                <span className="truncate text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </span>

                                                            </div>

                                                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">
                                                                {
                                                                    percentage
                                                                }%
                                                            </span>

                                                        </div>

                                                        <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">

                                                            <div
                                                                className="h-full rounded-full transition-all"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                    backgroundColor:
                                                                        CHART_COLORS[
                                                                        index %
                                                                        CHART_COLORS.length
                                                                        ],
                                                                }}
                                                            />

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                </>
                            ) : (
                                <div className="text-xs text-slate-400">
                                    No spending data yet.
                                </div>
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    RECENT TRANSACTIONS
                ================================================= */}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                    <div className="border-b border-slate-200 p-5 dark:border-white/[0.06]">

                        <SectionHeader
                            icon={History}
                            title="Recent transactions"
                            description="Your latest financial activity"
                            action={
                                <Link
                                    to="/transactions"
                                    className="group flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.08]"
                                >
                                    View all
                                    <ArrowUpRight
                                        size={12}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            }
                        />

                    </div>

                    {loading ? (
                        <div className="px-5 py-16 text-center">

                            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 dark:border-white/10 dark:border-t-indigo-400" />

                            <p className="text-xs text-slate-400">
                                Loading transactions...
                            </p>

                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="px-5 py-16 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.05]">
                                <History size={20} />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                No transactions yet
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Add your first transaction to start tracking.
                            </p>

                            <button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className="mt-4 text-xs font-bold text-indigo-600 underline underline-offset-4 dark:text-indigo-400"
                            >
                                Add transaction
                            </button>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[600px] text-left">

                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-white/[0.05]">

                                        <th className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Transaction
                                        </th>

                                        <th className="px-5 py-3.5 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Amount
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">

                                    {recentTransactions.map(
                                        (transaction) => {

                                            const isIncome =
                                                transaction.type ===
                                                'income';

                                            return (
                                                <tr
                                                    key={
                                                        transaction.id
                                                    }
                                                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.025]"
                                                >

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div
                                                                className={clsx(
                                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform group-hover:scale-105',
                                                                    isIncome
                                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                                                                )}
                                                            >
                                                                {transaction.category?.[0]?.toUpperCase() ||
                                                                    'T'}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                                    {transaction.description ||
                                                                        'Untitled'}
                                                                </p>

                                                                <div className="mt-1 flex items-center gap-2">

                                                                    <span className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                                        {
                                                                            transaction.category
                                                                        }
                                                                    </span>

                                                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                                                                    <span className="text-[9px] text-slate-400">
                                                                        {transaction.date
                                                                            ? new Date(
                                                                                transaction.date
                                                                            ).toLocaleDateString()
                                                                            : 'N/A'}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td
                                                        className={clsx(
                                                            'whitespace-nowrap px-5 py-4 text-right'
                                                        )}
                                                    >

                                                        <div className="flex items-center justify-end gap-2">

                                                            <div
                                                                className={clsx(
                                                                    'flex h-6 w-6 items-center justify-center rounded-full',
                                                                    isIncome
                                                                        ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10'
                                                                        : 'bg-rose-50 text-rose-500 dark:bg-rose-500/10'
                                                                )}
                                                            >
                                                                {isIncome ? (
                                                                    <ArrowUpRight size={12} />
                                                                ) : (
                                                                    <ArrowDownRight size={12} />
                                                                )}
                                                            </div>

                                                            <span
                                                                className={clsx(
                                                                    'text-sm font-bold',
                                                                    isIncome
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-slate-900 dark:text-white'
                                                                )}
                                                            >
                                                                {isIncome
                                                                    ? '+'
                                                                    : '-'}
                                                                {formatAmount(
                                                                    transaction.amount
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </div>

            {/* =================================================
                MODAL
            ================================================= */}

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
            />

            {/* =================================================
                MOBILE ACTION
            ================================================= */}

            <button
                onClick={() =>
                    setIsModalOpen(true)
                }
                aria-label="Add transaction"
                className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/20 transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-950 md:hidden"
            >
                <Plus size={21} />
            </button>

        </div>
    );
};

export default Dashboard;
