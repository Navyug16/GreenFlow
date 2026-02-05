import { Bell, Search, Menu } from 'lucide-react';

const Header = ({ title, onMenuClick }: { title: string; onMenuClick: () => void }) => {
    return (
        <header style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            background: 'rgba(11, 17, 32, 0.8)', // Matching bg-main but transparent
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    className="mobile-menu-btn"
                    onClick={onMenuClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'none' // Hidden by default, shown via CSS
                    }}
                >
                    <Menu size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }} className="header-search">
                    <Search size={18} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                            background: 'var(--bg-panel)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            width: '100%',
                            maxWidth: 250
                        }}
                    />
                </div>

                <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    position: 'relative'
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        background: 'var(--accent-danger)',
                        borderRadius: '50%'
                    }}></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
