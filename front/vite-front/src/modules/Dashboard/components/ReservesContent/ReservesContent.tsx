import React, { useState, useMemo, useCallback } from 'react';
import './ReservesContent.css';
import Swal from 'sweetalert';
import { ReservesContentProps, ReserveStatus, Reserve } from './types/types';
import { filterReservesByStatus, countPendingReserves, countCancelledReserves, countConfirmedReserves, sortReservesByDate } from './utils/reserveUtils';
import { ReserveHeader, ReserveFilters, ReserveList, ReservesMetricsSection, ReserveDetailsModal } from './components';
import { DateFilter } from '../../../../shared';
import { useDashboardReserves } from '../../hooks/useDashboardReserves';
import { cancelReservation } from '../../../../services/reservation';

const ReservesContent: React.FC<ReservesContentProps> = ({ userRole = 'admin' }) => {
    const [selectedStatus, setSelectedStatus] = useState<ReserveStatus | 'all'>('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedReserve, setSelectedReserve] = useState<Reserve | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Contar reservas
    const pendingCount = useMemo(() => countPendingReserves(sortedReserves), [sortedReserves]);
    const cancelledCount = useMemo(() => countCancelledReserves(sortedReserves), [sortedReserves]);
    const confirmedCount = useMemo(() => countConfirmedReserves(sortedReserves), [sortedReserves]);

    // Preparar métricas con reservas filtradas
    const metricsReserves = useMemo(() => filteredReserves.slice(0, 60), [filteredReserves]);

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
            const reserve = rawReserves.find((r) => r.id === id);
            if (!reserve) return;

            Swal({
                title: '¿Cancelar reserva?',
                text: `¿Estás seguro de que deseas cancelar esta reserva? ${reserve.status === 'confirmed' ? `Se restará $${reserve.total_amount?.toFixed(2) || '0.00'} del ingreso.` : ''}`,
                icon: 'warning',
                buttons: {
                    cancel: {
                        text: 'No, mantener',
                        value: false,
                        visible: true,
                    },
                    confirm: {
                        text: 'Sí, cancelar',
                        value: true,
                        visible: true,
                    },
                },
                dangerMode: true,
            }).then(async (willCancel: boolean) => {
                if (willCancel) {
                    try {
                        await cancelReservation(id);
                        await refetch();
                        Swal({
                            title: 'Cancelada',
                            text: 'La reserva ha sido cancelada exitosamente.',
                            icon: 'success',
                            timer: 2000,
                        });
                    } catch (error) {
                        console.error('Error al cancelar reserva:', error);
                        Swal({
                            title: 'Error',
                            text: 'No se pudo cancelar la reserva. Intenta de nuevo.',
                            icon: 'error',
                        });
                    }
                }
            });
        },
        [rawReserves, refetch]
    );

    const handleViewDetails = useCallback((reserve: Reserve) => {
        setSelectedReserve(reserve);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedReserve(null);
    }, []);

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
            <ReserveHeader
                title="Panel de Reservas"
                totalReserves={sortedReserves.length}
                confirmedReserves={confirmedCount}
                pendingReserves={pendingCount}
                cancelledReserves={cancelledCount}
            />

            <div className="reserves-filters-container">
                <ReserveFilters selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
                <DateFilter selectedDate={selectedDate || undefined} onDateChange={setSelectedDate} placeholder="Filtrar por fecha" className="reserves-date-filter" />
            </div>

            <ReserveList
                reserves={filteredReserves}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                onPageChange={onPageChange}
            />

            <ReservesMetricsSection reserves={metricsReserves} isLoading={isLoading} />

            <ReserveDetailsModal isOpen={isModalOpen} reserve={selectedReserve} onClose={handleCloseModal} />
        </div>
    );
};

export default ReservesContent;
