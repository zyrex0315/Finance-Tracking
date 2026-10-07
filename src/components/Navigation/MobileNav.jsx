import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    BarChart3,
    Settings,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    {
        name: 'Dashboard',
        shortName: 'Home',
        path: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Transactions',
        shortName: 'Transactions',
        path: '/transactions',
        icon: Receipt,
    },
    {
        name: 'Budgets',
        shortName: 'Budgets',
        path: '/budgets',
        icon: PiggyBank,
    },
    {
        name: 'Analytics',
        shortName: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
    },
    {
        name: 'Settings',
        shortName: 'Settings',
        path: '/settings',
        icon: Settings,
    },
];

const MobileNav = () => {
    const location = useLocation();

    return (
        <nav
            className="
                fixed
                bottom-3
                left-3
                right-3
                z-50
                pointer-events-none
                md:hidden
                pb-[env(safe-area-inset-bottom)]
            "
        >
            <div
                className="
                    pointer-events-auto
                    mx-auto
                    max-w-md
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-200/80
                    bg-white
                    shadow-[0_12px_40px_rgba(15,23,42,0.10)]
                    dark:border-white/[0.08]
                    dark:bg-[#11151C]
                    dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                "
            >
                <div className="grid h-[72px] grid-cols-5 px-1.5 py-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                aria-current={isActive ? 'page' : undefined}
                                className={clsx(
                                    `
                                        group
                                        relative
                                        flex
                                        min-w-0
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-[17px]
                                        no-underline
                                        transition-all
                                        duration-200
                                        ease-out
                                        active:scale-[0.94]
                                    `,
                                    isActive
                                        ? `
                                            bg-indigo-50
                                            text-indigo-600
                                            dark:bg-indigo-500/[0.12]
                                            dark:text-indigo-400
                                        `
                                        : `
                                            text-slate-400
                                            dark:text-slate-500
                                            hover:bg-slate-50
                                            hover:text-slate-600
                                            dark:hover:bg-white/[0.035]
                                            dark:hover:text-slate-300
                                        `
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={clsx(
                                        `
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-xl
                                            transition-all
                                            duration-200
                                        `,
                                        isActive
                                            ? `
                                                bg-indigo-100
                                                dark:bg-indigo-500/[0.14]
                                            `
                                            : 'bg-transparent'
                                    )}
                                >
                                    <Icon
                                        size={19}
                                        strokeWidth={isActive ? 2.35 : 1.8}
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className={clsx(
                                        `
                                            mt-0.5
                                            max-w-full
                                            truncate
                                            px-1
                                            text-[9px]
                                            font-semibold
                                            leading-none
                                            tracking-[0.02em]
                                            no-underline
                                            transition-colors
                                            duration-200
                                        `,
                                        isActive
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-400 dark:text-slate-500'
                                    )}
                                >
                                    {item.shortName}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default MobileNav;