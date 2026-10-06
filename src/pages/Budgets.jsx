import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus,
    Target,
    AlertTriangle,
    Trash2,
    Edit2,
    TrendingUp,
    Wallet,
    AlertCircle,
    X,
} from 'lucide-react';
import clsx from 'clsx';

import useBudgetStore from '../context/budgetStore';
import useTransactionStore from '../context/transactionStore';
import useAuthStore from '../context/authStore';
import useCurrencyStore from '../context/currencyStore';


const BudgetCard = ({
    category,
    spent,
    limit,
    onDelete,
    onEdit,
}) => {
    const { formatAmount } = useCurrencyStore();

    const safeLimit = Number(limit) || 0;
    const safeSpent = Number(spent) || 0;

    const percentage =
        safeLimit > 0
            ? Math.min((safeSpent / safeLimit) * 100, 100)
            : 0;

    const isOver = safeSpent > safeLimit;
    const isNear =
        safeSpent > safeLimit * 0.8 && !isOver;

    const remaining = Math.abs(safeLimit - safeSpent);

    return (
        <div
            className="
                group relative overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
                dark:border-white/[0.07]
                dark:bg-[#11151C]
            "
        >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                    <div
                        className={clsx(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                            isOver
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                : isNear
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                        )}
                    >
                        <Target
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div className="min-w-0">

                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {category}
                        </h3>

                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Monthly limit
                        </p>

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">

                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label={`Edit ${category} budget`}
                        className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-500
                            transition-colors
                            hover:bg-slate-200
                            hover:text-slate-900
                            dark:bg-white/[0.06]
                            dark:text-slate-400
                            dark:hover:bg-white/[0.1]
                            dark:hover:text-white
                        "
                    >
                        <Edit2 size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label={`Delete ${category} budget`}
                        className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg
                            bg-rose-50
                            text-rose-500
                            transition-colors
                            hover:bg-rose-500
                            hover:text-white
                            dark:bg-rose-500/10
                        "
                    >
                        <Trash2 size={14} />
                    </button>

                </div>

            </div>

            {/* AMOUNT */}

            <div className="mt-6">

                <div className="flex items-end justify-between gap-3">

                    <div className="min-w-0">

                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Spent
                        </p>

                        <p className="truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            {formatAmount(safeSpent)}
                        </p>

                    </div>

                    <div
                        className={clsx(
                            'shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold',
                            isOver
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                : isNear
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                        )}
                    >
                        {percentage.toFixed(0)}%
                    </div>

                </div>

                <div className="mt-1 text-[10px] text-slate-400">
                    of {formatAmount(safeLimit)}
                </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-5">

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">

                    <div
                        className={clsx(
                            'h-full rounded-full transition-all duration-700',
                            isOver
                                ? 'bg-rose-500'
                                : isNear
                                    ? 'bg-amber-500'
                                    : 'bg-indigo-500'
                        )}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />

                </div>

            </div>

            {/* FOOTER */}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/[0.05]">

                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {isOver
                        ? 'Exceeded by'
                        : 'Remaining'}
                </span>

                <span
                    className={clsx(
                        'text-xs font-bold',
                        isOver
                            ? 'text-rose-500'
                            : 'text-slate-700 dark:text-slate-200'
                    )}
                >
                    {formatAmount(remaining)}
                </span>

            </div>

        </div>
    );
};



const BudgetModal = ({
    isOpen,
    onClose,
    initialData = null,
}) => {
    const { upsertBudget } = useBudgetStore();
    const { getCurrencyInfo } = useCurrencyStore();

    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const currencyInfo = getCurrencyInfo();

    const categories = [
        'Food',
        'Transport',
        'Housing',
        'Utilities',
        'Entertainment',
        'Health',
        'Shopping',
        'Other',
    ];

    useEffect(() => {
        if (initialData) {
            setCategory(initialData.category || '');
            setLimit(initialData.limit || '');
        } else {
            setCategory('');
            setLimit('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!category || !limit) return;

        setIsSaving(true);

        try {
            await upsertBudget({
                category,
                limit: parseFloat(limit),
                period: 'monthly',
            });

            onClose();
        } catch (error) {
            console.error(
                'Failed to save budget:',
                error
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="
                fixed inset-0 z-[9999]
                flex items-end justify-center
                bg-black/50
                p-0
                backdrop-blur-sm
                sm:items-center
                sm:p-4
            "
        >

            <div
                className="
                    flex max-h-[95dvh] w-full
                    max-w-lg
                    flex-col
                    overflow-hidden
                    rounded-t-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    dark:border-white/[0.07]
                    dark:bg-[#11151C]
                    sm:rounded-2xl
                "
            >

                {/* MOBILE HANDLE */}

                <div className="flex justify-center pt-3 sm:hidden">

                    <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-white/10" />

                </div>

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/[0.06] sm:px-6">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <Target size={15} />
                            </div>

                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                {initialData
                                    ? 'Edit budget'
                                    : 'Create budget'}
                            </h2>

                        </div>

                        <p className="mt-1 text-[10px] text-slate-400">
                            Set a monthly spending limit.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex h-8 w-8 items-center
                            justify-center rounded-lg
                            text-slate-400
                            transition-colors
                            hover:bg-slate-100
                            hover:text-slate-700
                            dark:hover:bg-white/[0.06]
                            dark:hover:text-white
                        "
                    >
                        <X size={16} />
                    </button>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >

                    <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">

                        {/* CATEGORY */}

                        <div>

                            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Category
                            </label>

                            <select
                                required
                                disabled={!!initialData}
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-full appearance-none
                                    rounded-xl
                                    border border-slate-200
                                    bg-slate-50
                                    px-4 py-3
                                    text-sm font-medium
                                    text-slate-900
                                    outline-none
                                    transition
                                    focus:border-indigo-400
                                    focus:ring-2
                                    focus:ring-indigo-500/10
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:border-white/[0.07]
                                    dark:bg-white/[0.04]
                                    dark:text-white
                                "
                            >

                                <option value="">
                                    Select category
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}

                            </select>

                        </div>

                        {/* LIMIT */}

                        <div>

                            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Monthly limit ({currencyInfo.symbol})
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                    {currencyInfo.symbol}
                                </span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    value={limit}
                                    onChange={(event) => setLimit(event.target.value)}
                                    placeholder="0.00"
                                    className="
                                         w-full
                                        rounded-xl
                                        border border-slate-200
                                        bg-slate-50
                                        py-3 pl-10 pr-4
                                        text-sm font-bold
                                        text-slate-900
                                        outline-none
                                        transition
                                        focus:border-indigo-400
                                        focus:ring-2
                                        focus:ring-indigo-500/10
                                        dark:border-white/[0.07]
                                        dark:bg-white/[0.04]
                                        dark:text-white

                                        [appearance:textfield]
                                        [&::-webkit-inner-spin-button]:appearance-none
                                        [&::-webkit-outer-spin-button]:appearance-none
                                    "
                                />

                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-3 border-t border-slate-100 p-5 dark:border-white/[0.06] sm:p-6">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1 rounded-xl
                                border border-slate-200
                                bg-white
                                px-4 py-3
                                text-[10px]
                                font-bold uppercase
                                tracking-[0.15em]
                                text-slate-500
                                transition-colors
                                hover:bg-slate-50
                                dark:border-white/[0.07]
                                dark:bg-white/[0.03]
                                dark:text-slate-400
                                dark:hover:bg-white/[0.06]
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="
                                flex-1 rounded-xl
                                bg-slate-900
                                px-4 py-3
                                text-[10px]
                                font-bold uppercase
                                tracking-[0.15em]
                                text-white
                                transition-all
                                hover:bg-slate-800
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:bg-white
                                dark:text-slate-950
                                dark:hover:bg-slate-200
                            "
                        >
                            {isSaving
                                ? 'Saving...'
                                : initialData
                                    ? 'Update budget'
                                    : 'Create budget'}
                        </button>

                    </div>

                </form>

            </div>

        </div>,
        document.body
    );
};



const Budgets = () => {
    const {
        budgets,
        fetchBudgets,
        deleteBudget,
    } = useBudgetStore();

    const {
        transactions,
        fetchTransactions,
    } = useTransactionStore();

    const { currentUser } = useAuthStore();

    const { formatAmount } = useCurrencyStore();

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingBudget, setEditingBudget] =
        useState(null);



    useEffect(() => {
        if (!currentUser) return;

        fetchBudgets();
        fetchTransactions();
    }, [
        currentUser,
        fetchBudgets,
        fetchTransactions,
    ]);



    const categorySpending = useMemo(() => {
        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        return transactions
            .filter((transaction) => {
                if (transaction.type !== 'expense')
                    return false;

                return (
                    new Date(transaction.date) >=
                    startOfMonth
                );
            })
            .reduce((acc, transaction) => {

                const category =
                    transaction.category || 'Other';

                acc[category] =
                    (acc[category] || 0) +
                    Number(transaction.amount || 0);

                return acc;

            }, {});
    }, [transactions]);



    const summary = useMemo(() => {

        const totalLimit = budgets.reduce(
            (sum, budget) =>
                sum + Number(budget.limit || 0),
            0
        );

        const totalSpent = budgets.reduce(
            (sum, budget) =>
                sum +
                Number(
                    categorySpending[budget.category] ||
                    0
                ),
            0
        );

        const activeBudgets = budgets.length;

        const attentionCount = budgets.filter(
            (budget) => {
                const spent =
                    Number(
                        categorySpending[
                        budget.category
                        ] || 0
                    );

                return (
                    spent >=
                    Number(budget.limit || 0) * 0.8
                );
            }
        ).length;

        return {
            totalLimit,
            totalSpent,
            activeBudgets,
            attentionCount,
        };

    }, [budgets, categorySpending]);



    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };



    return (
        <div
            className="
                min-h-full
                bg-[#F6F7F9]
                text-slate-900
                transition-colors duration-300
                dark:bg-[#080B10]
                dark:text-slate-100
            "
        >

            <div
                className="
                    mx-auto
                    max-w-[1500px]
                    px-4 py-5
                    sm:px-6
                    lg:px-8 lg:py-7
                "
            >



                <header className="mb-7">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                    Budget management
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
                                Spending limits.
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Set boundaries for your spending and keep your finances on track.
                            </p>

                        </div>

                        <button
                            onClick={handleCreate}
                            className="
                                group flex
                                w-full items-center
                                justify-center gap-2
                                rounded-xl
                                border border-slate-900
                                bg-slate-900
                                px-4 py-2.5
                                text-xs font-bold
                                text-white
                                shadow-sm
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:bg-slate-800
                                active:translate-y-0
                                dark:border-white
                                dark:bg-white
                                dark:text-slate-950
                                dark:hover:bg-slate-200
                                sm:w-auto
                            "
                        >
                            <Plus
                                size={15}
                                className="transition-transform group-hover:rotate-90"
                            />

                            Add budget
                        </button>

                    </div>

                </header>



                <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    {/* TOTAL LIMIT */}

                    <div
                        className="
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.07]
                            dark:bg-[#11151C]
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <Wallet size={16} />
                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Monthly
                            </span>

                        </div>

                        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Total budget
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            {formatAmount(
                                summary.totalLimit
                            )}
                        </p>

                    </div>

                    {/* SPENT */}

                    <div
                        className="
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.07]
                            dark:bg-[#11151C]
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                <TrendingUp size={16} />
                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Current
                            </span>

                        </div>

                        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Total spent
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            {formatAmount(
                                summary.totalSpent
                            )}
                        </p>

                    </div>

                    {/* ATTENTION */}

                    <div
                        className="
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            dark:border-white/[0.07]
                            dark:bg-[#11151C]
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                <AlertCircle size={16} />
                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Attention
                            </span>

                        </div>

                        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Near limit
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            {summary.attentionCount}
                        </p>

                    </div>

                </section>



                <section>

                    <div className="mb-4 flex items-center justify-between">

                        <div>

                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Your budgets
                            </h2>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Monitor your monthly spending limits.
                            </p>

                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
                            {budgets.length} active
                        </span>

                    </div>

                    {budgets.length === 0 ? (

                        /* EMPTY STATE */

                        <div
                            className="
                                rounded-2xl
                                border border-slate-200
                                bg-white
                                px-6 py-16
                                text-center
                                shadow-sm
                                dark:border-white/[0.07]
                                dark:bg-[#11151C]
                            "
                        >

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <Target size={21} />
                            </div>

                            <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                                No budgets yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
                                Create your first spending limit to start monitoring your monthly expenses.
                            </p>

                            <button
                                onClick={handleCreate}
                                className="
                                    mt-5
                                    rounded-xl
                                    bg-slate-900
                                    px-4 py-2.5
                                    text-[10px]
                                    font-bold uppercase
                                    tracking-wider
                                    text-white
                                    transition-colors
                                    hover:bg-slate-800
                                    dark:bg-white
                                    dark:text-slate-950
                                    dark:hover:bg-slate-200
                                "
                            >
                                Create budget
                            </button>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                            {budgets.map((budget) => (

                                <BudgetCard
                                    key={budget.id}
                                    category={
                                        budget.category
                                    }
                                    limit={budget.limit}
                                    spent={
                                        categorySpending[
                                        budget.category
                                        ] || 0
                                    }
                                    onDelete={() => {

                                        if (
                                            window.confirm(
                                                `Delete budget for ${budget.category}?`
                                            )
                                        ) {
                                            deleteBudget(
                                                budget.id
                                            );
                                        }

                                    }}
                                    onEdit={() =>
                                        handleEdit(
                                            budget
                                        )
                                    }
                                />

                            ))}

                        </div>

                    )}

                </section>



                <section
                    className="
                        mt-7
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        dark:border-white/[0.07]
                        dark:bg-[#11151C]
                    "
                >

                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            <AlertTriangle size={16} />
                        </div>

                        <div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                How budgets work
                            </h4>

                            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Your budgets automatically track expenses from the current month. A category receives attention when spending reaches 80% of its limit.
                            </p>

                        </div>

                    </div>

                </section>

            </div>


            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingBudget}
            />



            <button
                onClick={handleCreate}
                aria-label="Add budget"
                className="
                    fixed bottom-6 right-5 z-40
                    flex h-14 w-14
                    items-center justify-center
                    rounded-2xl
                    border border-slate-900
                    bg-slate-900
                    text-white
                    shadow-lg
                    transition-all duration-200
                    hover:scale-105
                    hover:bg-slate-800
                    active:scale-95
                    dark:border-white
                    dark:bg-white
                    dark:text-slate-950
                    dark:hover:bg-slate-200
                    md:hidden
                "
            >
                <Plus size={21} />
            </button>

        </div>
    );
};

export default Budgets;