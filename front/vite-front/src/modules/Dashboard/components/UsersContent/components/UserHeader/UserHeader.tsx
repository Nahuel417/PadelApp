import React from 'react';
import './UserHeader.css';
import { UserHeaderProps } from '../../types/types';

const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

export const UserHeader: React.FC<UserHeaderProps> = ({ title, stats }) => {
    const metrics = [
        { id: 'total', label: 'Totales', value: stats.totalUsers },
        { id: 'active', label: 'Activos', value: stats.activeUsers },
        { id: 'admins', label: 'Administradores', value: stats.admins },
        { id: 'coaches', label: 'Entrenadores', value: stats.coaches },
    ];

    return (
        <div className="user-header">
            <div className="user-header-content">
                <h2 className="user-header-title">{title}</h2>
                <span className="user-header-caption">Resumen actualizado</span>
            </div>

            <div className="user-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`user-header-stat user-header-stat--${metric.id}`} role="listitem">
                        <span className="user-header-stat-value">{formatCount(metric.value)}</span>
                        <span className="user-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
