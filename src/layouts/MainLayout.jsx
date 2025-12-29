import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';

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
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Navbar title={getPageTitle(location.pathname)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
