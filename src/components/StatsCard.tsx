import * as LucideIcons from 'lucide-react';
import type { KpiStat } from '../types';

const StatsCard = ({ stat }: { stat: KpiStat }) => {
    // Dynamic icon component
    const IconComponent = (LucideIcons as any)[stat.icon] || LucideIcons.HelpCircle;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{stat.label}</span>
                <div style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                    color: stat.color
                }}>
                    <IconComponent size={20} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</span>
                {stat.unit && <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stat.unit}</span>}
            </div>

            {stat.change !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    <span style={{
                        color: stat.change >= 0 ? 'var(--status-good)' : 'var(--status-danger)',
                        fontWeight: 600
                    }}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span style={{ color: 'var(--text-tertiary)' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
