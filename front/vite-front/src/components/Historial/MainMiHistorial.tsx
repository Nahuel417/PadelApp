import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userAppointments } from '../../redux/reducer';
import CajaTurno from './CajaTurno';
import CajaThead from './CajaThead';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './MainMiHistorial.css';
import { RootState } from '../../redux/store';
import { useUserStore } from '../../store/userStore';
import { Reservation } from '../../interfaces/reservationInterface';

const MainMiHistorial = () => {
    const userActive = useUserStore((state) => state.userActive);
    const allUserAppointments = useSelector((state: RootState) => state.userData.userAppointments);
    // const userReservations = useUserStore((state) => state.userReservations);
    // const setUserReservations = useUserStore((state) => state.setUserReservations);
    // const [turnos, setTurnos] = useState([]);
    const [turnos, setTurnos] = useState<Reservation[]>([]);

    const dispatch = useDispatch();

    // useEffect para la peticion al back
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`http://localhost:3000/users/${userActive?.id}`).then((res) => setTurnos(res.data.appointments));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    // useEffect para despachar los turnos
    useEffect(() => {
        // setUserReservations(turnos);
        dispatch(userAppointments(turnos));
    }, [dispatch, turnos]);

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
