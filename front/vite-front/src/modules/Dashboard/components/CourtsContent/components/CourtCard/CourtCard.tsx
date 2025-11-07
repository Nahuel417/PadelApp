import React from 'react';
import './CourtCard.css';
import { Court } from '../../../../../../services/courts';

export interface CourtCardProps {
    court: Court;
    onEdit: () => void;
    onToggleStatus: () => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({
    court,
    onEdit,
    onToggleStatus
}) => {
    const formatTime = (time: string) => {
        return time.slice(0, 5); // Remove seconds from HH:MM:SS
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    return (
        <div className={`court-card ${!court.is_active ? 'inactive' : ''}`}>
            <div className="court-card__header">
                <h3 className="court-card__name">{court.name}</h3>
                <div className={`court-card__status ${court.is_active ? 'active' : 'inactive'}`}>
                    <i className={`bi ${court.is_active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                    {court.is_active ? 'Activa' : 'Inactiva'}
                </div>
            </div>

            <div className="court-card__content">
                <div className="court-info-item">
                    <span className="court-info-label">Superficie:</span>
                    <span className="court-info-value">{court.surface_type}</span>
                </div>
                
                <div className="court-info-item">
                    <span className="court-info-label">Precio por hora:</span>
                    <span className="court-info-value price">{formatPrice(court.price_per_hour)}</span>
                </div>
                
                <div className="court-info-item">
                    <span className="court-info-label">Horarios:</span>
                    <span className="court-info-value">
                        {formatTime(court.opening_time)} - {formatTime(court.closing_time)}
                    </span>
                </div>
            </div>

            <div className="court-card__actions">
                <button 
                    className="court-action-btn edit"
                    onClick={onEdit}
                    title="Editar cancha"
                >
                    <i className="bi bi-pencil"></i>
                    Editar
                </button>
                
                <button 
                    className={`court-action-btn toggle ${court.is_active ? 'deactivate' : 'activate'}`}
                    onClick={onToggleStatus}
                    title={court.is_active ? 'Desactivar cancha' : 'Activar cancha'}
                >
                    <i className={`bi ${court.is_active ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                    {court.is_active ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    );
};
