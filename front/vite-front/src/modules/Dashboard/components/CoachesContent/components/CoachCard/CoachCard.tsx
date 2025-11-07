import React from 'react';
import './CoachCard.css';
import { Coach } from '../../../../../../services/coaches';

export interface CoachCardProps {
    coach: Coach;
    onEdit: () => void;
    onToggleAvailability: () => void;
    onViewDetails: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onEdit, onToggleAvailability, onViewDetails }) => {
    const formatRate = (rate: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(rate);
    };

    const getExperienceText = (years?: number) => {
        if (!years) return 'Sin especificar años';
        return years === 1 ? '1 año' : `${years} años`;
    };

    return (
        <div className={`coach-card ${!coach.is_available ? 'unavailable' : ''}`}>
            <div className="coach-card__header">
                <div className="coach-info">
                    <h3 className="coach-card__name">
                        {coach.user.first_name} {coach.user.last_name}
                    </h3>
                    <p className="coach-card__email">{coach.user.email}</p>
                </div>
                <div className={`coach-card__status ${coach.is_available ? 'available' : 'unavailable'}`}>
                    <i className={`bi ${coach.is_available ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                    {coach.is_available ? 'Disponible' : 'No disponible'}
                </div>
            </div>

            <div className="coach-card__content">
                <div className="coach-info-item">
                    <span className="coach-info-label">Tarifa por hora:</span>
                    <span className="coach-info-value rate">{formatRate(coach.hourly_rate)}</span>
                </div>

                <div className="coach-info-item">
                    <span className="coach-info-label">Experiencia:</span>
                    <span className="coach-info-value">{getExperienceText(coach.experience_years)}</span>
                </div>

                {coach.specialties && (
                    <div className="coach-info-item">
                        <span className="coach-info-label">Especialidades:</span>
                        <span className="coach-info-value">{coach.specialties}</span>
                    </div>
                )}

                {coach.description && (
                    <div className="coach-description">
                        <span className="coach-info-label">Descripción:</span>
                        <p className="coach-description-text">{coach.description}</p>
                    </div>
                )}
            </div>

            <div className="coach-card__actions">
                <button className="coach-action-btn details" onClick={onViewDetails} title="Ver detalles del entrenador">
                    <i className="bi bi-eye"></i>
                    Ver Detalles
                </button>

                <button className="coach-action-btn edit" onClick={onEdit} title="Editar entrenador">
                    <i className="bi bi-pencil"></i>
                    Editar
                </button>

                <button
                    className={`coach-action-btn toggle ${coach.is_available ? 'deactivate' : 'activate'}`}
                    onClick={onToggleAvailability}
                    title={coach.is_available ? 'Desactivar entrenador' : 'Activar entrenador'}>
                    <i className={`bi ${coach.is_available ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                    {coach.is_available ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    );
};
