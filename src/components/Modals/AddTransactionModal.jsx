import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Calendar,
    Tag,
    FileText,
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
} from 'lucide-react';
import useTransactionStore from '../../context/transactionStore';
import useCurrencyStore from '../../context/currencyStore';
import clsx from 'clsx';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const { addTransaction } = useTransactionStore();
    const { getCurrencyInfo } = useCurrencyStore();

    const [isLoading, setIsLoading] = useState(false);

    const currencyInfo = getCurrencyInfo();

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0 || !category) return;

        setIsLoading(true);

        try {
            await addTransaction({
                type,
                amount: parseFloat(amount),
                category,
                date: new Date(date),
                description,
            });

            // Reset form
            setAmount('');
            setCategory('');
            setDescription('');
            setType('expense');
            setDate(new Date().toISOString().split('T')[0]);

            onClose();
        } catch (error) {
            console.error('Failed to add transaction', error);
        } finally {
            setIsLoading(false);
        }
    };

    const categories =
        type === 'expense'
            ? [
                'Food',
                'Transport',
                'Housing',
                'Utilities',
                'Entertainment',
                'Health',
                'Shopping',
                'Other',
            ]
            : [
                'Salary',
                'Freelance',
                'Investments',
                'Gifts',
                'Other',
            ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
            <div
                className="
                    flex w-full max-w-xl max-h-[96dvh] flex-col
                    overflow-hidden rounded-t-[2rem]
                    border border-slate-200
                    bg-white text-slate-900
                    shadow-2xl
                    animate-in slide-in-from-bottom-6 duration-300

                    dark:border-white/[0.07]
                    dark:bg-[#11151C]
                    dark:text-white

                    sm:max-h-[90vh]
                    sm:rounded-2xl
                "
            >
                {/* Mobile drag indicator */}
                <div className="flex shrink-0 justify-center pt-3 sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-white/10" />
                </div>

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/[0.06] sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                            <Wallet
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <h3 className="text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-lg">
                                New transaction
                            </h3>

                            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                                Record your financial activity
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            text-slate-400
                            transition-colors
                            hover:bg-slate-100
                            hover:text-slate-700

                            dark:border-white/[0.07]
                            dark:bg-white/[0.04]
                            dark:text-slate-400
                            dark:hover:bg-white/[0.08]
                            dark:hover:text-white
                        "
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable content */}
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                        {/* Transaction Type */}
                        <div>
                            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Transaction type
                            </label>

                            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/[0.07] dark:bg-white/[0.03]">
                                {/* Expense */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setType('expense');
                                        setCategory('');
                                    }}
                                    className={clsx(
                                        'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                                        type === 'expense'
                                            ? 'border border-slate-200 bg-white text-rose-600 shadow-sm dark:border-white/[0.06] dark:bg-[#11151C] dark:text-rose-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    )}
                                >
                                    <ArrowDownRight size={14} />
                                    Expense
                                </button>

                                {/* Income */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setType('income');
                                        setCategory('');
                                    }}
                                    className={clsx(
                                        'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                                        type === 'income'
                                            ? 'border border-slate-200 bg-white text-emerald-600 shadow-sm dark:border-white/[0.06] dark:bg-[#11151C] dark:text-emerald-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    )}
                                >
                                    <ArrowUpRight size={14} />
                                    Income
                                </button>
                            </div>
                        </div>

                        {/* Amount + Date */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Amount */}
                            <div>
                                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Amount
                                </label>

                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                        {currencyInfo.symbol}
                                    </span>

                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="
                                            w-full
                                            rounded-xl
                                            border border-slate-200
                                            bg-slate-50
                                            py-3 pl-9 pr-4
                                            text-sm font-bold
                                            text-slate-900
                                            outline-none
                                            transition-all

                                            placeholder:text-slate-300

                                            focus:border-slate-400
                                            focus:bg-white

                                            [appearance:textfield]
                                            [&::-webkit-inner-spin-button]:appearance-none
                                            [&::-webkit-outer-spin-button]:appearance-none

                                            dark:border-white/[0.07]
                                            dark:bg-[#0C1016]
                                            dark:text-white
                                            dark:placeholder:text-slate-600
                                            dark:focus:border-white/20
                                            dark:focus:bg-[#0C1016]
                                        "
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Date
                                </label>

                                <div className="relative">
                                    <Calendar
                                        size={15}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        className="
                                            w-full
                                            rounded-xl
                                            border border-slate-200
                                            bg-slate-50
                                            py-3 pl-10 pr-3
                                            text-sm font-semibold
                                            text-slate-900
                                            outline-none
                                            transition-all

                                            focus:border-slate-400
                                            focus:bg-white

                                            dark:border-white/[0.07]
                                            dark:bg-[#0C1016]
                                            dark:text-white
                                            dark:focus:border-white/20
                                        "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Category
                            </label>

                            <div className="relative">
                                <Tag
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    required
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="
                                        w-full
                                        appearance-none
                                        rounded-xl
                                        border border-slate-200
                                        bg-slate-50
                                        py-3 pl-10 pr-10
                                        text-sm font-semibold
                                        text-slate-900
                                        outline-none
                                        transition-all

                                        focus:border-slate-400
                                        focus:bg-white

                                        dark:border-white/[0.07]
                                        dark:bg-[#0C1016]
                                        dark:text-white
                                        dark:focus:border-white/20
                                    "
                                >
                                    <option
                                        value=""
                                        disabled
                                    >
                                        Choose category
                                    </option>

                                    {categories.map((cat) => (
                                        <option
                                            key={cat}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>
                                    ))}
                                </select>

                                {/* Select arrow */}
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2.5 4.5L6 8L9.5 4.5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Memo */}
                        <div>
                            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Memo
                            </label>

                            <div className="relative">
                                <FileText
                                    size={15}
                                    className="absolute left-3.5 top-3.5 text-slate-400"
                                />

                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Add notes (optional)..."
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border border-slate-200
                                        bg-slate-50
                                        py-3 pl-10 pr-4
                                        text-sm font-medium
                                        text-slate-900
                                        outline-none
                                        transition-all

                                        placeholder:text-slate-300

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
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 gap-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-white/[0.06] dark:bg-[#11151C] sm:px-6">
                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-4 py-3
                                text-xs font-bold
                                text-slate-600
                                transition-colors

                                hover:bg-slate-50
                                hover:text-slate-900

                                dark:border-white/[0.07]
                                dark:bg-transparent
                                dark:text-slate-400
                                dark:hover:bg-white/[0.05]
                                dark:hover:text-white
                            "
                        >
                            Cancel
                        </button>

                        {/* Save */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                `
                                    flex-[1.5]
                                    rounded-xl
                                    px-4 py-3
                                    text-xs font-bold
                                    uppercase tracking-wider
                                    text-white
                                    transition-all
                                    active:scale-[0.98]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                `,
                                type === 'income'
                                    ? `
                                         bg-slate-900
                                        hover:bg-slate-800
                                        dark:bg-white
                                        dark:text-slate-950
                                        dark:hover:bg-slate-200
                                    `
                                    : `
                                        bg-slate-900
                                        hover:bg-slate-800
                                        dark:bg-white
                                        dark:text-slate-950
                                        dark:hover:bg-slate-200
                                    `
                            )}
                        >
                            {isLoading
                                ? 'Saving...'
                                : 'Save transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTransactionModal;