import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    // Simple title mapping
    const getPageTitle = (pathname: string) => {
        if (pathname === '/') return 'Dashboard Overview';
        const cleanPath = pathname.replace('/', '');
        return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <Sidebar />
            <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header title={getPageTitle(location.pathname)} />
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
