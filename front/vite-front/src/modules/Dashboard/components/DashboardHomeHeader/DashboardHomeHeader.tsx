import React from 'react';
import './DashboardHomeHeader.css';

interface Metric {
    id: string;
    label: string;
    value: number | string;
}

export interface DashboardHomeHeaderProps {
    title: string;
    metrics: Metric[];
}

const formatValue = (value: number | string): string => {
    if (typeof value === 'number') {
        return new Intl.NumberFormat('es-AR').format(value);
    }
    return value;
};

export const DashboardHomeHeader: React.FC<DashboardHomeHeaderProps> = ({ title, metrics }) => {
    return (
        <div className="dashboard-home-header">
            <div className="dashboard-home-header-content">
                <h2 className="dashboard-home-header-title">{title}</h2>
                <span className="dashboard-home-header-caption">Vista general del sistema</span>
            </div>

            <div className="dashboard-home-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`dashboard-home-header-stat dashboard-home-header-stat--${metric.id}`} role="listitem">
                        <span className="dashboard-home-header-stat-value">{formatValue(metric.value)}</span>
                        <span className="dashboard-home-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
