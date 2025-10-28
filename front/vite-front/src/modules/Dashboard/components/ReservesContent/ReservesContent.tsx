import React, { useState, useMemo, useCallback } from 'react';
import './ReservesContent.css';
import { ReservesContentProps, ReserveStatus } from './types/types';
import { MOCK_RESERVES } from './constants/constants';
import { filterReservesByStatus, countPendingReserves, sortReservesByDate } from './utils/reserveUtils';
import { ReserveHeader, ReserveFilters, ReserveList } from './components';
import { DateFilter } from '../../../../shared';

const ReservesContent: React.FC<ReservesContentProps> = ({ userRole = 'admin' }) => {
    const [selectedStatus, setSelectedStatus] = useState<ReserveStatus | 'all'>('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isLoading] = useState(false);

    const sortedReserves = useMemo(() => sortReservesByDate(MOCK_RESERVES), []);

    const filteredReserves = useMemo(() => {
        let reserves = filterReservesByStatus(sortedReserves, selectedStatus);

        // Filtrar por fecha si hay una fecha seleccionada
        if (selectedDate) {
            reserves = reserves.filter((reserve) => {
                const reserveDate = new Date(reserve.date);
                const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                const reserveDateOnly = new Date(reserveDate.getFullYear(), reserveDate.getMonth(), reserveDate.getDate());
                return reserveDateOnly.getTime() === selectedDateOnly.getTime();
            });
        }

        return reserves;
    }, [sortedReserves, selectedStatus, selectedDate]);

    const pendingCount = useMemo(() => countPendingReserves(sortedReserves), [sortedReserves]);

    const handleApprove = useCallback((id: string) => {
        console.log('Aprobar reserva:', id);
        // TODO: Implementar lógica de aprobación
    }, []);

    const handleReject = useCallback((id: string) => {
        console.log('Rechazar reserva:', id);
        // TODO: Implementar lógica de rechazo
    }, []);

    const handleCancel = useCallback((id: string) => {
        console.log('Cancelar reserva:', id);
        // TODO: Implementar lógica de cancelación
    }, []);

    return (
        <div className="reserves-content">
            <ReserveHeader title="Panel de Reservas" totalReserves={sortedReserves.length} pendingReserves={pendingCount} />

            <div className="reserves-filters-container">
                <ReserveFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
                <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} placeholder="Filtrar por fecha" className="reserves-date-filter" />
            </div>

            <ReserveList reserves={filteredReserves} onApprove={handleApprove} onReject={handleReject} onCancel={handleCancel} isLoading={isLoading} />
        </div>
    );
};

export default ReservesContent;
