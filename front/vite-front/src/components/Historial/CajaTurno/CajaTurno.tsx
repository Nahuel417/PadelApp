import { useState } from 'react';
import { Reservation } from '../../../interfaces/reservationInterface';
import { cancelReservation } from '../../../services/reservation';
import { useUserStore } from '../../../store/userStore';
import { ReservationStatus } from '../../../utils/enums/reservationStatus.enum';
import './CajaTurno.css';

interface ReservaProps {
    reserva: Reservation;
}

const CajaTurno = ({ reserva }: ReservaProps) => {
    const { id, affair, court_id, coach, reservation_date, start_time, end_time, total_amount, status, payment_status } = reserva;
    const editUserReservation = useUserStore((state) => state.editUserReservation);
    const [estado, setEstado] = useState(status);

    const reservationStatus = ReservationStatus;
    const nombreCoach = coach?.user ? `${coach.user.first_name} ${coach.user.last_name}` : '-- --';
    const horario = `${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}`;

    const estadoMap = {
        confirmed: 'Confirmada',
        pending: 'Pago Pendiente',
        cancelled: 'Cancelada',
    };
    // Obtener el estado traducido y color
    const estadoInfo = estadoMap[estado];

    const postFunctionLogin = async () => {
        try {
            const appointmentData: Reservation = await cancelReservation(id);

            setEstado(reservationStatus.CANCELLED);
            editUserReservation(appointmentData.id, reservationStatus.CANCELLED, appointmentData.cancelled_at);
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
                title: 'No se pudo cancelar la reserva',
                text: 'Solo pueden ser canceladas con 24hs de antelación',
                icon: 'error',
                // @ts-ignore
                button: 'Aceptar',
            });
        }
    };

    return (
        <div className={`caja-turno ${estado}`}>
            <div className="col-fecha">
                <span>{reservation_date.split('-').reverse().join('/')}</span>
            </div>
            <div className="col-horario">
                <span>{horario}</span>
            </div>
            <div className="col-asunto">
                <span>{affair}</span>
            </div>
            <div className="col-cancha">
                <span>{`Cancha ${court_id}`}</span>
            </div>
            <div className="col-estado">
                <span className={`span-estado ${estado}`}>{estadoInfo}</span>
            </div>
            <div className="col-precio">
                <span>{`$${total_amount}`}</span>
            </div>
            <div className="col-entrenador">
                <span>{nombreCoach}</span>
            </div>
            <div className="col-cancelar">
                <button className={estado !== reservationStatus.CANCELLED ? 'boton-cancelar' : 'boton-cancelado'} onClick={cambiarEstado} disabled={estado === reservationStatus.CANCELLED}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default CajaTurno;
