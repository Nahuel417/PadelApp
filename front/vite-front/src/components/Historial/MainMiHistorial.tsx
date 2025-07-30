import { useEffect, useState } from 'react';
import CajaTurno from './CajaTurno';
import CajaThead from './CajaThead';
import './MainMiHistorial.css';
import { useUserStore } from '../../store/userStore';
import { Reservation } from '../../interfaces/reservationInterface';
import { fetchReservationsByUserId } from '../../services/reservation';

const MainMiHistorial = () => {
    const userActive = useUserStore((state) => state.userActive);
    const allUserAppointments = useUserStore((state) => state.userReservations);
    const setUserReservations = useUserStore((state) => state.setUserReservations);

    const [turnos, setTurnos] = useState<Reservation[]>([]);

    // useEffect para la peticion al back
    useEffect(() => {
        const fetchData = async () => {
            if (!userActive?.id) return;

            try {
                const data = await fetchReservationsByUserId(userActive.id);

                setTurnos(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    // useEffect para despachar los turnos
    useEffect(() => {
        setUserReservations(turnos);
    }, [turnos]);

    return (
        <>
            <main id="main">
                <div className="contenedor-main-historial">
                    <h3>Historial de Turnos</h3>
                    <hr className="linea-titulo" />

                    <p className="aviso">
                        Historial completo con todos los turnos realizados. <b>Recuerde que para cancelar un turno deberá hacerlo como maximo con 12hs de antelación.</b>
                    </p>

                    <div className="contenedor-turnos" id="contenedor-turnos">
                        <CajaThead />

                        {allUserAppointments?.length ? (
                            allUserAppointments.map((reserva) => {
                                return <CajaTurno key={reserva.id} reserva={reserva} />;
                            })
                        ) : (
                            <p className="ningun-turno">No se encontraron turnos realizados.</p>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default MainMiHistorial;
