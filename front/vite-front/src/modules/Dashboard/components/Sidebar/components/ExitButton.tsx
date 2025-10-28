import React from 'react';
import { ExitButtonProps } from '../types/types';

export const ExitButton: React.FC<ExitButtonProps> = ({ isCollapsed, onExit }) => {
    return (
        <button className="exit-dashboard-btn" onClick={onExit} title="Volver a la página principal" aria-label="Volver a la página principal">
            <span className="exit-dashboard-icon">
                <i className="bi bi-arrow-bar-left"></i>
            </span>
            <span className="exit-dashboard-label">Volver</span>
        </button>
    );
};
