import React from 'react';
import './ReserveList.css';
import { ReserveListProps } from '../../types/types';
import { ReserveTableHeader } from '../ReserveTableHeader/ReserveTableHeader';
import { ReserveRow } from '../ReserveRow/ReserveRow';

export const ReserveList: React.FC<ReserveListProps> = ({ reserves, onApprove, onReject, onCancel, isLoading }) => {
    if (isLoading) {
        return (
            <div className="reserve-list-loading">
                <p>Cargando reservas...</p>
            </div>
        );
    }

    if (reserves.length === 0) {
        return (
            <div className="reserve-list-empty">
                <i className="bi bi-inbox"></i>
                <p>No hay reservas para mostrar</p>
            </div>
        );
    }

    return (
        <div className="reserve-table-container">
            <ReserveTableHeader />
            <div className="reserve-table">
                {reserves.map((reserve) => (
                    <ReserveRow
                        key={reserve.id}
                        reserve={reserve}
                        onApprove={onApprove}
                        onReject={onReject}
                        onCancel={onCancel}
                    />
                ))}
            </div>
        </div>
    );
};
