import React from 'react';
import './ReserveHeader.css';
import { ReserveHeaderProps } from '../../types/types';

export const ReserveHeader: React.FC<ReserveHeaderProps> = ({ title, totalReserves, pendingReserves }) => {
    return (
        <div className="reserve-header">
            <div className="reserve-header-content">
                <h2 className="reserve-title">{title}</h2>
                <div className="reserve-stats">
                    <span className="reserve-stat">
                        <strong>{totalReserves}</strong> Total
                    </span>
                    <span className="reserve-stat separator">•</span>
                    <span className="reserve-stat pending">
                        <strong>{pendingReserves}</strong> Pendientes
                    </span>
                </div>
            </div>
        </div>
    );
};
