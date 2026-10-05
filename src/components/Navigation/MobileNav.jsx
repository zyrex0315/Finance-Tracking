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

const MobileNav = () => {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#080B10]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.07] px-4 py-2 flex justify-around items-center safe-area-inset-bottom">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[56px]',
                            isActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
                        )}
                    >
                        <div className={clsx(
                            'p-1.5 rounded-lg transition-all duration-300',
                            isActive && 'bg-indigo-500/10 dark:bg-indigo-500/10'
                        )}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default MobileNav;
