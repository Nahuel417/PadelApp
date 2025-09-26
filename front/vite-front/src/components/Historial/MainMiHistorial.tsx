import { useCallback, useEffect, useMemo, useState } from 'react';
import CajaTurno from './CajaTurno/CajaTurno';
import CajaThead from './CajaThead/CajaThead';
import { useUserStore } from '../../store/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchReservationsByUserId } from '../../services/reservation';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { itemVariants, listVariants } from '../Animations/listVariants';
import Pagination from '../Pagination/Pagination';
import './MainMiHistorial.css';
import { ReservationStatus } from '../../utils/enums/reservationStatus.enum';
import { Reservation } from '../../interfaces/reservationInterface';
import FiltroReserva from '../Filtros/FiltroReservas/FiltroReserva';

interface ReservationsCache {
    [key: string]: {
        data: Reservation[];
        hasNextPage: boolean;
    };
}

const MainMiHistorial = () => {
    const userActive = useUserStore((state) => state.userActive);

    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const limit = 5;

    const [reservationsCache, setReservationsCache] = useState<ReservationsCache>({});
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [filtroAplicado, setFiltroAplicado] = useState<string>('');

    const reservasFiltradas = useMemo(() => {
        if (!filtroEstado) return reservations;

        return reservations.filter((r) => r.status === filtroEstado);
    }, [reservations, filtroEstado]);

    const handleCancelReservation = useCallback((id: string) => {
        // Actualizar cache local
        setReservationsCache((prev) => {
            const newCache = { ...prev };
            Object.keys(newCache).forEach((page) => {
                newCache[Number(page)] = {
                    ...newCache[Number(page)],
                    data: newCache[Number(page)].data.map((r) => (r.id === id ? { ...r, status: ReservationStatus.CANCELLED } : r)),
                };
            });
            return newCache;
        });

        // Actualizar estado local (solo página visible)
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: ReservationStatus.CANCELLED } : r)));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setReservationsCache({});
        setFiltroAplicado(filtroEstado);
    }, [filtroEstado]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userActive?.id) return;

            setLoading(true);
            setError(null);

            const cacheKey = `${currentPage}-${filtroEstado || 'all'}`;

            if (reservationsCache[cacheKey]) {
                setReservations(reservationsCache[cacheKey].data);
                setHasNextPage(reservationsCache[cacheKey].hasNextPage);
                setLoading(false);
                return;
            }

            try {
                const { data, hasNextPage } = await fetchReservationsByUserId(userActive.id, currentPage, limit, filtroAplicado || undefined);

                if (!data || data.length === 0) {
                    setError('No se encontraron reservas disponibles.');
                    setReservations([]);
                    setHasNextPage(false);
                } else {
                    setReservations(data);

                    // Guardar en cache local con hasNextPage
                    setReservationsCache((prev) => ({
                        ...prev,
                        [cacheKey]: { data, hasNextPage },
                    }));

                    setHasNextPage(hasNextPage);
                }

                setHasNextPage(hasNextPage);
            } catch (error) {
                setError('Ocurrió un error al cargar las reservas. Intenta nuevamente.');
                setReservations([]);
                setHasNextPage(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userActive, currentPage, filtroAplicado]);

    return (
        <>
            <main id="main">
                <div className="contenedor-main-historial">
                    <h3>Historial de Reservas</h3>
                    <hr className="linea-titulo" />

                    <p className="aviso">
                        Historial completo con todos las reservas realizadas. <b>Recuerde que para cancelar la reserva deberá hacerlo como maximo con 24hs de antelación.</b>
                    </p>

                    <div className="contenedor-turnos" id="contenedor-turnos">
                        <FiltroReserva estadoSeleccionado={filtroEstado} onChange={setFiltroEstado} />

                        <CajaThead />

                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <ErrorMessage message={error} width="100%" />
                        ) : reservasFiltradas?.length ? (
                            <motion.div className="contenedor-tabla" variants={listVariants} initial="hidden" animate="visible" exit="exit" layout>
                                <AnimatePresence mode="wait">
                                    {reservasFiltradas.map((reserva) => (
                                        <motion.div key={reserva.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
                                            <CajaTurno reserva={reserva} onCancel={handleCancelReservation} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Paginador */}
                                <Pagination currentPage={currentPage} hasNextPage={hasNextPage} onPageChange={setCurrentPage} />
                            </motion.div>
                        ) : (
                            <ErrorMessage message={error} width="100%" />
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default MainMiHistorial;
