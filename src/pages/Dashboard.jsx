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

const CHART_COLORS = [
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#14B8A6',
];

/* =========================================================
   SMALL STAT
========================================================= */

const SmallStat = ({ label, value, type, icon: Icon }) => {
    const isIncome = type === 'income';

    return (
        <div
            className="
                min-w-0 rounded-xl
                border border-slate-200
                bg-slate-50
                p-2.5
                transition-colors duration-200
                dark:border-white/[0.06]
                dark:bg-white/[0.035]
                sm:p-4
            "
        >
            <div className="flex items-center gap-2">
                {Icon && (
                    <Icon
                        size={13}
                        className={clsx(
                            isIncome
                                ? 'text-emerald-500'
                                : 'text-rose-500'
                        )}
                    />
                )}

                <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
            </div>

            <p
                className={clsx(
                    'mt-1.5 truncate text-sm font-bold sm:text-base',
                    isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : type === 'expense'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                )}
            >
                {value}
            </p>
        </div>
    );
};

/* =========================================================
   ACTIVITY TOOLTIP
========================================================= */

const ActivityTooltip = ({
    active,
    payload,
    label,
    formatAmount,
}) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div
            className="
                rounded-xl
                border border-slate-200
                bg-white
                px-3 py-2.5
                shadow-lg
                dark:border-white/10
                dark:bg-[#11151C]
            "
        >
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
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
    <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
            <div
                className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-600
                    dark:bg-white/[0.06]
                    dark:text-slate-300
                "
            >
                <Icon size={15} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>

                {description && (
                    <p className="hidden truncate text-[10px] text-slate-400 sm:block">
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
    }, [
        currentUser,
        fetchTransactions,
        fetchBudgets,
    ]);

    /* =====================================================
       FINANCIAL TOTALS
    ===================================================== */

    const {
        income,
        expense,
        balance,
    } = useMemo(() => {
        return transactions.reduce(
            (acc, transaction) => {
                const amount =
                    Number(transaction.amount) || 0;

                if (transaction.type === 'income') {
                    acc.income += amount;
                } else {
                    acc.expense += amount;
                }

                acc.balance =
                    acc.income - acc.expense;

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
                    new Date(b.date) -
                    new Date(a.date)
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
                    if (!transaction.date) {
                        return false;
                    }

                    const transactionDate =
                        transaction.date instanceof Date
                            ? transaction.date
                            : new Date(
                                transaction.date
                            );

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
                            ? Number(
                                transaction.amount
                            ) || 0
                            : -(
                                Number(
                                    transaction.amount
                                ) || 0
                            )),
                    0
                );

            return {
                date: new Date(
                    date
                ).toLocaleDateString(
                    undefined,
                    {
                        weekday: 'short',
                    }
                ),
                amount,
            };
        });
    }, [transactions]);

    /* =====================================================
       EXPENSE CATEGORIES
    ===================================================== */

    const categoryData = useMemo(() => {
        const categories = transactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    'expense'
            )
            .reduce(
                (acc, transaction) => {
                    const category =
                        transaction.category ||
                        'Other';

                    acc[category] =
                        (acc[category] || 0) +
                        (Number(
                            transaction.amount
                        ) || 0);

                    return acc;
                },
                {}
            );

        return Object.entries(categories)
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort(
                (a, b) =>
                    b.value - a.value
            )
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

        const monthlyExpenses =
            transactions.filter(
                (transaction) =>
                    transaction.type ===
                    'expense' &&
                    new Date(
                        transaction.date
                    ) >= startOfMonth
            );

        const spendingByCategory =
            monthlyExpenses.reduce(
                (acc, transaction) => {
                    const category =
                        transaction.category ||
                        'Other';

                    acc[category] =
                        (acc[category] || 0) +
                        (Number(
                            transaction.amount
                        ) || 0);

                    return acc;
                },
                {}
            );

        return budgets
            .map((budget) => ({
                ...budget,
                spent:
                    spendingByCategory[
                    budget.category
                    ] || 0,
            }))
            .filter(
                (budget) =>
                    budget.limit > 0 &&
                    budget.spent >=
                    budget.limit * 0.8
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
        currentUser?.displayName?.split(
            ' '
        )[0] ||
        currentUser?.email?.split(
            '@'
        )[0] ||
        'there';

    /* =====================================================
       CATEGORY TOTAL
    ===================================================== */

    const categoryTotal = useMemo(() => {
        return categoryData.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );
    }, [categoryData]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
                min-h-full
                w-full
                overflow-x-hidden
                bg-[#F6F7F9]
                text-slate-900
                dark:bg-[#080B10]
                dark:text-slate-100
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1500px]
                    px-3
                    py-4
                    sm:px-6
                    sm:py-5
                    lg:px-8
                    lg:py-7
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="mb-5 sm:mb-7">
                    <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Personal Finance
                                </span>
                            </div>

                            <h1
                                className="
                                    break-words
                                    text-xl
                                    font-bold
                                    tracking-[-0.04em]
                                    text-slate-950
                                    dark:text-white
                                    sm:text-3xl
                                    md:text-4xl
                                "
                            >
                                Good morning, {firstName}.
                            </h1>

                            <p
                                className="
                                    mt-2
                                    hidden
                                    max-w-xl
                                    text-sm
                                    leading-relaxed
                                    text-slate-500
                                    dark:text-slate-400
                                    sm:block
                                "
                            >
                                Here's what's happening
                                with your money today.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {/* Desktop date */}
                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
                                    dark:border-white/[0.07]
                                    dark:bg-[#11151C]
                                    sm:flex
                                "
                            >
                                <CalendarDays
                                    size={14}
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

                            {/* Add transaction */}
                            <button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className="
                                    flex
                                    h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-slate-900
                                    px-3
                                    text-xs
                                    font-bold
                                    text-white
                                    transition
                                    hover:bg-slate-800
                                    dark:bg-white
                                    dark:text-slate-950
                                    dark:hover:bg-slate-200
                                    sm:h-auto
                                    sm:px-4
                                    sm:py-2.5
                                "
                            >
                                <Plus size={15} />

                                <span className="hidden sm:inline">
                                    Add transaction
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* =================================================
                    BALANCE HERO
                ================================================= */}

                <section
                    className="
                        mb-4
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-3.5
                        shadow-sm
                        transition-colors
                        duration-300
                        dark:border-white/[0.06]
                        dark:bg-[#11151C]
                        dark:text-white
                        sm:mb-5
                        sm:p-6
                        md:p-7
                    "
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-100
                                        text-slate-600
                                        dark:bg-white/[0.06]
                                        dark:text-slate-300
                                    "
                                >
                                    <Wallet size={15} />
                                </div>

                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Total balance
                                </span>
                            </div>

                            <p
                                className="
                                    mt-4
                                    truncate
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                    dark:text-white
                                    sm:text-4xl
                                    md:text-5xl
                                "
                            >
                                {formatAmount(balance)}
                            </p>

                            <div
                                className={clsx(
                                    'mt-2 flex items-center gap-1.5 text-[10px] font-semibold',
                                    balance >= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-rose-600 dark:text-rose-400'
                                )}
                            >
                                {balance >= 0 ? (
                                    <TrendingUp size={12} />
                                ) : (
                                    <TrendingDown size={12} />
                                )}

                                {balance >= 0
                                    ? 'Positive balance'
                                    : 'Negative balance'}
                            </div>
                        </div>

                        {/* Hidden only on mobile */}
                        <div
                            className="
                                hidden
                                rounded-xl
                                bg-slate-50
                                px-4
                                py-3
                                text-right
                                dark:bg-white/[0.035]
                                sm:block
                            "
                        >
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Transactions
                            </p>

                            <p className="mt-1 text-lg font-bold">
                                {transactions.length}
                            </p>
                        </div>
                    </div>

                    {/* Income / Expenses */}
                    <div
                        className="
                            grid
                            w-full
                            min-w-0
                            grid-cols-2
                            gap-2
                            sm:grid-cols-3
                            sm:gap-3
                            lg:min-w-[430px]
                        "
                        style={{
                            marginTop: '20px',
                        }}
                    >
                        <SmallStat
                            label="Income"
                            value={formatAmount(
                                income
                            )}
                            type="income"
                            icon={ArrowDownRight}
                        />

                        <SmallStat
                            label="Expenses"
                            value={formatAmount(
                                expense
                            )}
                            type="expense"
                            icon={ArrowUpRight}
                        />

                        {/* Desktop-only third stat */}
                        <div
                            className="
                                hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                                dark:border-white/[0.06]
                                dark:bg-white/[0.035]
                                sm:block
                            "
                        >
                            <div className="flex items-center gap-2">
                                <History
                                    size={13}
                                    className="text-slate-400"
                                />

                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Transactions
                                </p>
                            </div>

                            <p className="mt-1.5 text-base font-bold">
                                {transactions.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    ORIGINAL DASHBOARD STAT CARDS
                    Hidden only on mobile
                ================================================= */}

                <section
                    className="
                        hidden
                        mb-6
                        min-w-0
                        grid-cols-3
                        gap-3
                        sm:grid
                        sm:mb-7
                    "
                >
                    {/* Balance */}
                    <div
                        className="
                            min-w-0
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.06]
                            dark:bg-[#11151C]
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-indigo-50
                                    text-indigo-600
                                    dark:bg-indigo-500/10
                                    dark:text-indigo-400
                                "
                            >
                                <CreditCard size={18} />
                            </div>

                            <Wallet
                                size={16}
                                className="text-slate-300 dark:text-slate-600"
                            />
                        </div>

                        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Balance
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight">
                            {formatAmount(balance)}
                        </p>
                    </div>

                    {/* Income */}
                    <div
                        className="
                            min-w-0
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.06]
                            dark:bg-[#11151C]
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                    dark:bg-emerald-500/10
                                    dark:text-emerald-400
                                "
                            >
                                <TrendingUp size={18} />
                            </div>

                            <ArrowDownRight
                                size={16}
                                className="text-emerald-400"
                            />
                        </div>

                        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Income
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {formatAmount(income)}
                        </p>
                    </div>

                    {/* Expense */}
                    <div
                        className="
                            min-w-0
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.06]
                            dark:bg-[#11151C]
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-rose-50
                                    text-rose-600
                                    dark:bg-rose-500/10
                                    dark:text-rose-400
                                "
                            >
                                <TrendingDown size={18} />
                            </div>

                            <ArrowUpRight
                                size={16}
                                className="text-rose-400"
                            />
                        </div>

                        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Expenses
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            {formatAmount(expense)}
                        </p>
                    </div>
                </section>

                {/* =================================================
                    BUDGET ALERTS
                ================================================= */}

                {budgetAlerts.length > 0 && (
                    <section
                        className="
                            mb-4
                            rounded-2xl
                            border
                            border-amber-200
                            bg-amber-50/70
                            p-4
                            dark:border-amber-500/10
                            dark:bg-amber-500/[0.04]
                            sm:mb-6
                            sm:p-5
                        "
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-amber-100
                                        text-amber-600
                                        dark:bg-amber-500/10
                                        dark:text-amber-400
                                    "
                                >
                                    <AlertCircle size={15} />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-bold">
                                        Budget attention
                                    </h2>

                                    <p className="hidden text-[10px] text-slate-500 sm:block">
                                        Categories approaching their limits
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/budgets"
                                className="
                                    shrink-0
                                    text-[10px]
                                    font-bold
                                    text-amber-700
                                    dark:text-amber-400
                                "
                            >
                                View
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {budgetAlerts.map(
                                (alert, index) => {
                                    const percentage =
                                        Math.round(
                                            (alert.spent /
                                                alert.limit) *
                                            100
                                        );

                                    return (
                                        <div
                                            key={alert.id}
                                            className={clsx(
                                                `
                                                    rounded-xl
                                                    border
                                                    border-amber-200/70
                                                    bg-white/70
                                                    p-3
                                                    dark:border-amber-500/10
                                                    dark:bg-white/[0.025]
                                                `,
                                                index >= 2 &&
                                                'hidden sm:block'
                                            )}
                                        >
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="truncate text-xs font-semibold">
                                                    {alert.category}
                                                </span>

                                                <span className="shrink-0 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                                    {percentage}%
                                                </span>
                                            </div>

                                            <div className="h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                                <div
                                                    className={clsx(
                                                        'h-full rounded-full',
                                                        percentage >=
                                                            100
                                                            ? 'bg-rose-500'
                                                            : 'bg-amber-500'
                                                    )}
                                                    style={{
                                                        width: `${Math.min(
                                                            percentage,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </section>
                )}

                {/* =================================================
                    CHARTS
                ================================================= */}

                <section
                    className="
                        mb-4
                        grid
                        gap-4
                        sm:mb-6
                        xl:grid-cols-[1.55fr_1fr]
                    "
                >
                    {/* ACTIVITY */}
                    <div
                        className="
                            min-w-0
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            dark:border-white/[0.07]
                            dark:bg-[#11151C]
                        "
                    >
                        <div
                            className="
                                border-b
                                border-slate-200
                                p-4
                                dark:border-white/[0.06]
                                sm:p-5
                            "
                        >
                            <SectionHeader
                                icon={Activity}
                                title="Financial activity"
                                description="Net movement over 7 days"
                                action={
                                    <span
                                        className="
                                            rounded-full
                                            bg-slate-100
                                            px-2
                                            py-1
                                            text-[9px]
                                            font-semibold
                                            text-slate-500
                                            dark:bg-white/[0.05]
                                            dark:text-slate-400
                                        "
                                    >
                                        7 days
                                    </span>
                                }
                            />
                        </div>

                        <div
                            className="
                                h-[230px]
                                w-full
                                min-w-0
                                overflow-hidden
                                p-1
                                pt-4
                                sm:h-[320px]
                                sm:p-4
                                sm:pt-7
                            "
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart
                                    data={trendData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: -30,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#94a3b8"
                                        strokeOpacity={0.08}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#94a3b8',
                                            fontSize: 9,
                                        }}
                                        dy={7}
                                    />

                                    <YAxis hide />

                                    <Tooltip
                                        cursor={{
                                            stroke: '#6366F1',
                                            strokeOpacity: 0.12,
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
                                        strokeWidth={2}
                                        fill="none"
                                        dot={false}
                                        activeDot={{
                                            r: 4,
                                            fill: '#6366F1',
                                            strokeWidth: 2,
                                            stroke: '#11151C',
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* SPENDING */}
                    <div
                        className="
                            min-w-0
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            dark:border-white/[0.07]
                            dark:bg-[#11151C]
                        "
                    >
                        <div
                            className="
                                border-b
                                border-slate-200
                                p-4
                                dark:border-white/[0.06]
                                sm:p-5
                            "
                        >
                            <SectionHeader
                                icon={PieIcon}
                                title="Spending"
                                description="Top expense categories"
                            />
                        </div>

                        <div
                            className="
                                flex
                                min-w-0
                                min-h-[235px]
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                overflow-hidden
                                p-3
                                sm:min-h-[320px]
                                sm:flex-row
                                sm:gap-5
                                sm:p-5
                            "
                        >
                            {categoryData.length > 0 ? (
                                <>
                                    {/* DONUT */}
                                    <div
                                        className="
                                            relative
                                            h-[125px]
                                            w-[125px]
                                            shrink-0
                                            sm:h-[170px]
                                            sm:w-[170px]
                                        "
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        categoryData
                                                    }
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="58%"
                                                    outerRadius="82%"
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
                                                                key={
                                                                    entry.name
                                                                }
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
                                                    formatter={(
                                                        value
                                                    ) =>
                                                        formatAmount(
                                                            value
                                                        )
                                                    }
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-0
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <span className="text-[8px] uppercase tracking-wider text-slate-400">
                                                Total
                                            </span>

                                            <span
                                                className="
                                                    mt-0.5
                                                    max-w-[75px]
                                                    truncate
                                                    text-[10px]
                                                    font-bold
                                                    sm:max-w-[90px]
                                                    sm:text-xs
                                                "
                                            >
                                                {formatAmount(
                                                    categoryTotal
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CATEGORY LIST */}
                                    <div
                                        className="
                                            min-w-0
                                            w-full
                                            flex-1
                                            space-y-3
                                            sm:w-auto
                                        "
                                    >
                                        {categoryData.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const percentage =
                                                    categoryTotal >
                                                        0
                                                        ? Math.round(
                                                            (item.value /
                                                                categoryTotal) *
                                                            100
                                                        )
                                                        : 0;

                                                return (
                                                    <div
                                                        key={
                                                            item.name
                                                        }
                                                        className={clsx(
                                                            'min-w-0',
                                                            index >=
                                                            4 &&
                                                            'hidden sm:block'
                                                        )}
                                                    >
                                                        <div className="mb-1 flex items-center justify-between gap-2">
                                                            <div className="flex min-w-0 items-center gap-1.5">
                                                                <span
                                                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            CHART_COLORS[
                                                                            index %
                                                                            CHART_COLORS.length
                                                                            ],
                                                                    }}
                                                                />

                                                                <span className="truncate text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                                                    {
                                                                        item.name
                                                                    }
                                                                </span>
                                                            </div>

                                                            <span className="shrink-0 text-[9px] font-bold text-slate-500">
                                                                {
                                                                    percentage
                                                                }
                                                                %
                                                            </span>
                                                        </div>

                                                        <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                                                            <div
                                                                className="h-full rounded-full"
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
                                <div className="w-full text-center text-xs text-slate-400">
                                    No spending data yet.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* =================================================
                    RECENT TRANSACTIONS
                ================================================= */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        dark:border-white/[0.07]
                        dark:bg-[#11151C]
                    "
                >
                    <div
                        className="
                            border-b
                            border-slate-200
                            p-4
                            dark:border-white/[0.06]
                            sm:p-5
                        "
                    >
                        <SectionHeader
                            icon={History}
                            title="Recent transactions"
                            description="Latest financial activity"
                            action={
                                <Link
                                    to="/transactions"
                                    className="
                                        flex
                                        h-8
                                        items-center
                                        gap-1
                                        rounded-lg
                                        bg-slate-100
                                        px-2.5
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-600
                                        dark:bg-white/[0.05]
                                        dark:text-slate-300
                                    "
                                >
                                    <span className="hidden sm:inline">
                                        View all
                                    </span>

                                    <ArrowUpRight size={13} />
                                </Link>
                            }
                        />
                    </div>

                    {loading ? (
                        <div className="px-5 py-12 text-center">
                            <div
                                className="
                                    mx-auto
                                    mb-3
                                    h-5
                                    w-5
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-slate-200
                                    border-t-indigo-500
                                    dark:border-white/10
                                    dark:border-t-indigo-400
                                "
                            />

                            <p className="text-xs text-slate-400">
                                Loading transactions...
                            </p>
                        </div>
                    ) : recentTransactions.length ===
                        0 ? (
                        <div className="px-5 py-12 text-center">
                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-slate-100
                                    text-slate-400
                                    dark:bg-white/[0.05]
                                "
                            >
                                <History size={18} />
                            </div>

                            <p className="mt-3 text-sm font-semibold">
                                No transactions yet
                            </p>

                            <button
                                onClick={() =>
                                    setIsModalOpen(
                                        true
                                    )
                                }
                                className="
                                    mt-3
                                    text-xs
                                    font-semibold
                                    text-indigo-600
                                    underline
                                    underline-offset-4
                                    dark:text-indigo-400
                                "
                            >
                                Add transaction
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* =================================================
                                MOBILE TRANSACTIONS
                            ================================================= */}

                            <div
                                className="
                                    divide-y
                                    divide-slate-100
                                    dark:divide-white/[0.05]
                                    sm:hidden
                                "
                            >
                                {recentTransactions.map(
                                    (transaction) => {
                                        const isIncome =
                                            transaction.type ===
                                            'income';

                                        return (
                                            <div
                                                key={
                                                    transaction.id
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div
                                                        className={clsx(
                                                            `
                                                                flex
                                                                h-8
                                                                w-8
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-[10px]
                                                                font-bold
                                                            `,
                                                            isIncome
                                                                ? `
                                                                    bg-emerald-50
                                                                    text-emerald-600
                                                                    dark:bg-emerald-500/10
                                                                    dark:text-emerald-400
                                                                `
                                                                : `
                                                                    bg-indigo-50
                                                                    text-indigo-600
                                                                    dark:bg-indigo-500/10
                                                                    dark:text-indigo-400
                                                                `
                                                        )}
                                                    >
                                                        {transaction
                                                            .category?.[0]
                                                            ?.toUpperCase() ||
                                                            'T'}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                            {transaction.description ||
                                                                'Untitled'}
                                                        </p>

                                                        <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                                            {transaction.category ||
                                                                'Other'}
                                                            {' · '}
                                                            {transaction.date
                                                                ? new Date(
                                                                    transaction.date
                                                                ).toLocaleDateString()
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={clsx(
                                                        'shrink-0 text-xs font-bold',
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
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full min-w-[500px] text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-white/[0.05]">
                                            <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                Transaction
                                            </th>

                                            <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                                        {recentTransactions.map(
                                            (
                                                transaction
                                            ) => {
                                                const isIncome =
                                                    transaction.type ===
                                                    'income';

                                                return (
                                                    <tr
                                                        key={
                                                            transaction.id
                                                        }
                                                        className="
                                                            transition-colors
                                                            hover:bg-slate-50
                                                            dark:hover:bg-white/[0.025]
                                                        "
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={clsx(
                                                                        `
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                            text-xs
                                                                            font-bold
                                                                        `,
                                                                        isIncome
                                                                            ? `
                                                                                bg-emerald-50
                                                                                text-emerald-600
                                                                                dark:bg-emerald-500/10
                                                                                dark:text-emerald-400
                                                                            `
                                                                            : `
                                                                                bg-indigo-50
                                                                                text-indigo-600
                                                                                dark:bg-indigo-500/10
                                                                                dark:text-indigo-400
                                                                            `
                                                                    )}
                                                                >
                                                                    {transaction
                                                                        .category?.[0]
                                                                        ?.toUpperCase() ||
                                                                        'T'}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-semibold">
                                                                        {transaction.description ||
                                                                            'Untitled'}
                                                                    </p>

                                                                    <p className="mt-1 text-[9px] text-slate-400">
                                                                        {transaction.category ||
                                                                            'Other'}
                                                                        {' · '}
                                                                        {transaction.date
                                                                            ? new Date(
                                                                                transaction.date
                                                                            ).toLocaleDateString()
                                                                            : 'N/A'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4 text-right">
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
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </div>

            {/* =================================================
                ADD TRANSACTION MODAL
            ================================================= */}

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
            />
        </div>
    );
};

export default Dashboard;