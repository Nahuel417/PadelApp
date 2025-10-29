import React from 'react';
import './ReserveTableHeader.css';

export const ReserveTableHeader: React.FC = () => {
    return (
        <div className="reserve-table-header">
            <div className="reserve-col reserve-col-date">
                <span>Fecha</span>
            </div>
            <div className="reserve-col reserve-col-time">
                <span>Horario</span>
            </div>
            <div className="reserve-col reserve-col-court">
                <span>Cancha</span>
            </div>
            <div className="reserve-col reserve-col-user">
                <span>Usuario</span>
            </div>
            <div className="reserve-col reserve-col-trainer">
                <span>Entrenador</span>
            </div>
            <div className="reserve-col reserve-col-price">
                <span>Precio</span>
            </div>
            <div className="reserve-col reserve-col-status">
                <span>Estado</span>
            </div>
            <div className="reserve-col reserve-col-actions">
                <span>Acciones</span>
            </div>
        </div>
    );
};
