import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    ChevronDown,
    PieChart as PieChartIcon,
    WalletCards,
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import useAuthStore from "../context/authStore";
import useTransactionStore from "../context/transactionStore";
import useCurrencyStore from "../context/currencyStore";


const CHART_COLORS = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#14B8A6",
    "#3B82F6",
    "#10B981",
    "#F43F5E",
];




const getDate = (transaction) => {
    if (!transaction?.date) return null;

    if (typeof transaction.date?.toDate === "function") {
        return transaction.date.toDate();
    }

    const date = new Date(transaction.date);

    return Number.isNaN(date.getTime()) ? null : date;
};


const shortDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};



function ChartTooltip({ active, payload, label, formatAmount }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md dark:border-white/[0.08] dark:bg-[#151A22]">
            {label && (
                <p className="mb-1 text-[10px] text-slate-400">
                    {label}
                </p>
            )}

            {payload.map((item, index) => (
                <div
                    key={`${item.dataKey}-${index}`}
                    className="flex items-center gap-2"
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                            backgroundColor:
                                item.color || CHART_COLORS[index],
                        }}
                    />

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.name}
                    </span>

                    <span className="ml-auto pl-4 text-xs font-semibold text-slate-900 dark:text-white">
                        {formatAmount(item.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}




export default function Analytics() {
    const { currentUser } = useAuthStore();

    const {
        transactions,
        fetchTransactions,
        loading,
    } = useTransactionStore();

    const { formatAmount } = useCurrencyStore();

    const [range, setRange] = useState("30");
    const [rangeOpen, setRangeOpen] = useState(false);

    useEffect(() => {
        if (currentUser?.uid) {
            fetchTransactions(currentUser.uid);
        }
    }, [currentUser?.uid, fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        if (!transactions?.length) return [];

        if (range === "all") {
            return transactions;
        }

        const days = Number(range);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - days + 1);

        return transactions.filter((transaction) => {
            const date = getDate(transaction);

            return date && date >= start && date <= end;
        });
    }, [transactions, range]);

    const { totalIncome, totalExpense } = useMemo(() => {
        return filteredTransactions.reduce(
            (result, transaction) => {
                const amount = Number(transaction?.amount) || 0;
                const type = String(transaction?.type || "").toLowerCase();

                if (type === "income") {
                    result.totalIncome += amount;
                }

                if (type === "expense") {
                    result.totalExpense += amount;
                }

                return result;
            },
            {
                totalIncome: 0,
                totalExpense: 0,
            }
        );
    }, [filteredTransactions]);


    const netSaving = totalIncome - totalExpense;

    const savingsRate =
        totalIncome > 0
            ? Math.round((netSaving / totalIncome) * 100)
            : 0;

    const categoryData = useMemo(() => {
        const categories = {};

        filteredTransactions.forEach((transaction) => {
            const type = String(transaction?.type || "").toLowerCase();

            if (type !== "expense") return;

            const category =
                transaction?.category?.trim() || "Other";

            const amount = Number(transaction?.amount) || 0;

            categories[category] =
                (categories[category] || 0) + amount;
        });

        return Object.entries(categories)
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [filteredTransactions]);

    const trendData = useMemo(() => {
        const grouped = {};

        filteredTransactions.forEach((transaction) => {
            const date = getDate(transaction);

            if (!date) return;

            const key = date.toISOString().split("T")[0];

            if (!grouped[key]) {
                grouped[key] = {
                    date,
                    income: 0,
                    expense: 0,
                };
            }

            const amount = Number(transaction?.amount) || 0;
            const type = String(transaction?.type || "").toLowerCase();

            if (type === "income") {
                grouped[key].income += amount;
            }

            if (type === "expense") {
                grouped[key].expense += amount;
            }
        });

        return Object.values(grouped)
            .sort((a, b) => a.date - b.date)
            .map((item) => ({
                ...item,
                label: shortDate(item.date),
            }));
    }, [filteredTransactions]);

    const rangeLabel = {
        7: "7 days",
        30: "30 days",
        90: "90 days",
        all: "All time",
    }[range];

    if (loading) {
        return (
            <div className="min-h-full bg-[#F6F7F9] px-3 py-4 dark:bg-[#080B10] sm:px-6 sm:py-6">
                <div className="mx-auto max-w-[1500px] animate-pulse space-y-4">
                    <div className="h-16 rounded-2xl bg-white dark:bg-[#11151C]" />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="h-24 rounded-2xl bg-white dark:bg-[#11151C]" />
                        <div className="h-24 rounded-2xl bg-white dark:bg-[#11151C]" />
                        <div className="h-24 rounded-2xl bg-white dark:bg-[#11151C]" />
                    </div>

                    <div className="h-[320px] rounded-2xl bg-white dark:bg-[#11151C]" />
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-full overflow-x-hidden bg-[#F6F7F9] text-slate-900 dark:bg-[#080B10] dark:text-slate-100">

            <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">


                <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">

                    <div className="min-w-0">

                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Analytics
                            </span>
                        </div>

                        <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Financial overview
                        </h1>

                        <p className="mt-1 hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                            Understand your spending and savings.
                        </p>

                    </div>


                    {/* Range */}
                    <div className="relative shrink-0">

                        <button
                            type="button"
                            onClick={() =>
                                setRangeOpen((value) => !value)
                            }
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/[0.07] dark:bg-[#11151C] dark:text-slate-300 dark:hover:bg-white/[0.04] sm:px-3.5 sm:text-sm"
                        >
                            <CalendarDays
                                size={15}
                                className="text-indigo-500"
                            />

                            <span>{rangeLabel}</span>

                            <ChevronDown
                                size={14}
                                className={`transition-transform ${rangeOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>


                        {rangeOpen && (
                            <div className="absolute right-0 top-full z-40 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-white/[0.08] dark:bg-[#151A22]">

                                {[
                                    ["7", "7 days"],
                                    ["30", "30 days"],
                                    ["90", "90 days"],
                                    ["all", "All time"],
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setRange(value);
                                            setRangeOpen(false);
                                        }}
                                        className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition ${range === value
                                            ? "bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                </header>


                <section className="mb-4">

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">

                        {/* Income */}
                        <SummaryCard
                            icon={ArrowDownLeft}
                            label="Income"
                            value={formatAmount(totalIncome)}
                            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        />

                        {/* Expense */}
                        <SummaryCard
                            icon={ArrowUpRight}
                            label="Expense"
                            value={formatAmount(totalExpense)}
                            iconClass="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        />

                        {/* Saving */}
                        <SummaryCard
                            icon={WalletCards}
                            label="Net saving"
                            value={formatAmount(netSaving)}
                            valueClass={
                                netSaving < 0
                                    ? "text-rose-600 dark:text-rose-400"
                                    : ""
                            }
                            iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                        />

                    </div>

                </section>


                <section className="mb-4 hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C] md:block">

                    <div className="flex items-center gap-5 p-5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Activity size={18} />
                        </div>

                        <div className="w-28 shrink-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Savings rate
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {savingsRate}%
                            </p>
                        </div>

                        <div className="flex-1">

                            <div className="mb-2 flex justify-between text-xs">
                                <span className="text-slate-400">
                                    Income retained
                                </span>

                                <span className="font-medium text-indigo-500">
                                    {savingsRate}%
                                </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                                <div
                                    className={`h-full rounded-full ${savingsRate < 0
                                        ? "bg-rose-500"
                                        : "bg-indigo-500"
                                        }`}
                                    style={{
                                        width: `${Math.min(
                                            Math.max(savingsRate, 0),
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>

                        </div>

                    </div>

                </section>


                <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.06] sm:px-5 sm:py-4">

                        <div className="flex min-w-0 items-center gap-2.5">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                                <BarChart3 size={15} />
                            </div>

                            <div className="min-w-0">

                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Income & expense
                                </h2>

                                <p className="hidden text-xs text-slate-400 sm:block">
                                    Your cash flow over time
                                </p>

                            </div>

                        </div>

                        <span className="text-[10px] text-slate-400">
                            {rangeLabel}
                        </span>

                    </div>


                    <div className="h-[260px] w-full min-w-0 px-1 py-3 sm:h-[330px] sm:p-5">

                        {trendData.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <AreaChart
                                    data={trendData}
                                    margin={{
                                        top: 10,
                                        right: 5,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >

                                    <defs>

                                        <linearGradient
                                            id="incomeFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10B981"
                                                stopOpacity={0.12}
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#10B981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>


                                        <linearGradient
                                            id="expenseFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#F43F5E"
                                                stopOpacity={0.10}
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#F43F5E"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>

                                    </defs>


                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#94A3B8"
                                        strokeOpacity={0.1}
                                    />


                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: 9,
                                        }}
                                        interval="preserveStartEnd"
                                        minTickGap={25}
                                    />


                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: 9,
                                        }}
                                        tickFormatter={(value) =>
                                            formatAmount(value)
                                        }
                                        width={45}
                                    />


                                    <Tooltip
                                        cursor={{
                                            fill: "rgba(148, 163, 184, 0.035)",
                                        }}
                                        content={
                                            <ChartTooltip
                                                formatAmount={formatAmount}
                                            />
                                        }
                                    />


                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        name="Income"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        fill="url(#incomeFill)"
                                        dot={false}
                                        activeDot={{
                                            r: 3,
                                            strokeWidth: 0,
                                        }}
                                    />


                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        name="Expense"
                                        stroke="#F43F5E"
                                        strokeWidth={2}
                                        fill="url(#expenseFill)"
                                        dot={false}
                                        activeDot={{
                                            r: 3,
                                            strokeWidth: 0,
                                        }}
                                    />

                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState message="No data for this period" />
                        )}

                    </div>


                    <div className="flex gap-5 border-t border-slate-100 px-4 py-3 dark:border-white/[0.06] sm:px-5">

                        <Legend
                            color="#10B981"
                            label="Income"
                        />

                        <Legend
                            color="#F43F5E"
                            label="Expense"
                        />

                    </div>

                </section>


                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.06] sm:px-5">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                                <PieChartIcon size={15} />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Expense breakdown
                                </h2>

                                <p className="hidden text-xs text-slate-400 sm:block">
                                    Your biggest spending categories
                                </p>
                            </div>

                        </div>


                        <div className="p-4 sm:p-5">

                            {categoryData.length > 0 ? (

                                <div className="flex items-center gap-4">

                                    <div className="h-[180px] w-[180px] shrink-0 sm:h-[220px] sm:w-[220px]">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>

                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="60%"
                                                    outerRadius="78%"
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    stroke="none"
                                                >

                                                    {categoryData.map(
                                                        (category, index) => (
                                                            <Cell
                                                                key={category.name}
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
                                                    content={
                                                        <ChartTooltip
                                                            formatAmount={formatAmount}
                                                        />
                                                    }
                                                />

                                            </PieChart>
                                        </ResponsiveContainer>

                                    </div>


                                    <div className="min-w-0 flex-1 space-y-2.5">

                                        {categoryData.map(
                                            (category, index) => {
                                                const percentage =
                                                    totalExpense > 0
                                                        ? (category.value /
                                                            totalExpense) *
                                                        100
                                                        : 0;

                                                return (
                                                    <div
                                                        key={category.name}
                                                        className="min-w-0"
                                                    >

                                                        <div className="flex items-center justify-between gap-2">

                                                            <div className="flex min-w-0 items-center gap-2">

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

                                                                <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">
                                                                    {category.name}
                                                                </span>

                                                            </div>

                                                            <span className="shrink-0 text-[10px] text-slate-400">
                                                                {Math.round(
                                                                    percentage
                                                                )}%
                                                            </span>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            ) : (
                                <EmptyState message="No expense data" />
                            )}

                        </div>

                    </section>


                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.06] sm:px-5">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                                <Activity size={15} />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    At a glance
                                </h2>

                                <p className="hidden text-xs text-slate-400 sm:block">
                                    A quick look at your finances
                                </p>
                            </div>

                        </div>


                        <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">

                            <MiniStat
                                label="Savings rate"
                                value={`${savingsRate}%`}
                            />

                            <MiniStat
                                label="Transactions"
                                value={filteredTransactions.length}
                            />

                            <MiniStat
                                label="Top category"
                                value={
                                    categoryData[0]?.name || "No data"
                                }
                            />

                            <MiniStat
                                label="Top category spending"
                                value={
                                    categoryData[0]
                                        ? formatAmount(
                                            categoryData[0].value
                                        )
                                        : formatAmount(0)
                                }
                            />

                        </div>

                    </section>

                </div>



                {!filteredTransactions.length && (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center dark:border-white/[0.1] dark:bg-[#11151C]">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500">
                            <BarChart3 size={18} />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                            No transactions found
                        </p>

                        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                            Add transactions to start seeing your financial analytics.
                        </p>

                    </div>
                )}

            </div>
        </div>
    );
}


function SummaryCard({
    icon: Icon,
    label,
    value,
    iconClass,
    valueClass = "",
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.07] dark:bg-[#11151C] sm:p-5">

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={17} />
                </div>

                <div className="min-w-0">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        {label}
                    </p>

                    <p
                        className={`mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl ${valueClass}`}
                    >
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}



function MiniStat({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">

            <span className="text-xs text-slate-500 dark:text-slate-400">
                {label}
            </span>

            <span className="max-w-[55%] truncate text-xs font-semibold text-slate-900 dark:text-white">
                {value}
            </span>

        </div>
    );
}


function Legend({ color, label }) {
    return (
        <div className="flex items-center gap-2">

            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
            />

            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {label}
            </span>

        </div>
    );
}



function EmptyState({ message }) {
    return (
        <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500">
                <BarChart3 size={16} />
            </div>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {message}
            </p>

        </div>
    );
}