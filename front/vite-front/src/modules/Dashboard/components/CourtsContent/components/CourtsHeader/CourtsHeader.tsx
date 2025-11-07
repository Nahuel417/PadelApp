import React from 'react';
import './CourtsHeader.css';

export interface CourtsHeaderProps {
    title: string;
    totalCourts: number;
    activeCourts: number;
    onAddCourt: () => void;
}

export const CourtsHeader: React.FC<CourtsHeaderProps> = ({
    title,
    totalCourts,
    activeCourts,
    onAddCourt
}) => {
    return (
        <div className="courts-header">
            <div className="courts-header__info">
                <h1 className="courts-header__title">{title}</h1>
                <div className="courts-header__stats">
                    <div className="stat-item">
                        <span className="stat-value">{totalCourts}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value active">{activeCourts}</span>
                        <span className="stat-label">Activas</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value inactive">{totalCourts - activeCourts}</span>
                        <span className="stat-label">Inactivas</span>
                    </div>
                </div>
            </div>
            <div className="courts-header__actions">
                <button 
                    className="add-court-btn"
                    onClick={onAddCourt}
                    type="button"
                >
                    <i className="bi bi-plus-circle"></i>
                    Agregar Cancha
                </button>
            </div>
        </div>
    );
};
