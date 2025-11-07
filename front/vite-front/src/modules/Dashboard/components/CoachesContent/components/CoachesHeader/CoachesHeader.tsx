import React from 'react';
import './CoachesHeader.css';

export interface CoachesHeaderProps {
    title: string;
    totalCoaches: number;
    availableCoaches: number;
    onAddCoach?: () => void;
}

export const CoachesHeader: React.FC<CoachesHeaderProps> = ({
    title,
    totalCoaches,
    availableCoaches
}) => {
    return (
        <div className="coaches-header">
            <div className="coaches-header__info">
                <h1 className="coaches-header__title">{title}</h1>
                <div className="coaches-header__stats">
                    <div className="stat-item">
                        <span className="stat-value">{totalCoaches}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value active">{availableCoaches}</span>
                        <span className="stat-label">Disponibles</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value inactive">{totalCoaches - availableCoaches}</span>
                        <span className="stat-label">No disponibles</span>
                    </div>
                </div>
            </div>
            <div className="coaches-header__note">
                <div className="info-card">
                    <i className="bi bi-info-circle"></i>
                    <div className="info-content">
                        <p className="info-title">Gestión de Entrenadores</p>
                        <p className="info-text">Para agregar o quitar entrenadores, accede a la sección de <strong>Usuarios</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
