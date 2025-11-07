import React from 'react';
import './CoachesList.css';
import { Coach } from '../../../../../../services/coaches';
import { CoachCard } from '../CoachCard/CoachCard';

export interface CoachesListProps {
    coaches: Coach[];
    isLoading: boolean;
    onEditCoach: (coach: Coach) => void;
    onToggleAvailability: (coach: Coach) => void;
    onViewDetails: (coach: Coach) => void;
}

export const CoachesList: React.FC<CoachesListProps> = ({
    coaches,
    isLoading,
    onEditCoach,
    onToggleAvailability,
    onViewDetails
}) => {
    if (isLoading) {
        return (
            <div className="coaches-list">
                <div className="coaches-list__loading">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="coach-card-skeleton">
                            <div className="skeleton-header"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                            </div>
                            <div className="skeleton-actions"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (coaches.length === 0) {
        return (
            <div className="coaches-list">
                <div className="coaches-list__empty">
                    <div className="empty-icon">
                        <i className="bi bi-person-badge"></i>
                    </div>
                    <h3>No hay entrenadores registrados</h3>
                    <p>Comienza agregando tu primer entrenador al sistema</p>
                </div>
            </div>
        );
    }

    return (
        <div className="coaches-list">
            <div className="coaches-list__grid">
                {coaches.map((coach) => (
                    <CoachCard
                        key={coach.id}
                        coach={coach}
                        onEdit={() => onEditCoach(coach)}
                        onToggleAvailability={() => onToggleAvailability(coach)}
                        onViewDetails={() => onViewDetails(coach)}
                    />
                ))}
            </div>
        </div>
    );
};
