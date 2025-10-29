import React from 'react';
import './ReserveFilters.css';
import { ReserveFiltersProps, ReserveStatus } from '../../types/types';

export const ReserveFilters: React.FC<ReserveFiltersProps> = ({ selectedStatus, onStatusChange }) => {
    const statuses: Array<ReserveStatus | 'all'> = ['all', 'pending', 'confirmed', 'cancelled'];
    const statusLabels: Record<string, string> = {
        all: 'Todas',
        pending: 'Pendientes',
        confirmed: 'Confirmadas',
        cancelled: 'Canceladas',
    };

    return (
        <div className="reserve-filters">
            {statuses.map((status) => (
                <button key={status} className={`reserve-filter-btn ${selectedStatus === status ? 'active' : ''}`} onClick={() => onStatusChange(status)}>
                    {statusLabels[status]}
                </button>
            ))}
        </div>
    );
};
