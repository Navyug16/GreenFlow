import { Bell, Search } from 'lucide-react';

const Header = ({ title }: { title: string }) => {
    return (
        <header style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            background: 'rgba(11, 17, 32, 0.8)', // Matching bg-main but transparent
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backdropFilter: 'blur(8px)'
        }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Search assets, routes..."
                        style={{
                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                            background: 'var(--bg-panel)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            width: 250
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
