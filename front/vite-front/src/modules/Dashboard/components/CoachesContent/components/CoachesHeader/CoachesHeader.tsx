import React from 'react';
import './CoachesHeader.css';

export interface CoachesHeaderProps {
    title: string;
    totalCoaches: number;
    availableCoaches: number;
    onAddCoach?: () => void;
}

const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

export const CoachesHeader: React.FC<CoachesHeaderProps> = ({ title, totalCoaches, availableCoaches }) => {
    const metrics = [
        { id: 'total', label: 'Total', value: totalCoaches },
        { id: 'available', label: 'Disponibles', value: availableCoaches },
        { id: 'unavailable', label: 'No Disponibles', value: totalCoaches - availableCoaches },
    ];

    return (
        <div className="coaches-header">
            <div className="coaches-header-content">
                <h2 className="coaches-header-title">{title}</h2>
                <span className="coaches-header-caption">Gestión de equipo</span>
            </div>

            <div className="coaches-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`coaches-header-stat coaches-header-stat--${metric.id}`} role="listitem">
                        <span className="coaches-header-stat-value">{formatCount(metric.value)}</span>
                        <span className="coaches-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
