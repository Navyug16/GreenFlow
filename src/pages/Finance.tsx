import { FinanceDashboard } from '../components/FinanceDashboard';

const FinancePage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Finance & Reporting</h1>
                    <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>Full analytic financial performance and operational efficiency</p>
                </div>
            </div>

            <FinanceDashboard />
        </div>
    );
};

export default FinancePage;
