import { useEffect, useState } from 'react';
import { calcularEndTime } from '../../../utils/functions/calcularEndTime';
import { createReservation, fetchHorarios } from '../../../services/reservation';
import { getNextDays } from '../../../utils/functions/getNextDay';
import { motion } from 'framer-motion';
import './ModalHorarios.css';
import { modalVariants } from '../../Animations/modalVariants';
import SkeletonHorario from '../../Skeletons/SkeletonHorario/SkeletonHorario';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';

const ModalHorarios = ({ values, setFieldValue, setShowModal, userRole }) => {
    const [diaHorarios, setDiaHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(true);
    const days = getNextDays();

    // Si values.fecha ya tiene valor (por ejemplo editando), buscamos el índice correspondiente
    // Si no, usamos hoy como default
    const todayExactDate = days[0].exactDate; // primer día = hoy
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    useEffect(() => {
        setSelectedDayIndex(0);
        setFieldValue('fecha', todayExactDate);
        setDiaHorarios([]);
        setFieldValue('horario', []); // resetea selección previa
    }, []);

    // Traer horarios cada vez que cambia el día o la cancha
    useEffect(() => {
        const fetchHorariosPorDia = async () => {
            if (!values.cancha) return;

            setLoadingHorarios(true);
            setDiaHorarios([]);

            try {
                const horariosDia = await fetchHorarios({
                    affair: values.affair,
                    cancha: values.cancha,
                    entrenador: values.entrenador,
                    fecha: values.fecha,
                });

                setDiaHorarios(horariosDia);
                setFieldValue('horario', []); // reseteamos selección al cambiar de día
            } catch (error) {
                console.error(error);
                setDiaHorarios([]);
            } finally {
                setLoadingHorarios(false);
            }
        };

        fetchHorariosPorDia();
    }, [selectedDayIndex, values.cancha]);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('contenedor-modal')) {
            setShowModal(false);
        }
    };

    const guardarReservas = async () => {
        if (!values.cancha || values.horario.length === 0) return;

        // Confirmación antes de crear reservas
        const confirmacion = await swal({
            title: '¿Estás seguro de crear la reserva?',
            icon: 'warning',
            dangerMode: true,
            //@ts-ignore
            buttons: true,
        });

        if (!confirmacion) return;

        // Convertimos horarios a minutos
        const timesInMinutes = values.horario.map((hora) => {
            const [h, m] = hora.split(':').map(Number);
            return h * 60 + m;
        });

        // Ajustamos horarios que cruzan medianoche
        const firstTime = timesInMinutes[0];
        const adjustedTimes = timesInMinutes.map((t) => (t < firstTime ? t + 1440 : t));

        // Ordenamos horarios
        const selectedSorted = adjustedTimes.sort((a, b) => a - b);

        // Verificamos continuidad (bloques de 1 hora)
        for (let i = 1; i < selectedSorted.length; i++) {
            if (selectedSorted[i] - selectedSorted[i - 1] !== 60) {
                swal({
                    icon: 'error',
                    title: 'Horarios no continuos',
                    text: 'Por favor selecciona horarios consecutivos.',
                });
                return;
            }
        }

        const { start_time, end_time } = calcularEndTime(values.horario);

        try {
            const reservas = values.horario.map((hora) => ({
                user_id: values.userId,
                court_id: values.cancha,
                reservation_date: values.fecha,
                start_time: start_time,
                end_time: end_time,
                total_amount: values.courtPrice, // ajusta según cancha
                status: userRole === 3 || userRole === 4 ? 'confirmed' : 'pending',
                payment_status: userRole === 3 || userRole === 4 ? 'approved' : 'pending',
                affair: values.affair,
                coach_id: values.entrenador || null,
            }));

            for (const reserva of reservas) {
                console.log(reserva);
                console.log(reservas);

                await createReservation(reserva);
            }
            // addUserReservation(newReservation);

            swal({
                title: '¡Exito!',
                text: '!Reserva realiza con exito!',
                icon: 'success',
                //@ts-ignore
                button: true,
            });

            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div className="contenedor-modal" onClick={handleOverlayClick} variants={modalVariants} initial="hidden" animate="visible" exit="exit">
            <div className="contenedor-modal" onClick={handleOverlayClick}>
                <div className="contenido-modal">
                    <div className="header-modal">
                        <div className="caja-titulo-modal">
                            <span className="titulo-modal">Selecciona un día y horario</span>

                            <button className="btn-cerrar-modal" onClick={() => setShowModal(false)} title="Cerrar">
                                <i className="bi bi-x-circle"></i>
                            </button>
                        </div>
                        <div className="caja-info-cancha">
                            <p className="text-cancha">
                                Cancha {values.cancha} - {values.surface_type}
                            </p>
                        </div>
                    </div>

                    <div className="caja-dias-semana">
                        {days.map((day, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`dia-btn ${selectedDayIndex === idx ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedDayIndex(idx);
                                    setFieldValue('fecha', day.exactDate); // Guardamos la fecha exacta
                                }}>
                                {day.label}
                            </button>
                        ))}
                    </div>

                    <div className="horarios-tabla-container">
                        {loadingHorarios ? (
                            <table className="horarios-tabla">
                                <tbody>
                                    {Array.from({ length: 3 }).map((_, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {Array.from({ length: 6 }).map((_, colIdx) => (
                                                <td key={colIdx}>
                                                    <SkeletonHorario />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : diaHorarios.length > 0 ? (
                            <table className="horarios-tabla">
                                <tbody>
                                    {Array.from({ length: 3 }).map((_, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {diaHorarios
                                                .slice(rowIdx * Math.ceil(diaHorarios.length / 3), rowIdx * Math.ceil(diaHorarios.length / 3) + Math.ceil(diaHorarios.length / 3))
                                                .map((h, colIdx) => {
                                                    const isSelected = values.horario.includes(h.hora);
                                                    return (
                                                        <td key={colIdx}>
                                                            <button
                                                                type="button"
                                                                className={`horario-btn 
                                                                ${h.estado === 'no_disponible' ? 'disabled' : ''} 
                                                                ${h.estado === 'pendiente' ? 'pending' : ''} 
                                                                ${isSelected ? 'selected' : ''}`}
                                                                disabled={h.estado === 'no_disponible'}
                                                                onClick={() =>
                                                                    setFieldValue('horario', isSelected ? values.horario.filter((hora) => hora !== h.hora) : [...values.horario, h.hora])
                                                                }>
                                                                {h.hora}
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <ErrorMessage message={'No se pudieron cargar los horarios. Intenta nuevamente.'} />
                        )}
                    </div>

                    <button className="btn-alquilar" type="submit" onClick={guardarReservas} disabled={values.horario.length === 0}>
                        Alquilar Cancha
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ModalHorarios;
