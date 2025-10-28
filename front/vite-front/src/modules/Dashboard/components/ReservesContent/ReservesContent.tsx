import React, { useState, useMemo, useCallback } from 'react';
import './ReservesContent.css';
import { ReservesContentProps, ReserveStatus } from './types/types';
import { MOCK_RESERVES } from './constants/constants';
import { filterReservesByStatus, countPendingReserves, sortReservesByDate } from './utils/reserveUtils';
import { ReserveHeader, ReserveFilters, ReserveList } from './components';

const ReservesContent: React.FC<ReservesContentProps> = ({ userRole = 'admin' }) => {
    const [selectedStatus, setSelectedStatus] = useState<ReserveStatus | 'all'>('all');
    const [isLoading] = useState(false);

    const sortedReserves = useMemo(() => sortReservesByDate(MOCK_RESERVES), []);

    const filteredReserves = useMemo(
        () => filterReservesByStatus(sortedReserves, selectedStatus),
        [sortedReserves, selectedStatus]
    );

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
            <ReserveHeader title="Gestión de Reservas" totalReserves={sortedReserves.length} pendingReserves={pendingCount} />

            <ReserveFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

            <ReserveList
                reserves={filteredReserves}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ReservesContent;
