import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Bell,
    Moon,
    Sun,
    ChevronDown,
    LogOut,
    User,
    Settings
} from 'lucide-react';

import useThemeStore from '../../context/themeStore';
import useAuthStore from '../../context/authStore';

const Navbar = ({ title }) => {
    const { theme, toggleTheme } = useThemeStore();
    const { currentUser, logout } = useAuthStore();

    const location = useLocation();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const pageTitles = {
        '/': 'Dashboard',
        '/dashboard': 'Dashboard',
        '/transactions': 'Transactions',
        '/budgets': 'Budgets',
        '/settings': 'Settings',
        '/profile': 'Profile',
    };

    const currentPage =
        pageTitles[location.pathname] || title || 'Finance Tracker';

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

    const handleLogout = async () => {
        setProfileOpen(false);
        await logout();
    };

    return (
        <header className="relative z-[100] flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-3 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0f172a]/90 md:h-20 md:px-8">


            <div className="flex min-w-0 items-center gap-3">

                <div className="min-w-0">
                    <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white md:text-base">
                        Finance Tracker
                    </h1>

                    <p className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-400 md:block">
                        Personal Finance
                    </p>
                </div>
            </div>


            <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
                <span className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">
                    {currentPage}
                </span>
            </div>


            <div className="flex shrink-0 items-center gap-1 md:gap-2">

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    title={
                        theme === 'dark'
                            ? 'Switch to Light Mode'
                            : 'Switch to Dark Mode'
                    }
                    aria-label={
                        theme === 'dark'
                            ? 'Switch to Light Mode'
                            : 'Switch to Dark Mode'
                    }
                >
                    {theme === 'dark' ? (
                        <Sun size={18} />
                    ) : (
                        <Moon size={18} />
                    )}
                </button>



                <div className="relative">

                    {/* Profile Button */}
                    <button
                        onClick={() =>
                            setProfileOpen((open) => !open)
                        }
                        className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition hover:bg-slate-100 dark:hover:bg-white/[0.05] md:gap-2"
                        aria-expanded={profileOpen}
                        aria-haspopup="menu"
                    >
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
                            {initials}
                        </div>

                        {/* User Information */}
                        <div className="hidden max-w-[150px] text-left lg:block">
                            <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                                {displayName}
                            </p>

                            <p className="truncate text-[10px] text-slate-400">
                                {email}
                            </p>
                        </div>

                        <ChevronDown
                            size={14}
                            className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>


                    {profileOpen && (
                        <div
                            className="
                                absolute
                                right-0
                                top-full
                                z-[9999]
                                mt-2
                                w-[calc(100vw-1rem)]
                                max-w-64
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-1.5
                                shadow-2xl
                                dark:border-white/[0.08]
                                dark:bg-[#111827]
                            "
                            role="menu"
                        >

                            {/* User Information */}
                            <div className="border-b border-slate-100 px-3 py-3 dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                            {displayName}
                                        </p>

                                        <p className="truncate text-xs text-slate-400">
                                            {email}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Profile */}
                            <button
                                onClick={() => {
                                    setProfileOpen(false);
                                    navigate('/profile');
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                                role="menuitem"
                            >
                                <User size={16} />
                                <span>Profile</span>
                            </button>

                            {/* Settings */}
                            <button
                                onClick={() => {
                                    setProfileOpen(false);
                                    navigate('/settings');
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                                role="menuitem"
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>

                            {/* Divider */}
                            <div className="my-1 border-t border-slate-100 dark:border-white/[0.06]" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                                role="menuitem"
                            >
                                <LogOut size={16} />
                                <span>Sign out</span>
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
