import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, BarChart3, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../context/authStore';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PiggyBank },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white dark:bg-white/5 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                        <PiggyBank className="h-6 w-6 text-white" />
                    </div>
                    <span className="tracking-tight">Finance</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group',
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-white'
                            )}
                        >
                            <Icon size={20} className={clsx('transition-transform duration-200 group-hover:scale-110', isActive ? 'text-white' : '')} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 mb-4 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-primary-600/20">
                            {currentUser?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 uppercase dark:text-white truncate">
                                {currentUser?.displayName || 'User'}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-slate-500 truncate  tracking-wider" title={currentUser?.email}>
                                {currentUser?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-danger w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
