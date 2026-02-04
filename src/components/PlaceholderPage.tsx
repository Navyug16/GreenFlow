

const PlaceholderPage = ({ title }: { title: string }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: 'var(--text-tertiary)'
        }}>
            <div style={{
                width: 64,
                height: 64,
                border: '2px dashed var(--glass-border)',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div style={{ width: 16, height: 16, background: 'var(--glass-border)', borderRadius: '2px' }}></div>
            </div>
            <h2 style={{ color: 'var(--text-secondary)' }}>{title} Implementation</h2>
            <p>This module is currently under development.</p>
        </div>
    );
};

export default PlaceholderPage;
