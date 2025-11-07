import React from 'react';
import './CourtsList.css';
import { Court } from '../../../../../../services/courts';
import { CourtCard } from '../CourtCard/CourtCard';

export interface CourtsListProps {
    courts: Court[];
    isLoading: boolean;
    onEditCourt: (court: Court) => void;
    onToggleStatus: (court: Court) => void;
}

export const CourtsList: React.FC<CourtsListProps> = ({
    courts,
    isLoading,
    onEditCourt,
    onToggleStatus
}) => {
    if (isLoading) {
        return (
            <div className="courts-list">
                <div className="courts-list__loading">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="court-card-skeleton">
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

    if (courts.length === 0) {
        return (
            <div className="courts-list">
                <div className="courts-list__empty">
                    <div className="empty-icon">
                        <i className="bi bi-building"></i>
                    </div>
                    <h3>No hay canchas registradas</h3>
                    <p>Comienza agregando tu primera cancha al sistema</p>
                </div>
            </div>
        );
    }

    return (
        <div className="courts-list">
            <div className="courts-list__grid">
                {courts.map((court) => (
                    <CourtCard
                        key={court.id}
                        court={court}
                        onEdit={() => onEditCourt(court)}
                        onToggleStatus={() => onToggleStatus(court)}
                    />
                ))}
            </div>
        </div>
    );
};
