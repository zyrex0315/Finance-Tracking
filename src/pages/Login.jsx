import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Sun, Moon } from 'lucide-react';
import useAuthStore from '../context/authStore';
import useThemeStore from '../context/themeStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, error } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F7F9] px-4 py-12 text-slate-900 transition-colors duration-200 dark:bg-[#080B10] dark:text-slate-100 sm:px-6 lg:px-8">

            {/* Top Bar Theme Toggle */}
            <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
                <button
                    onClick={toggleTheme}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.07] dark:bg-[#11151C]/80 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </button>
            </div>

            {/* Main Auth Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 dark:border-white/[0.08] dark:bg-[#11151C]/95 dark:shadow-2xl dark:shadow-black/50 sm:p-8">

                    {/* Header & Brand */}
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold tracking-tight text-white shadow-sm dark:bg-white dark:text-slate-900">
                                FT
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                                    Finance Tracker
                                </span>
                                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Personal Finance
                                </span>
                            </div>
                        </Link>

                        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                            Enter your credentials to access your financial dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 sm:text-sm">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="group">
                                <label
                                    htmlFor="email-address"
                                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
                                        <Mail size={17} strokeWidth={1.8} />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/[0.08] dark:bg-[#0C1016] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-[#0C1016] dark:focus:ring-indigo-400/15"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
                                        <Lock size={17} strokeWidth={1.8} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/[0.08] dark:bg-[#0C1016] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-[#0C1016] dark:focus:ring-indigo-400/15"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:translate-y-0 active:scale-[0.99] dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-400 dark:hover:text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Sign up prompt */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                                Don&apos;t have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                >
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>


                <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Protected with Firebase secure authentication</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
