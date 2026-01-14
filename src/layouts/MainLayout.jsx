import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import MobileNav from '../components/Navigation/MobileNav';

const MainLayout = () => {
    const location = useLocation();

    // Determine page title based on path (simple mapping)
    const getPageTitle = (path) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/transactions': return 'Transactions';
            case '/budgets': return 'Budgets';
            case '/analytics': return 'Analytics';
            case '/settings': return 'Settings';
            default: return 'Finance Tracker';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans text-gray-900 dark:text-slate-200 transition-colors duration-200 relative overflow-hidden">
            {/* Background decorative elements */}

            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Navbar title={getPageTitle(location.pathname)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-0">
                    <Outlet />
                </main>
            </div>
            <MobileNav />
        </div>
    );
};

export default MainLayout;
