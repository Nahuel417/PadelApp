import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis, XAxis } from 'recharts';
import './MetricCard.css';

export interface MetricPoint {
    name: string;
    value: number;
}

export interface MetricCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    data?: MetricPoint[];
    color?: string;
    isLoading?: boolean;
    footer?: string;
}

const defaultData: MetricPoint[] = [
    { name: 'Inicio', value: 0 },
    { name: 'Actual', value: 0 },
];

const sanitizeId = (input: string): string => input.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, data, color = '#238744', isLoading, footer }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return defaultData;
        }

        return data.map((point) => ({ ...point, value: Number(point.value) || 0 }));
    }, [data]);

    const gradientId = useMemo(() => `metricGradient-${sanitizeId(title)}`, [title]);

    return (
        <article className="metric-card" aria-live="polite">
            <header className="metric-card__header">
                <span className="metric-card__title">{title}</span>
                {subtitle && <span className="metric-card__subtitle">{subtitle}</span>}
            </header>

            <div className="metric-card__body">
                <strong className="metric-card__value">{isLoading ? '…' : value}</strong>
                <div className="metric-card__chart" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide={chartData.length > 4} tickLine={false} axisLine={false} stroke="#9ca3af" tick={{ fontSize: 10 }} />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                cursor={false}
                                contentStyle={{ borderRadius: 12, border: '1px solid rgba(9, 39, 71, 0.1)', boxShadow: '0 10px 24px rgba(9, 39, 71, 0.08)' }}
                                formatter={(tooltipValue: number) => [tooltipValue, title]}
                            />
                            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {footer && <footer className="metric-card__footer">{footer}</footer>}
        </article>
    );
};

export default MetricCard;
