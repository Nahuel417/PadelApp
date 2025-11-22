import React from 'react';
import './ReserveHeader.css';
export interface ReserveHeaderProps {
    title: string;
    totalReserves: number;
    confirmedReserves: number;
    pendingReserves: number;
    cancelledReserves: number;
}

const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

export const ReserveHeader: React.FC<ReserveHeaderProps> = ({ title, totalReserves, confirmedReserves, pendingReserves, cancelledReserves }) => {
    const metrics = [
        { id: 'total', label: 'Total', value: totalReserves },
        { id: 'confirmed', label: 'Confirmadas', value: confirmedReserves },
        { id: 'pending', label: 'Pendientes', value: pendingReserves },
        { id: 'cancelled', label: 'Canceladas', value: cancelledReserves },
    ];

    return (
        <div className="reserve-header">
            <div className="reserve-header-content">
                <h2 className="reserve-header-title">{title}</h2>
                <span className="reserve-header-caption">Gestión de reservas</span>
            </div>

            <div className="reserve-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`reserve-header-stat reserve-header-stat--${metric.id}`} role="listitem">
                        <span className="reserve-header-stat-value">{formatCount(metric.value)}</span>
                        <span className="reserve-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
