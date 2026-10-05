import { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Trash2,
    AlertCircle,
    ReceiptText,
    SlidersHorizontal,
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



    const filteredTransactions = transactions.filter((transaction) => {
        const description =
            transaction.description?.toLowerCase() || '';

        const category =
            transaction.category?.toLowerCase() || '';

        const search =
            searchTerm.toLowerCase().trim();

        const matchesSearch =
            description.includes(search) ||
            category.includes(search);

        const matchesType =
            filterType === 'all' ||
            transaction.type === filterType;

        return matchesSearch && matchesType;
    });



    const totalIncome = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

    const totalExpense = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );



    return (
        <div className="min-h-full bg-[#F6F7F9] text-slate-900 dark:bg-[#080B10] dark:text-slate-100">

            <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">



                <header className="mb-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div className="min-w-0 max-w-full">

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />

                                <span className="truncate text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                    Financial Records
                                </span>

                            </div>

                            <h1 className="break-words text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                                Transactions
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Review and manage your financial activity.
                            </p>

                        </div>


                        <div className="flex items-center gap-3">

                            {/* Date */}
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

                            {/* Add */}
                            <button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className="
                                    group
                                    flex items-center justify-center gap-2
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

                                    w-full
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



                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {/* Total records */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="flex items-start justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
                                <ReceiptText
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Records
                            </span>

                        </div>

                        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Total transactions
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            {transactions.length}
                        </p>

                    </div>

                    {/* Income */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="flex items-start justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <ArrowUpRight
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                Income
                            </span>

                        </div>

                        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Total income
                        </p>

                        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {formatAmount(totalIncome)}
                        </p>

                    </div>

                    {/* Expenses */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#11151C]">

                        <div className="flex items-start justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                <ArrowDownLeft
                                    size={17}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                Expense
                            </span>

                        </div>

                        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Total expenses
                        </p>

                        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                            {formatAmount(totalExpense)}
                        </p>

                    </div>

                </section>



                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/10 dark:bg-rose-500/[0.04]">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            <AlertCircle size={16} />
                        </div>

                        <div>
                            <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                                Unable to load transactions
                            </p>

                            <p className="mt-0.5 text-[10px] text-rose-600/70 dark:text-rose-400/70">
                                {error}
                            </p>
                        </div>

                    </div>
                )}


                <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/[0.07] dark:bg-[#11151C]">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search */}
                        <div className="relative w-full lg:max-w-[480px]">

                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search transactions or categories..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-200
                                    bg-slate-50
                                    py-3 pl-10 pr-10
                                    text-sm font-medium
                                    text-slate-900
                                    outline-none
                                    transition-all

                                    placeholder:text-slate-400

                                    focus:border-slate-400
                                    focus:bg-white

                                    dark:border-white/[0.07]
                                    dark:bg-[#0C1016]
                                    dark:text-white
                                    dark:placeholder:text-slate-600
                                    dark:focus:border-white/20
                                    dark:focus:bg-[#0C1016]
                                "
                            />

                            {searchTerm && (
                                <button
                                    onClick={() =>
                                        setSearchTerm('')
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}

                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">



                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/[0.07] dark:bg-[#0C1016]">

                                {['all', 'income', 'expense'].map(
                                    (type) => (
                                        <button
                                            key={type}
                                            onClick={() =>
                                                setFilterType(type)
                                            }
                                            className={clsx(
                                                'rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all',
                                                filterType === type
                                                    ? type === 'income'
                                                        ? 'bg-white text-emerald-600 shadow-sm dark:bg-[#11151C] dark:text-emerald-400'
                                                        : type === 'expense'
                                                            ? 'bg-white text-rose-600 shadow-sm dark:bg-[#11151C] dark:text-rose-400'
                                                            : 'bg-white text-slate-900 shadow-sm dark:bg-[#11151C] dark:text-white'
                                                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            )}
                                        >
                                            {type}
                                        </button>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Active result information */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 px-1 pt-3 dark:border-white/[0.05]">

                        <p className="text-[10px] font-medium text-slate-400">
                            Showing{' '}
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                                {filteredTransactions.length}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                                {transactions.length}
                            </span>{' '}
                            transactions
                        </p>

                        {(searchTerm || filterType !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('all');
                                }}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Clear filters
                            </button>
                        )}

                    </div>

                </section>


                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#11151C]">

                    {/* Section header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-300">
                                <ReceiptText
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Transaction history
                                </h2>

                                <p className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                                    Your complete financial activity
                                </p>
                            </div>

                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
                            {filteredTransactions.length} records
                        </span>

                    </div>



                    {loading ? (
                        <div className="flex flex-col items-center justify-center px-5 py-20">

                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 dark:border-white/10 dark:border-t-indigo-400" />

                            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                Loading transactions
                            </p>

                        </div>
                    ) : filteredTransactions.length === 0 ? (



                        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-slate-500">
                                <ReceiptText size={22} />
                            </div>

                            <h3 className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-200">
                                No transactions found
                            </h3>

                            <p className="mt-1 max-w-[300px] text-xs leading-relaxed text-slate-400">
                                {searchTerm || filterType !== 'all'
                                    ? 'Try changing your search or filter settings.'
                                    : 'Add your first transaction to start tracking your finances.'}
                            </p>

                            {searchTerm || filterType !== 'all' ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType('all');
                                    }}
                                    className="mt-5 text-xs font-bold text-indigo-600 underline underline-offset-4 dark:text-indigo-400"
                                >
                                    Clear filters
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        setIsModalOpen(true)
                                    }
                                    className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400"
                                >
                                    <Plus size={14} />
                                    Add transaction
                                </button>
                            )}

                        </div>
                    ) : (
                        <>

                            <div className="divide-y divide-slate-100 dark:divide-white/[0.05] md:hidden">

                                {filteredTransactions.map((transaction) => {

                                    const isIncome =
                                        transaction.type === 'income';

                                    return (
                                        <div
                                            key={transaction.id}
                                            className="group flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.025]"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div
                                                    className={clsx(
                                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                                        isIncome
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                                    )}
                                                >
                                                    {isIncome ? (
                                                        <ArrowUpRight size={16} />
                                                    ) : (
                                                        <ArrowDownLeft size={16} />
                                                    )}
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                        {transaction.description ||
                                                            'Unnamed transaction'}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-1.5">

                                                        <span className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                            {transaction.category}
                                                        </span>

                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700" />

                                                        <span className="shrink-0 text-[9px] text-slate-400">
                                                            {transaction.date
                                                                ? new Date(
                                                                    transaction.date
                                                                ).toLocaleDateString(
                                                                    undefined,
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                    }
                                                                )
                                                                : 'N/A'}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">

                                                <span
                                                    className={clsx(
                                                        'text-xs font-bold tracking-tight',
                                                        isIncome
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-slate-900 dark:text-white'
                                                    )}
                                                >
                                                    {isIncome ? '+' : '-'}
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            transaction.id
                                                        )
                                                    }
                                                    aria-label="Delete transaction"
                                                    className="
                                                        flex h-8 w-8 items-center justify-center
                                                        rounded-lg
                                                        bg-slate-100
                                                        text-slate-400
                                                        transition-colors

                                                        hover:bg-rose-50
                                                        hover:text-rose-600

                                                        dark:bg-white/[0.05]
                                                        dark:hover:bg-rose-500/10
                                                        dark:hover:text-rose-400
                                                    "
                                                >
                                                    <Trash2 size={13} />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>



                            <div className="hidden overflow-x-auto md:block">

                                <table className="w-full min-w-[720px] text-left">

                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-white/[0.05] dark:bg-white/[0.015]">

                                            <th className="px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Date
                                            </th>

                                            <th className="px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Transaction
                                            </th>

                                            <th className="px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Category
                                            </th>

                                            <th className="px-6 py-3.5 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Amount
                                            </th>

                                            <th className="px-6 py-3.5 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">

                                        {filteredTransactions.map(
                                            (transaction) => {

                                                const isIncome =
                                                    transaction.type ===
                                                    'income';

                                                return (
                                                    <tr
                                                        key={transaction.id}
                                                        className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.025]"
                                                    >

                                                        {/* Date */}
                                                        <td className="whitespace-nowrap px-6 py-5">

                                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
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
                                                                    : 'N/A'}
                                                            </span>

                                                        </td>

                                                        {/* Transaction */}
                                                        <td className="px-6 py-5">

                                                            <div className="flex items-center gap-3">

                                                                <div
                                                                    className={clsx(
                                                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
                                                                        isIncome
                                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                                                    )}
                                                                >
                                                                    {isIncome ? (
                                                                        <ArrowUpRight
                                                                            size={17}
                                                                        />
                                                                    ) : (
                                                                        <ArrowDownLeft
                                                                            size={17}
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                                                        {transaction.description ||
                                                                            'Unnamed transaction'}
                                                                    </p>

                                                                    <p
                                                                        className={clsx(
                                                                            'mt-0.5 text-[9px] font-bold uppercase tracking-wider',
                                                                            isIncome
                                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                                : 'text-rose-500 dark:text-rose-400'
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
                                                        <td className="whitespace-nowrap px-6 py-5">

                                                            <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-slate-400">
                                                                {transaction.category}
                                                            </span>

                                                        </td>

                                                        {/* Amount */}
                                                        <td
                                                            className={clsx(
                                                                'whitespace-nowrap px-6 py-5 text-right text-sm font-bold tracking-tight',
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
                                                        </td>

                                                        {/* Delete */}
                                                        <td className="px-6 py-5 text-center">

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        transaction.id
                                                                    )
                                                                }
                                                                aria-label="Delete transaction"
                                                                className="
                                                                    mx-auto
                                                                    flex h-9 w-9
                                                                    items-center justify-center
                                                                    rounded-lg
                                                                    bg-slate-50
                                                                    text-slate-400
                                                                    transition-all

                                                                    hover:bg-rose-50
                                                                    hover:text-rose-600

                                                                    dark:bg-white/[0.04]
                                                                    dark:hover:bg-rose-500/10
                                                                    dark:hover:text-rose-400
                                                                "
                                                            >
                                                                <Trash2 size={15} />
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



            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
            />


            <button
                onClick={() =>
                    setIsModalOpen(true)
                }
                aria-label="Add transaction"
                className="
                    fixed bottom-6 right-5 z-40
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    bg-slate-950
                    text-white
                    shadow-xl
                    transition-all
                    hover:scale-105
                    hover:bg-indigo-600
                    active:scale-95

                    dark:bg-white
                    dark:text-slate-950
                    dark:hover:bg-indigo-400

                    md:hidden
                "
            >
                <Plus size={21} />
            </button>

        </div>
    );
};

export default Transactions;