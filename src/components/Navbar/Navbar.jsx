import { Bell, Search, Moon, Sun } from 'lucide-react';
import useThemeStore from '../../context/themeStore';

const Navbar = ({ title }) => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <header className="bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-all duration-300">
            <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
                <p className="hidden md:block text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] mt-0.5">Overview</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#1e293b] w-72 text-gray-900 dark:text-white placeholder-slate-500 transition-all duration-200"
                    />
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 hover:text-blue-500 dark:hover:text-white rounded-lg transition-all"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button className="p-2 text-slate-500 hover:text-blue-500 dark:hover:text-white rounded-lg relative transition-all">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
