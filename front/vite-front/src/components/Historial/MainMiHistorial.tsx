import { useEffect, useState } from 'react';
import CajaTurno from './CajaTurno/CajaTurno';
import CajaThead from './CajaThead/CajaThead';
import { useUserStore } from '../../store/userStore';
import { motion } from 'framer-motion';
import { fetchReservationsByUserId } from '../../services/reservation';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './MainMiHistorial.css';
import { listVariants } from '../Animations/listVariants';

const MainMiHistorial = () => {
    const userActive = useUserStore((state) => state.userActive);
    const allUserAppointments = useUserStore((state) => state.userReservations);
    const setUserReservations = useUserStore((state) => state.setUserReservations);

    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect para la peticion al back
    useEffect(() => {
        const fetchData = async () => {
            if (!userActive?.id) return;

            setLoading(true);
            setError(null);

            if (!allUserAppointments || allUserAppointments.length === 0) {
                try {
                    const data = await fetchReservationsByUserId(userActive.id);
                    console.log(data);

                    if (!data || data.length === 0) {
                        setError('No se encontraron reservas disponibles.');
                        setUserReservations([]);
                    } else {
                        setUserReservations(data);
                    }
                } catch (error) {
                    setError('Ocurrió un error al cargar las reservas. Intenta nuevamente.');
                    setUserReservations([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [userActive, setUserReservations]);

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
                        <CajaThead />

                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <ErrorMessage message={error} width="100%" />
                        ) : allUserAppointments?.length ? (
                            <motion.div className="contenedor-tabla" variants={listVariants} initial="hidden" animate="visible" exit="exit">
                                {allUserAppointments.map((reserva) => (
                                    <CajaTurno key={reserva.id} reserva={reserva} />
                                ))}
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
