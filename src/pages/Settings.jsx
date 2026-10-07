import {
    User,
    Bell,
    Shield,
    Moon,
    Globe,
    LogOut,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../context/authStore';
import useThemeStore from '../context/themeStore';
import useCurrencyStore, { CURRENCIES } from '../context/currencyStore';

const Settings = () => {
    const { currentUser, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const { currency, setCurrency } = useCurrencyStore();

    const [notifications, setNotifications] = useState(true);

    const currencyOptions = Object.values(CURRENCIES);

    return (
        <div className="min-h-full bg-[#F6F7F9] text-slate-900 dark:bg-[#080B10] dark:text-slate-100">
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 md:px-8 md:py-8">

                {/* Header */}
                <header className="mb-7 md:mb-10">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage your account and application preferences.
                    </p>
                </header>

                {/* Account */}
                <section className="mb-7 md:mb-10">
                    <SectionTitle title="Account" />

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#11151C]">

                        <SettingRow
                            icon={User}
                            title="Profile Information"
                            description={
                                currentUser?.email ||
                                'Manage your account information'
                            }
                            iconClass="bg-indigo-500/10 text-indigo-500"
                        />

                        <SettingRow
                            icon={Shield}
                            title="Security"
                            description="Privacy and password settings"
                            iconClass="bg-slate-500/10 text-slate-500"
                            last
                        />
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-7 md:mb-10">
                    <SectionTitle title="Experience" />

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#11151C]">

                        {/* Dark Mode */}
                        <SettingRow
                            icon={Moon}
                            title="Dark Mode"
                            description={
                                theme === 'dark'
                                    ? 'Dark appearance is enabled'
                                    : 'Light appearance is enabled'
                            }
                            iconClass="bg-violet-500/10 text-violet-500"
                            action={
                                <Toggle
                                    enabled={theme === 'dark'}
                                    onChange={toggleTheme}
                                    label="Toggle dark mode"
                                />
                            }
                        />

                        {/* Currency */}
                        <div className="border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 px-4 py-4 md:px-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <Globe size={19} strokeWidth={2} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">
                                        Currency
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Choose your primary currency
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3 md:flex md:flex-wrap md:px-5">
                                {currencyOptions.map((item) => {
                                    const selected = currency === item.code;

                                    return (
                                        <button
                                            key={item.code}
                                            type="button"
                                            onClick={() => setCurrency(item.code)}
                                            className={`
                                                flex min-h-10 items-center justify-between
                                                gap-2 rounded-xl border px-3 py-2.5
                                                text-left text-xs font-medium
                                                transition-all duration-150
                                                md:min-w-[130px]
                                                ${selected
                                                    ? 'border-indigo-500 bg-indigo-500 text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5'
                                                }
                                            `}
                                        >
                                            <span className="truncate">
                                                {item.code}

                                                <span
                                                    className={
                                                        selected
                                                            ? 'ml-1 opacity-80'
                                                            : 'ml-1 text-slate-400'
                                                    }
                                                >
                                                    {item.symbol}
                                                </span>
                                            </span>

                                            {selected && (
                                                <Check
                                                    size={14}
                                                    strokeWidth={2.5}
                                                    className="shrink-0"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="mb-7 md:mb-10">
                    <SectionTitle title="Notifications" />

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#11151C]">
                        <SettingRow
                            icon={Bell}
                            title="App Notifications"
                            description={
                                notifications
                                    ? 'Budget and activity alerts are enabled'
                                    : 'Budget and activity alerts are disabled'
                            }
                            iconClass="bg-amber-500/10 text-amber-500"
                            action={
                                <Toggle
                                    enabled={notifications}
                                    onChange={() =>
                                        setNotifications((prev) => !prev)
                                    }
                                    label="Toggle notifications"
                                />
                            }
                            last
                        />
                    </div>
                </section>

                {/* Logout */}
                <section>
                    <button
                        type="button"
                        onClick={logout}
                        className="
                            group flex w-full items-center justify-between
                            rounded-2xl border border-rose-200
                            bg-white px-4 py-4 text-left
                            transition-colors
                            hover:border-rose-300 hover:bg-rose-50
                            dark:border-rose-500/20
                            dark:bg-[#11151C]
                            dark:hover:border-rose-500/30
                            dark:hover:bg-rose-500/5
                            md:px-5
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 transition-transform group-hover:scale-105">
                                <LogOut size={19} strokeWidth={2} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                                    Log out
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Safely sign out of your account
                                </p>
                            </div>
                        </div>

                        <span className="hidden text-xs font-medium text-rose-500 sm:block">
                            Sign out
                        </span>
                    </button>
                </section>

                <div className="h-6 md:h-10" />
            </div>
        </div>
    );
};


const SectionTitle = ({ title }) => {
    return (
        <div className="mb-3 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {title}
            </h2>
        </div>
    );
};

const SettingRow = ({
    icon: Icon,
    title,
    description,
    iconClass,
    action,
    last = false,
}) => {
    return (
        <div
            className={`
                flex min-h-[68px] items-center justify-between
                gap-4 px-4 py-3.5 md:px-5
                ${!last ? 'border-b border-slate-100 dark:border-white/5' : ''}
            `}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className={`
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl
                        ${iconClass}
                    `}
                >
                    <Icon size={19} strokeWidth={2} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                        {title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};


const Toggle = ({ enabled, onChange, label }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={label}
            onClick={onChange}
            className={`
                relative inline-flex h-6 w-11 shrink-0
                cursor-pointer items-center rounded-full
                p-0
                transition-colors duration-200
                focus:outline-none focus:ring-2
                focus:ring-indigo-500/30
                ${enabled
                    ? 'bg-indigo-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }
            `}
        >
            <span
                className={`
                    pointer-events-none absolute
                    left-0.5 top-0.5
                    h-5 w-5 rounded-full
                    bg-white shadow-sm
                    transition-transform duration-200
                    ${enabled
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }
                `}
            />
        </button>
    );
};

export default Settings;