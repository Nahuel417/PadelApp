import React, { useState, useMemo, useCallback } from 'react';
import './ReservesContent.css';
import { ReservesContentProps, ReserveStatus } from './types/types';
import { filterReservesByStatus, countPendingReserves, sortReservesByDate } from './utils/reserveUtils';
import { ReserveHeader, ReserveFilters, ReserveList } from './components';
import { DateFilter } from '../../../../shared';
import { useDashboardReserves } from '../../hooks/useDashboardReserves';

const ReservesContent: React.FC<ReservesContentProps> = ({ userRole = 'admin' }) => {
    const [selectedStatus, setSelectedStatus] = useState<ReserveStatus | 'all'>('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Hook personalizado para manejar estado de reservas del dashboard
    const { reserves: rawReserves, isLoading, error, hasNextPage, currentPage, onPageChange, refetch, setStatusFilter } = useDashboardReserves();

    // Procesar y ordenar reservas
    const sortedReserves = useMemo(() => sortReservesByDate(rawReserves), [rawReserves]);

    // Filtrar reservas por estado y fecha
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

    // Contar reservas pendientes
    const pendingCount = useMemo(() => countPendingReserves(sortedReserves), [sortedReserves]);

    // Handler para cambio de filtro de estado
    const handleStatusChange = useCallback(
        (status: ReserveStatus | 'all') => {
            setSelectedStatus(status);
            setStatusFilter(status === 'all' ? undefined : status);
        },
        [setStatusFilter]
    );

    // Handlers para acciones
    const handleApprove = useCallback(
        async (id: string) => {
            try {
                console.log('Aprobar reserva:', id);
                // TODO: Implementar lógica de aprobación con servicio
                await refetch(); // Recargar datos después de la acción
            } catch (error) {
                console.error('Error al aprobar reserva:', error);
            }
        },
        [refetch]
    );

    const handleReject = useCallback(
        async (id: string) => {
            try {
                console.log('Rechazar reserva:', id);
                // TODO: Implementar lógica de rechazo con servicio
                await refetch(); // Recargar datos después de la acción
            } catch (error) {
                console.error('Error al rechazar reserva:', error);
            }
        },
        [refetch]
    );

    const handleCancel = useCallback(
        async (id: string) => {
            try {
                console.log('Cancelar reserva:', id);
                // TODO: Implementar lógica de cancelación con servicio
                await refetch(); // Recargar datos después de la acción
            } catch (error) {
                console.error('Error al cancelar reserva:', error);
            }
        },
        [refetch]
    );

    // Mostrar error si existe
    if (error) {
        return (
            <div className="reserves-content">
                <div className="error-container">
                    <h3>Error al cargar reservas</h3>
                    <p>{error}</p>
                    <button onClick={refetch} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reserves-content">
            <ReserveHeader title="Panel de Reservas" totalReserves={sortedReserves.length} pendingReserves={pendingCount} />

            <div className="reserves-filters-container">
                <ReserveFilters selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
                <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} placeholder="Filtrar por fecha" className="reserves-date-filter" />
            </div>

            <ReserveList
                reserves={filteredReserves}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
                isLoading={isLoading}
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default ReservesContent;
