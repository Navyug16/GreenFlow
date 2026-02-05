import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Simple title mapping
    const getPageTitle = (pathname: string) => {
        if (pathname === '/') return 'Dashboard Overview';
        const cleanPath = pathname.replace('/', '');
        return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <Sidebar mobileOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 45,
                        backdropFilter: 'blur(2px)'
                    }}
                    className="mobile-overlay"
                />
            )}

            <main
                className="main-content"
                style={{
                    marginLeft: 'var(--sidebar-width)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    transition: 'margin-left 0.3s ease'
                }}
            >
                <Header title={getPageTitle(location.pathname)} onMenuClick={() => setSidebarOpen(true)} />
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }} className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
