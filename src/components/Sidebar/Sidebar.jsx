import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, BarChart3, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PiggyBank },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen fixed left-0 top-0 z-10">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    <span className="text-3xl">🪙</span> Finance
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium',
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        U
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">User Name</p>
                        <p className="text-xs text-gray-500">user@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
