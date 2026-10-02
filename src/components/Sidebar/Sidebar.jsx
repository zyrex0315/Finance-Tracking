
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    BarChart3,
    Settings,
    LogOut,
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../context/authStore';

const mainNav = [
    {
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Transactions',
        path: '/transactions',
        icon: Receipt,
    },
    {
        name: 'Budgets',
        path: '/budgets',
        icon: PiggyBank,
    },
];

const insightNav = [
    {
        name: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
    },
];

const systemNav = [
    {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
    },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { currentUser, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const displayName =
        currentUser?.displayName ||
        currentUser?.email?.split('@')[0] ||
        'User';

    const email = currentUser?.email || '';

    const initials = displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const renderNavItems = (items) =>
        items.map((item) => {
            const Icon = item.icon;

            const isActive =
                location.pathname === item.path ||
                (item.path !== '/' &&
                    location.pathname.startsWith(item.path));

            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                        isActive
                            ? 'bg-slate-100 font-medium text-slate-900 dark:bg-white/[0.07] dark:text-white'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200'
                    )}
                >
                    {/* Active indicator */}
                    <span
                        className={clsx(
                            'absolute left-0 h-5 w-[2px] rounded-full transition-all duration-200',
                            isActive
                                ? 'bg-emerald-500 opacity-100'
                                : 'bg-transparent opacity-0'
                        )}
                    />

                    <Icon
                        size={17}
                        strokeWidth={isActive ? 2 : 1.8}
                        className={clsx(
                            'shrink-0 transition-transform duration-200',
                            isActive
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                        )}
                    />

                    <span>{item.name}</span>
                </Link>
            );
        });

    return (
        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-white/[0.07] dark:bg-[#0f172a] md:flex">

            {/* ===================================================== */}
            {/* BRAND */}
            {/* ===================================================== */}

            <div className="flex h-20 items-center px-5">
                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    {/* Logo */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold tracking-tight text-white dark:bg-white dark:text-slate-900">
                        FT
                    </div>

                    {/* Brand */}
                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                            Finance Tracker
                        </p>

                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-400">
                            Personal Finance
                        </p>
                    </div>
                </Link>
            </div>

            {/* ===================================================== */}
            {/* NAVIGATION */}
            {/* ===================================================== */}

            <nav className="flex-1 overflow-y-auto px-3 py-4">

                {/* Main */}
                <div className="mb-7">
                    <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                        Main
                    </p>

                    <div className="space-y-0.5">
                        {renderNavItems(mainNav)}
                    </div>
                </div>

                {/* Insights */}
                <div className="mb-7">
                    <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                        Insights
                    </p>

                    <div className="space-y-0.5">
                        {renderNavItems(insightNav)}
                    </div>
                </div>

                {/* System */}
                <div>
                    <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                        System
                    </p>

                    <div className="space-y-0.5">
                        {renderNavItems(systemNav)}
                    </div>
                </div>
            </nav>

        </aside>
    );
};

export default Sidebar;

