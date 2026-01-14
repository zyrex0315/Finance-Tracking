import { User, Bell, Shield, Moon, Globe, LogOut, Check } from 'lucide-react';
import useAuthStore from '../context/authStore';
import useThemeStore from '../context/themeStore';
import useCurrencyStore, { CURRENCIES } from '../context/currencyStore';
import clsx from 'clsx';

const Settings = () => {
    const { currentUser, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const { currency, setCurrency } = useCurrencyStore();

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Profile Information', desc: 'Update your personal details', color: 'blue' },
                { icon: Shield, label: 'Security', desc: 'Privacy and password settings', color: 'indigo' },
            ]
        },
        {
            title: 'Experience',
            items: [
                { icon: Moon, label: 'Dark Mode', desc: 'Switch app appearance', action: toggleTheme, value: theme === 'dark', color: 'purple', type: 'toggle' },
                {
                    icon: Globe,
                    label: 'Currency',
                    desc: 'Set your primary currency',
                    color: 'emerald',
                    type: 'selector',
                    options: Object.values(CURRENCIES).map(c => ({ label: `${c.label} (${c.symbol})`, value: c.code })),
                    currentValue: currency,
                    onSelect: setCurrency
                },
            ]
        },
        {
            title: 'Notifications',
            items: [
                { icon: Bell, label: 'App Notifications', desc: 'Budget and activity alerts', value: true, color: 'amber', type: 'toggle' },
            ]
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 md:space-y-12 min-h-screen animate-in fade-in duration-700">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Configuration</h1>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 italic">Fine-tune your financial command center</p>
                </div>
            </div>

            <div className="space-y-8 md:space-y-12">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 px-4">{section.title}</h3>
                        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
                            {section.items.map((item) => (
                                <div key={item.label}>
                                    <div
                                        onClick={item.type === 'toggle' ? item.action : undefined}
                                        className={`p-4 md:p-6 flex items-center justify-between transition-all ${item.type === 'toggle' ? 'hover:bg-blue-500/5 cursor-pointer' : ''} group`}
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className={clsx(
                                                "p-3 md:p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                                                item.color === 'blue' ? 'bg-blue-600/10 text-blue-500 shadow-blue-600/10' :
                                                    item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10' :
                                                        item.color === 'purple' ? 'bg-purple-500/10 text-purple-500 shadow-purple-500/10' :
                                                            item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' :
                                                                'bg-amber-500/10 text-amber-500 shadow-amber-500/10'
                                            )}>
                                                <item.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white leading-tight text-base md:text-lg tracking-tight">{item.label}</p>
                                                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{item.desc}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.type === 'toggle' && (
                                                <div className={`w-14 h-7 rounded-full transition-all duration-500 relative p-1 ${item.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${item.value ? 'translate-x-7' : 'translate-x-0'}`} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {item.type === 'selector' && (
                                        <div className="px-4 pb-6 md:px-6 md:pb-8 flex flex-wrap gap-2 md:gap-3">
                                            {item.options.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => item.onSelect(opt.value)}
                                                    className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-[14px] md:rounded-2xl text-[10px] md:text-xs font-black transition-all border uppercase tracking-widest ${item.currentValue === opt.value
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                        : 'bg-gray-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-gray-100 dark:border-white/10 hover:border-blue-500/50 hover:bg-white dark:hover:bg-white/10'
                                                        }`}
                                                >
                                                    {opt.label}
                                                    {item.currentValue === opt.value && <Check size={14} strokeWidth={4} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={logout}
                    className="w-full p-5 md:p-6 flex items-center justify-between bg-rose-500/5 dark:bg-rose-500/5 rounded-[2rem] md:rounded-[2.5rem] border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all group overflow-hidden relative"
                >
                    <div className="flex items-center gap-4 md:gap-6 relative z-10">
                        <div className="p-3 md:p-4 bg-rose-500 text-white rounded-xl md:rounded-2xl shadow-xl shadow-rose-500/30 group-hover:rotate-12 transition-transform duration-500">
                            <LogOut size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                            <p className="font-black text-lg md:text-xl leading-tight uppercase tracking-widest">Terminate Session</p>
                            <p className="text-[10px] md:text-xs font-bold opacity-60 mt-0.5">Safely log out of your account</p>
                        </div>
                    </div>
                    <div className="hidden md:block pr-4 relative z-10">
                        <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                            <Check className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                    </div>
                    {/* Decorative background for button */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                </button>
            </div>
        </div>
    );
};


export default Settings;
