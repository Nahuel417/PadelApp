import { Reserve, ReserveStatus } from '../types/types';
import { STATUS_LABELS } from '../constants/constants';

/**
 * Formatea una fecha al formato DD/MM/YYYY
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Obtiene la etiqueta del estado
 */
export const getStatusLabel = (status: ReserveStatus): string => {
    return STATUS_LABELS[status] || status;
};

/**
 * Filtra reservas por estado
 */
export const filterReservesByStatus = (reserves: Reserve[], status: ReserveStatus | 'all'): Reserve[] => {
    if (status === 'all') return reserves;
    return reserves.filter((reserve) => reserve.status === status);
};

/**
 * Cuenta reservas pendientes
 */
export const countPendingReserves = (reserves: Reserve[]): number => {
    return reserves.filter((reserve) => reserve.status === 'pending').length;
};

/**
 * Ordena reservas por fecha descendente
 */
export const sortReservesByDate = (reserves: Reserve[]): Reserve[] => {
    return [...reserves].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
