import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userAppointments } from '../../redux/reducer';
import CajaTurno from './CajaTurno';
import CajaThead from './CajaThead';
import axios from 'axios';
import './MainMiHistorial.css';

const MainMiHistorial = () => {
    const allUserAppointments = useSelector((state) => state.userData.userAppointments);
    const [turnos, setTurnos] = useState([]);
    const userActive = useSelector((state) => state.userData.userActive);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            await axios.get(`http://localhost:3000/users/${userActive.user.id}`).then((res) => setTurnos(res.data.appointments));
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect para la peticion al back
    useEffect(() => {
        if (userActive !== null) {
            fetchData();
        } else {
            swal({
                title: '¡Error de autenticación!',
                text: 'Debe iniciar sesión para continuar',
                icon: 'warning',
            });
            navigate('/login');
        }
    }, [userActive, navigate]);

    // useEffect para despachar los turnos
    useEffect(() => {
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
                            allUserAppointments.map((turno) => {
                                return <CajaTurno key={turno.id} turno={turno} />;
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
