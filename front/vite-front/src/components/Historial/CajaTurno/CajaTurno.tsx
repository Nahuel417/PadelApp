import React, { useMemo, useState } from 'react';
import { Reservation } from '../../../interfaces/reservationInterface';
import { cancelReservation } from '../../../services/reservation';
import { ReservationStatus } from '../../../utils/enums/reservationStatus.enum';
import './CajaTurno.css';

interface ReservaProps {
    reserva: Reservation;
    onCancel?: (id: string) => void;
}

const ESTADO_MAP = {
    confirmed: 'Confirmada',
    pending: 'Pago Pendiente',
    cancelled: 'Cancelada',
};

const CajaTurno = ({ reserva, onCancel }: ReservaProps) => {
    const { id, affair, court_id, coach, reservation_date, start_time, end_time, total_amount, status, payment_status } = reserva;
    const [estado, setEstado] = useState(status);

    const reservationStatus = ReservationStatus;

    const nombreCoach = useMemo(() => (coach?.user ? `${coach.user.first_name} ${coach.user.last_name}` : '-- --'), [coach]);

    const horario = useMemo(() => `${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}`, [start_time, end_time]);

    // Obtener el estado traducido y color
    const estadoInfo = ESTADO_MAP[estado];

    const postFunctionLogin = async () => {
        try {
            await cancelReservation(id);

            setEstado(reservationStatus.CANCELLED);
            if (onCancel) onCancel(id);
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

export default React.memo(CajaTurno);
