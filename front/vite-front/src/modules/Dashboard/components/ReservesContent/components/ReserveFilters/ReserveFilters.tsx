import React, { useMemo } from 'react';
import './ReserveFilters.css';
import { ReserveFiltersProps, ReserveStatus } from '../../types/types';
import FilterChips, { FilterChipOption } from '../../../../../../shared/components/Filters/FilterChips/FilterChips';

const STATUS_OPTIONS: Array<ReserveStatus | 'all'> = ['all', 'pending', 'confirmed', 'cancelled'];
const STATUS_LABELS: Record<ReserveStatus | 'all', string> = {
    all: 'Todas',
    pending: 'Pendientes',
    confirmed: 'Confirmadas',
    completed: 'Completadas',
    cancelled: 'Canceladas',
};

export const ReserveFilters: React.FC<ReserveFiltersProps> = ({ selectedStatus, onStatusChange }) => {
    const filterOptions: FilterChipOption[] = useMemo(
        () => STATUS_OPTIONS.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
        []
    );

    const handleChange = (value: string) => {
        const nextStatus = (value || 'all') as ReserveStatus | 'all';
        onStatusChange(nextStatus);
    };

    return (
        <div className="reserve-filters">
            <FilterChips selectedValue={selectedStatus} onChange={handleChange} options={filterOptions} className="reserve-filter-chips" />
        </div>
    );
};
