import { useEffect, useState } from 'react';
import { createReservation, fetchHorarios } from '../../../services/reservation';
import { getNextDays } from '../../../utils/functions/getNextDay';
import { motion } from 'framer-motion';
import { modalVariants } from '../../Animations/modalVariants';
import SkeletonHorario from '../../Skeletons/SkeletonHorario/SkeletonHorario';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import { calcularMaxDuracion } from '../../../utils/functions/calcularMaxDuracion';
import './ModalHorarios.css';

const ModalHorarios = ({ values, setFieldValue, setShowModal, userRole }) => {
    const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
    const [duracion, setDuracion] = useState<number>(1); // 1 hora por defecto

    const [diaHorarios, setDiaHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(true);
    const days = getNextDays();

    const handleDiaChange = (idx: number) => {
        setSelectedDayIndex(idx);
        setFieldValue('fecha', days[idx].exactDate);
        setFieldValue('horario', []); // reseteo explícito
    };

    const reservasMap = diaHorarios.reduce((acc, h) => {
        // Bloqueamos si no se puede reservar
        acc[h.hora] = h.estado === 'no_disponible' || h.estado === 'pendiente' ? 'no_disponible' : 'disponible';
        return acc;
    }, {} as Record<string, string>);

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

            if (values.affair !== 'Entrenar' && values.entrenador) {
                setFieldValue('entrenador', null);
                setSelectedHorario(null);
                setFieldValue('horario', []);
            }

            setLoadingHorarios(true);
            setDiaHorarios([]);

            try {
                const horariosDia = await fetchHorarios({
                    affair: values.affair,
                    cancha: values.cancha,
                    entrenador: values.affair === 'Entrenar' ? values.entrenador : null,
                    fecha: days[selectedDayIndex].exactDate,
                });

                setDiaHorarios(horariosDia);
            } catch (error) {
                console.error(error);
                setDiaHorarios([]);
            } finally {
                setLoadingHorarios(false);
            }
        };

        fetchHorariosPorDia();
    }, [selectedDayIndex, values.cancha, values.entrenador, values.affair]);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('contenedor-modal')) {
            setShowModal(false);
        }
    };

    const guardarReservas = async () => {
        if (!values.cancha || !selectedHorario) return;

        const confirmacion = await swal({
            title: '¿Estás seguro de crear la reserva?',
            icon: 'warning',
            dangerMode: true,
            //@ts-ignore
            buttons: true,
        });

        if (!confirmacion) return;

        // Calcular start_time y end_time según duración
        const [hh, mm] = selectedHorario.split(':').map(Number);
        let startMinutes = hh * 60 + mm;
        let endMinutes = startMinutes + duracion * 60;

        // Ajuste si cruza medianoche
        if (endMinutes >= 1440) endMinutes -= 1440;

        const toHHMM = (m: number) => {
            const h = Math.floor(m / 60)
                .toString()
                .padStart(2, '0');
            const mm = (m % 60).toString().padStart(2, '0');
            return `${h}:${mm}`;
        };

        const reserva = {
            user_id: values.userId,
            court_id: values.cancha,
            reservation_date: values.fecha,
            start_time: toHHMM(startMinutes),
            end_time: toHHMM(endMinutes),
            total_amount: values.courtPrice * duracion, // ajusta precio según duración
            status: userRole === 3 || userRole === 4 ? 'confirmed' : 'pending',
            payment_status: userRole === 3 || userRole === 4 ? 'approved' : 'pending',
            affair: values.affair,
            coach_id: values.entrenador || null,
        };

        try {
            await createReservation(reserva);

            swal({
                title: '¡Éxito!',
                text: '¡Reserva realizada con éxito!',
                icon: 'success',
                //@ts-ignore
                button: true,
            });
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };
    console.count('fetchHorarios ejecutado');
    return (
        <motion.div className="contenedor-modal" onClick={handleOverlayClick} variants={modalVariants} initial="hidden" animate="visible" exit="exit">
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
                                handleDiaChange(idx); // Guardamos la fecha exacta
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
                                                                    ${selectedHorario === h.hora ? 'selected' : ''}`}
                                                            disabled={h.estado === 'no_disponible'}
                                                            onClick={() => {
                                                                if (selectedHorario === h.hora) {
                                                                    setSelectedHorario(null);
                                                                    setDuracion(1);
                                                                } else {
                                                                    const maxDisponible = calcularMaxDuracion(h.hora, reservasMap);
                                                                    setSelectedHorario(h.hora);
                                                                    setDuracion(Math.min(duracion, maxDisponible)); // ajusta si la duración actual supera lo disponible
                                                                }
                                                            }}>
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

                <div className="duracion-selector">
                    <span>Duración/Hora: </span>
                    <div className="duracion-buttons">
                        {[1, 2, 3, 4].map((dur) => (
                            <button
                                key={dur}
                                type="button"
                                className={`duracion-btn ${duracion === dur ? 'selected' : ''}`}
                                onClick={() => {
                                    if (!selectedHorario) return;
                                    const maxDisponible = calcularMaxDuracion(selectedHorario, reservasMap);
                                    setDuracion(Math.min(dur, maxDisponible));
                                }}
                                disabled={selectedHorario ? calcularMaxDuracion(selectedHorario, reservasMap) < dur : true}>
                                {dur}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="btn-alquilar" type="submit" onClick={guardarReservas} disabled={!selectedHorario}>
                    Alquilar Cancha
                </button>
            </div>
        </motion.div>
    );
};

export default ModalHorarios;
