import React from 'react';
import './CourtsHeader.css';

export interface CourtsHeaderProps {
    title: string;
    totalCourts: number;
    activeCourts: number;
}

const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

export const CourtsHeader: React.FC<CourtsHeaderProps> = ({ title, totalCourts, activeCourts }) => {
    const metrics = [
        { id: 'total', label: 'Total', value: totalCourts },
        { id: 'active', label: 'Activas', value: activeCourts },
        { id: 'inactive', label: 'Inactivas', value: totalCourts - activeCourts },
    ];

    return (
        <div className="courts-header">
            <div className="courts-header-content">
                <h2 className="courts-header-title">{title}</h2>
                <span className="courts-header-caption">Gestión de instalaciones</span>
            </div>

            <div className="courts-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`courts-header-stat courts-header-stat--${metric.id}`} role="listitem">
                        <span className="courts-header-stat-value">{formatCount(metric.value)}</span>
                        <span className="courts-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
