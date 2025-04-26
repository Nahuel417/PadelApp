import { useEffect, useState } from 'react';
import { editUserAppointment } from '../../redux/reducer';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const CajaTurno = ({ turno: { id, asunto, fecha, horario, cancha, entrenador, status } }) => {
    const [estado, setEstado] = useState(status);
    const dispatch = useDispatch();

    const postFunctionLogin = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/appointments/cancel/${id}`);
            const appointmentData = response.data;

            dispatch(editUserAppointment({ id: appointmentData.id, status: 'cancelado' }));
            setEstado('cancelado');
        } catch (error) {
            swal({
                title: '¡Error!',
                text: 'No se puedo cancelar el turno',
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };

    const cambiarEstado = () => {
        // validacion de cancelacion de turno (solo hasta un dia de la reseva del turno)
        const fechaActual = new Date().toISOString().split('T')[0];
        const fechaTurno = new Date(fecha);
        const UltimoDia = new Date(fechaTurno);
        UltimoDia.setDate(fechaTurno.getDate() - 1);
        const UltimoDiaString = UltimoDia.toISOString().split('T')[0];

        if (fechaActual <= UltimoDiaString) {
            swal({
                title: '¿Desea Cancelar el turno?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((turnoCancelado) => {
                if (turnoCancelado) {
                    swal({
                        title: '¡Turno Cancelado!',
                        icon: 'success',
                    });
                    postFunctionLogin();
                }
            });
        } else {
            swal({
                title: 'No se pudo cancelar el turno.',
                text: 'Solo pueden ser cancelados hasta el día anterior a la reserva.',
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };

    return (
        <div className="caja-turno">
            <div>
                <span>{fecha}</span>
            </div>
            <div>
                <span>{horario}</span>
            </div>
            <div>
                <span>{asunto}</span>
            </div>
            <div>
                <span>{cancha}</span>
            </div>
            <div className={`caja-spanEstado ${estado}`}>
                <span className={`span-estado ${estado}`}>{estado}</span>
            </div>
            <div className="caja-entrenador">
                <span>{entrenador}</span>
            </div>
            <div>
                <button className={estado !== 'cancelado' ? 'boton-cancelar' : 'boton-cancelado'} onClick={() => cambiarEstado()} disabled={estado === 'cancelado'}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default CajaTurno;
