import { useState, useEffect, useCallback } from 'react';
import { Reserve } from '../components/ReservesContent';
import { fetchAllReservations } from '../../../services/reservation';

// Interfaces para tipado fuerte
export interface DashboardReservation {
    id: string;
    user_id: string;
    court_id: string;
    coach_id?: string;
    reservation_date: string;
    start_time: string;
    end_time: string;
    affair: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'approved' | 'rejected';
    total_price: number;
    notes?: string;
    created_at: string;
    updated_at: string;
    court?: {
        id: string;
        name: string;
        surface_type: string;
    };
    coach?: {
        id: string;
        user: {
            first_name: string;
            last_name: string;
        };
    };
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

// Re-exportar Reserve desde el módulo de dashboard para consistencia

export interface UseDashboardReservesState {
    reserves: Reserve[];
    isLoading: boolean;
    error: string | null;
    hasNextPage: boolean;
    currentPage: number;
    loadMore: () => Promise<void>;
    onPageChange: (page: number) => Promise<void>;
    refetch: () => Promise<void>;
    setStatusFilter: (status: string | undefined) => void;
}

/**
 * Hook personalizado para manejar las reservas del dashboard
 * Principio de responsabilidad única: Solo maneja el estado de reservas del dashboard
 * Principio de abierto/cerrado: Extensible para agregar más funcionalidades
 */
export const useDashboardReserves = (): UseDashboardReservesState => {
    const [reserves, setReserves] = useState<Reserve[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    /**
     * Función para obtener las reservas desde Supabase
     * Principio de inversión de dependencias: Depende de abstracción (servicio), no de implementación
     */
    const fetchReserves = useCallback(
        async (page = 1, append = false): Promise<void> => {
            try {
                if (!append) {
                    setIsLoading(true);
                }
                setError(null);

                const result = await fetchAllReservations(page, 10, statusFilter);

                // Transformar datos para mantener consistencia con el formato esperado
                const transformedData: Reserve[] = result.data.map((reserve: any) => ({
                    id: reserve.id,
                    courtName: reserve.court?.name || 'Cancha no especificada',
                    date: reserve.reservation_date,
                    startTime: reserve.start_time,
                    endTime: reserve.end_time,
                    userName: `${reserve.user.first_name} ${reserve.user.last_name}`,
                    status: reserve.status as Reserve['status'],
                    total_amount: reserve.total_amount || 0,
                    trainerName: reserve.coach?.user ? `${reserve.coach.user.first_name} ${reserve.coach.user.last_name}` : undefined,
                }));

                if (append) {
                    setReserves((prev) => [...prev, ...transformedData]);
                } else {
                    setReserves(transformedData);
                }

                setHasNextPage(result.hasNextPage);
                setCurrentPage(page);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar reservas';
                setError(errorMessage);
                console.error('Error fetching dashboard reserves:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [statusFilter]
    );

    // Cargar reservas iniciales
    useEffect(() => {
        fetchReserves(1, false);
    }, [fetchReserves]);

    // Recargar cuando cambia el filtro de estado
    useEffect(() => {
        setCurrentPage(1);
        fetchReserves(1, false);
    }, [statusFilter]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (hasNextPage && !isLoading) {
            await fetchReserves(currentPage + 1, true);
        }
    }, [hasNextPage, isLoading, currentPage, fetchReserves]);

    const onPageChange = useCallback(
        async (page: number): Promise<void> => {
            await fetchReserves(page, false);
        },
        [fetchReserves]
    );

    const refetch = useCallback(async (): Promise<void> => {
        setCurrentPage(1);
        await fetchReserves(1, false);
    }, [fetchReserves]);

    const handleStatusFilterChange = useCallback((status: string | undefined) => {
        setStatusFilter(status);
    }, []);

    return {
        reserves,
        isLoading,
        error,
        hasNextPage,
        currentPage,
        loadMore,
        onPageChange,
        refetch,
        setStatusFilter: handleStatusFilterChange,
    };
};
