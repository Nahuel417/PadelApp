import React from 'react';
import './ReserveList.css';
import { ReserveListProps } from '../../types/types';
import { ReserveTableHeader } from '../ReserveTableHeader/ReserveTableHeader';
import { ReserveRow } from '../ReserveRow/ReserveRow';
import { Pagination, Spinner } from '../../../../../../shared';

export const ReserveList: React.FC<ReserveListProps> = ({ reserves, onApprove, onReject, onCancel, onViewDetails, isLoading, currentPage = 1, hasNextPage, onPageChange }) => {
    if (isLoading && reserves.length === 0) {
        return (
            <div className="reserve-list-loading">
                <Spinner />
            </div>
        );
    }

    if (reserves.length === 0) {
        return (
            <div className="reserve-list-empty">
                <div className="reserve-empty-icon">
                    <i className="bi bi-inbox"></i>
                </div>
                <div className="reserve-empty-content">
                    <h3>No se registran reservas</h3>
                    <p>Ajustá los filtros o revisá más tarde para ver nuevas solicitudes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reserve-table-container">
            <ReserveTableHeader />
            <div className="reserve-table">
                {reserves.map((reserve) => (
                    <ReserveRow key={reserve.id} reserve={reserve} onApprove={onApprove} onReject={onReject} onCancel={onCancel} onViewDetails={onViewDetails} />
                ))}
            </div>

            {/* Paginación */}
            {onPageChange && <Pagination currentPage={currentPage} hasNextPage={hasNextPage || false} onPageChange={onPageChange} />}
        </div>
    );
};
