import React from 'react';
import './ClassTableHeader.css';

export const ClassTableHeader: React.FC = () => {
    return (
        <div className="class-table-header">
            <div className="class-col class-col-date">
                <span>Fecha</span>
            </div>
            <div className="class-col class-col-time">
                <span>Horario</span>
            </div>
            <div className="class-col class-col-court">
                <span>Cancha</span>
            </div>
            <div className="class-col class-col-user">
                <span>Alumno</span>
            </div>
            <div className="class-col class-col-affair">
                <span>Motivo</span>
            </div>
            <div className="class-col class-col-price">
                <span>Precio</span>
            </div>
            <div className="class-col class-col-status">
                <span>Estado</span>
            </div>
            <div className="class-col class-col-actions">
                <span>Acciones</span>
            </div>
        </div>
    );
};
