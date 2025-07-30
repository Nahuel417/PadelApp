import { useState } from 'react';
import { Reservation } from '../../interfaces/reservationInterface';
import { cancelReservation } from '../../services/reservation';
import { useUserStore } from '../../store/userStore';
import { ReservationStatus } from '../../utils/reservationStatus.enum';

interface ReservaProps {
    reserva: Reservation;
}

const CajaTurno = ({ reserva }: ReservaProps) => {
    const { id, affair, user_id, court_id, coach_id, reservation_date, start_time, end_time, total_amount, status, payment_status } = reserva;
    const editUserReservation = useUserStore((state) => state.editUserReservation);
    const [estado, setEstado] = useState(status);

    const reservationStatus = ReservationStatus;
    const horario = `${start_time} - ${end_time}`;

    const postFunctionLogin = async () => {
        try {
            const appointmentData: Reservation = await cancelReservation(id);
            const cancelled_at = new Date().toISOString();

            setEstado(reservationStatus.CANCELLED);
            editUserReservation(appointmentData.id, reservationStatus.CANCELLED, cancelled_at);
        } catch (error) {
            swal({
                title: '¡Error!',
                text: 'No se puedo cancelar el turno',
                icon: 'error',
                // @ts-ignore
                button: 'Aceptar',
            });
        }
    };

    const cambiarEstado = () => {
        // validacion de cancelacion de turno (solo hasta un dia de la reseva del turno)
        const fechaActual = new Date().toISOString().split('T')[0];
        const fechaTurno = new Date(reservation_date);
        const UltimoDia = new Date(fechaTurno);
        UltimoDia.setDate(fechaTurno.getDate() - 1);
        const UltimoDiaString = UltimoDia.toISOString().split('T')[0];

        if (fechaActual <= UltimoDiaString) {
            swal({
                title: '¿Desea Cancelar el turno?',
                icon: 'warning',
                // @ts-ignore
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
                // @ts-ignore
                button: 'Aceptar',
            });
        }
    };

    return (
        <div className="caja-turno">
            <div>
                <span>{reservation_date}</span>
            </div>
            <div>
                <span>{horario}</span>
            </div>
            <div>
                <span>{affair}</span>
            </div>
            <div>
                <span>{`Cancha ${court_id}`}</span>
            </div>
            <div className={`caja-spanEstado ${estado}`}>
                <span className={`span-estado ${estado}`}>{estado}</span>
            </div>
            <div className="caja-entrenador">
                <span>{`Entrenador ${coach_id}`}</span>
            </div>
            <div>
                <button
                    className={estado !== reservationStatus.CANCELLED ? 'boton-cancelar' : 'boton-cancelado'}
                    onClick={() => cambiarEstado()}
                    disabled={estado === reservationStatus.CANCELLED}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default CajaTurno;
