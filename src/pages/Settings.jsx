import { User, Bell, Shield, Moon, Globe, LogOut, Check } from 'lucide-react';
import useAuthStore from '../context/authStore';
import useThemeStore from '../context/themeStore';
import useCurrencyStore, { CURRENCIES } from '../context/currencyStore';

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
        <div className="p-6 max-w-4xl mx-auto space-y-10 min-h-screen animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Configure your personal experience</p>
                </div>
            </div>

            <div className="space-y-10">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 px-2">{section.title}</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-750">
                            {section.items.map((item) => (
                                <div key={item.label}>
                                    <div
                                        onClick={item.type === 'toggle' ? item.action : undefined}
                                        className={`p-5 flex items-center justify-between transition-all ${item.type === 'toggle' ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer' : ''} group`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-2xl transition-colors ${item.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    item.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                        item.color === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                            item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                <item.icon size={20} strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white leading-tight">{item.label}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.type === 'toggle' && (
                                                <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${item.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.value ? 'left-6' : 'left-1'}`} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {item.type === 'selector' && (
                                        <div className="px-5 pb-5 flex flex-wrap gap-2">
                                            {item.options.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => item.onSelect(opt.value)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${item.currentValue === opt.value
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                        }`}
                                                >
                                                    {opt.label}
                                                    {item.currentValue === opt.value && <Check size={14} />}
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
                    className="w-full p-5 flex items-center gap-5 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group"
                >
                    <div className="p-3 bg-white dark:bg-red-900/20 rounded-2xl shadow-sm text-red-600">
                        <LogOut size={20} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-lg leading-tight uppercase tracking-tight">Logout</p>
                        <p className="text-xs font-medium opacity-70">Sign out of your session</p>
                    </div>
                </button>
            </div>
        </div>
    );
};


export default Settings;
