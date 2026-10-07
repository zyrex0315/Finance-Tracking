import { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Trash2,
    AlertCircle,
    ReceiptText,
    CalendarDays,
    X,
} from 'lucide-react';

import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';
import AddTransactionModal from '../components/Modals/AddTransactionModal';

import clsx from 'clsx';

const Transactions = () => {
    const {
        transactions,
        fetchTransactions,
        loading,
        error,
        deleteTransaction,
    } = useTransactionStore();

    const { currentUser } = useAuthStore();
    const { formatAmount } = useCurrencyStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        }
    }, [fetchTransactions, currentUser]);

    const handleDelete = async (id) => {
        if (
            window.confirm(
                'Are you sure you want to delete this transaction?'
            )
        ) {
            await deleteTransaction(id);
        }
    };

    /*
     * Normalize transaction type so filters work even if
     * Firestore contains "Income", "INCOME", "income", etc.
     */
    const normalizeType = (type) =>
        String(type || '').trim().toLowerCase();

    const filteredTransactions = transactions.filter((transaction) => {
        const description =
            String(transaction.description || '').toLowerCase();

        const category =
            String(transaction.category || '').toLowerCase();

        const search =
            searchTerm.trim().toLowerCase();

        const transactionType =
            normalizeType(transaction.type);

        const matchesSearch =
            !search ||
            description.includes(search) ||
            category.includes(search);

        const matchesType =
            filterType === 'all' ||
            transactionType === normalizeType(filterType);

        return matchesSearch && matchesType;
    });

    const totalIncome = transactions
        .filter(
            (transaction) =>
                normalizeType(transaction.type) === 'income'
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

    const totalExpense = transactions
        .filter(
            (transaction) =>
                normalizeType(transaction.type) === 'expense'
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

    const totalBalance = totalIncome - totalExpense;

    const filterOptions = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Income',
            value: 'income',
        },
        {
            label: 'Expense',
            value: 'expense',
        },
    ];

    return (
        <div className="min-h-full bg-[#F6F7F9] text-slate-900 dark:bg-[#080B10] dark:text-slate-100">
            <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7">

                {/* ================= HEADER ================= */}
                <header className="mb-5 sm:mb-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                        <div className="min-w-0 max-w-full">
                            <div className="mb-2 flex items-center gap-2 sm:mb-3">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />

                                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Financial Records
                                </span>
                            </div>

                            <h1 className="break-words text-2xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                                Transactions
                            </h1>

                            <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:block">
                                Review and manage your financial activity.
                            </p>
                        </div>

                        <div className="flex w-full items-center gap-2 sm:gap-3 lg:w-auto">

                            {/* Date */}
                            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-white/[0.07] dark:bg-[#11151C] sm:flex">
                                <CalendarDays
                                    size={15}
                                    className="text-slate-400"
                                />

                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {new Date().toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            {/* Add transaction */}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="
                                    group flex w-full items-center justify-center gap-2
                                    rounded-xl
                                    bg-slate-950
                                    px-4 py-2.5
                                    text-xs font-bold
                                    text-white
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:bg-indigo-600
                                    dark:bg-white
                                    dark:text-slate-950
                                    dark:hover:bg-indigo-400
                                    sm:w-auto
                                "
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

                {/* ================= SUMMARY ================= */}
                <section className="mb-5 hidden min-w-0 grid-cols-3 gap-3 sm:grid">

                    {/* Balance */}
                    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.07] dark:bg-[#11151C]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Net balance
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <ReceiptText size={15} />
                            </div>
                        </div>

                        <p
                            className={clsx(
                                'mt-3 truncate text-xl font-bold tracking-tight',
                                totalBalance >= 0
                                    ? 'text-slate-950 dark:text-white'
                                    : 'text-rose-500'
                            )}
                        >
                            {formatAmount(totalBalance)}
                        </p>
                    </div>

                    {/* Income */}
                    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.07] dark:bg-[#11151C]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Total income
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <ArrowDownLeft size={15} />
                            </div>
                        </div>

                        <p className="mt-3 truncate text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {formatAmount(totalIncome)}
                        </p>
                    </div>

                    {/* Expense */}
                    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/[0.07] dark:bg-[#11151C]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Total expense
                            </span>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                <ArrowUpRight size={15} />
                            </div>
                        </div>

                        <p className="mt-3 truncate text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            {formatAmount(totalExpense)}
                        </p>
                    </div>
                </section>

                {/* ================= ERROR ================= */}
                {error && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 sm:mb-5 sm:p-4">
                        <AlertCircle
                            size={17}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="min-w-0">
                            <p className="text-xs font-bold">
                                Unable to load transactions
                            </p>

                            <p className="mt-1 text-xs leading-relaxed opacity-80">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* ================= SEARCH + FILTERS ================= */}
                <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-2.5 dark:border-white/[0.07] dark:bg-[#11151C] sm:mb-5 sm:p-3">

                    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search */}
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                placeholder="Search transactions..."
                                className="
                                    h-10 w-full rounded-xl
                                    border border-slate-200
                                    bg-slate-50
                                    pl-9 pr-9
                                    text-xs font-medium
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-indigo-400
                                    focus:bg-white
                                    dark:border-white/[0.07]
                                    dark:bg-[#0B0F14]
                                    dark:text-white
                                    dark:focus:border-indigo-500/50
                                    dark:focus:bg-[#0B0F14]
                                "
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    aria-label="Clear search"
                                    className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/[0.07] dark:hover:text-white"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/[0.06] dark:bg-[#0B0F14] lg:w-auto">
                            {filterOptions.map((filter) => {
                                const isActive =
                                    filterType === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() =>
                                            setFilterType(filter.value)
                                        }
                                        className={clsx(
                                            'flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:flex-none',
                                            isActive
                                                ? 'bg-white text-slate-900 shadow-sm dark:bg-[#1A2029] dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                        )}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result info */}
                    <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-[10px] font-medium text-slate-400">
                            {filteredTransactions.length}{' '}
                            {filteredTransactions.length === 1
                                ? 'transaction'
                                : 'transactions'}
                        </span>

                        {(searchTerm || filterType !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('all');
                                }}
                                className="text-[10px] font-semibold text-indigo-500 transition hover:text-indigo-600 dark:text-indigo-400"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </section>

                {/* ================= TRANSACTION HISTORY ================= */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                    {/* History header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3 dark:border-white/[0.06] sm:px-5 sm:py-4">
                        <div>
                            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                                Transaction history
                            </h2>

                            <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
                                Your recent financial activity
                            </p>
                        </div>

                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
                            {filteredTransactions.length}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 dark:border-white/10 dark:border-t-indigo-400" />
                                Loading transactions...
                            </div>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-slate-500">
                                <ReceiptText size={20} />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
                                No transactions found
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                                {searchTerm || filterType !== 'all'
                                    ? 'Try changing your search or filter.'
                                    : 'Add your first transaction to start tracking your finances.'}
                            </p>

                            {searchTerm || filterType !== 'all' ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType('all');
                                    }}
                                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400"
                                >
                                    Clear filters
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400"
                                >
                                    Add transaction
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* ================= MOBILE LIST ================= */}
                            <div className="divide-y divide-slate-100 dark:divide-white/[0.05] md:hidden">
                                {filteredTransactions.map((transaction) => {
                                    const isIncome =
                                        normalizeType(transaction.type) ===
                                        'income';

                                    return (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                                        >
                                            {/* Icon */}
                                            <div
                                                className={clsx(
                                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                                                    isIncome
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                                )}
                                            >
                                                {isIncome ? (
                                                    <ArrowDownLeft size={16} />
                                                ) : (
                                                    <ArrowUpRight size={16} />
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                    {transaction.description ||
                                                        'Untitled transaction'}
                                                </p>

                                                <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                                                    <span className="truncate text-[10px] text-slate-400">
                                                        {transaction.category ||
                                                            'Uncategorized'}
                                                    </span>

                                                    {transaction.date && (
                                                        <>
                                                            <span className="text-slate-300 dark:text-slate-700">
                                                                •
                                                            </span>

                                                            <span className="shrink-0 text-[10px] text-slate-400">
                                                                {new Date(
                                                                    transaction.date
                                                                ).toLocaleDateString(
                                                                    undefined,
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    }
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="shrink-0 text-right">
                                                <p
                                                    className={clsx(
                                                        'text-xs font-bold',
                                                        isIncome
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-rose-600 dark:text-rose-400'
                                                    )}
                                                >
                                                    {isIncome ? '+' : '-'}
                                                    {formatAmount(
                                                        Math.abs(
                                                            Number(
                                                                transaction.amount
                                                            ) || 0
                                                        )
                                                    )}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            transaction.id
                                                        )
                                                    }
                                                    aria-label="Delete transaction"
                                                    className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ================= DESKTOP TABLE ================= */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[720px]">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                                            <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Transaction
                                            </th>

                                            <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Category
                                            </th>

                                            <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Date
                                            </th>

                                            <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Amount
                                            </th>

                                            <th className="w-16 px-5 py-3" />
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                                        {filteredTransactions.map(
                                            (transaction) => {
                                                const isIncome =
                                                    normalizeType(
                                                        transaction.type
                                                    ) === 'income';

                                                return (
                                                    <tr
                                                        key={transaction.id}
                                                        className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        {/* Transaction */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={clsx(
                                                                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                                                                        isIncome
                                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                                                    )}
                                                                >
                                                                    {isIncome ? (
                                                                        <ArrowDownLeft
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <ArrowUpRight
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                        {transaction.description ||
                                                                            'Untitled transaction'}
                                                                    </p>

                                                                    <p
                                                                        className={clsx(
                                                                            'mt-0.5 text-[10px] font-medium capitalize',
                                                                            isIncome
                                                                                ? 'text-emerald-500'
                                                                                : 'text-rose-500'
                                                                        )}
                                                                    >
                                                                        {isIncome
                                                                            ? 'Income'
                                                                            : 'Expense'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Category */}
                                                        <td className="px-5 py-4">
                                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
                                                                {transaction.category ||
                                                                    'Uncategorized'}
                                                            </span>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="px-5 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            {transaction.date
                                                                ? new Date(
                                                                    transaction.date
                                                                ).toLocaleDateString(
                                                                    undefined,
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                    }
                                                                )
                                                                : '—'}
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="px-5 py-4 text-right">
                                                            <span
                                                                className={clsx(
                                                                    'text-sm font-bold',
                                                                    isIncome
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-rose-600 dark:text-rose-400'
                                                                )}
                                                            >
                                                                {isIncome
                                                                    ? '+'
                                                                    : '-'}
                                                                {formatAmount(
                                                                    Math.abs(
                                                                        Number(
                                                                            transaction.amount
                                                                        ) || 0
                                                                    )
                                                                )}
                                                            </span>
                                                        </td>

                                                        {/* Delete */}
                                                        <td className="px-5 py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        transaction.id
                                                                    )
                                                                }
                                                                aria-label="Delete transaction"
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
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

            {/* ================= ADD TRANSACTION MODAL ================= */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Transactions;