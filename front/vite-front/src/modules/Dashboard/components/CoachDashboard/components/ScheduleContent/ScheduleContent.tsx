import React, { useState, useEffect, useCallback } from 'react';
import {
    getCoachAvailability,
    createCoachAvailability,
    updateCoachAvailability,
    checkAvailabilityHasReservations,
    permanentlyDeleteCoachAvailability,
    pauseCoachAvailability,
    CreateAvailabilityData,
    UpdateAvailabilityData,
    CoachAvailability,
} from '../../../../../../services/coachServices';
import Swal from 'sweetalert';
import './ScheduleContent.css';

export interface ScheduleContentProps {
    coachId: string;
}

interface TimeSlot {
    id?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

const DAYS_OF_WEEK = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' },
];

const ScheduleContent: React.FC<ScheduleContentProps> = ({ coachId }) => {
    const [availability, setAvailability] = useState<CoachAvailability[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [isAddingSlotLoading, setIsAddingSlotLoading] = useState(false);
    const [newSlot, setNewSlot] = useState<TimeSlot>({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        is_active: true,
    });

    // Cargar disponibilidad
    const fetchAvailability = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getCoachAvailability(coachId);
            setAvailability(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar horarios';
            setError(errorMessage);
            console.error('Error fetching availability:', err);
        } finally {
            setIsLoading(false);
        }
    }, [coachId]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Agrupar disponibilidad por día
    const availabilityByDay = DAYS_OF_WEEK.map((day) => ({
        ...day,
        slots: availability.filter((slot) => slot.day_of_week === day.value),
    }));

    // Validar nuevo slot
    const validateTimeSlot = (slot: TimeSlot): string | null => {
        if (slot.start_time >= slot.end_time) {
            return 'La hora de fin debe ser posterior a la hora de inicio';
        }

        // Verificar superposición con slots existentes del mismo día
        const existingSlots = availability.filter((existing) => existing.day_of_week === slot.day_of_week && existing.is_active);

        for (const existing of existingSlots) {
            if (
                (slot.start_time >= existing.start_time && slot.start_time < existing.end_time) ||
                (slot.end_time > existing.start_time && slot.end_time <= existing.end_time) ||
                (slot.start_time <= existing.start_time && slot.end_time >= existing.end_time)
            ) {
                return 'Este horario se superpone con un slot existente';
            }
        }

        return null;
    };

    // Agregar nuevo slot
    const handleAddSlot = async () => {
        const validationError = validateTimeSlot(newSlot);
        if (validationError) {
            Swal({
                title: 'Error de Validación',
                text: validationError,
                icon: 'warning',
            });
            return;
        }

        // Verificar duplicados
        const isDuplicate = availability.some((slot) => slot.day_of_week === newSlot.day_of_week && slot.start_time === newSlot.start_time && slot.end_time === newSlot.end_time);

        if (isDuplicate) {
            Swal({
                title: 'Horario Duplicado',
                text: 'Ya existe un horario con estos datos.',
                icon: 'warning',
            });
            return;
        }

        setIsAddingSlotLoading(true);
        try {
            const createData: CreateAvailabilityData = {
                coach_id: coachId,
                day_of_week: newSlot.day_of_week,
                start_time: newSlot.start_time,
                end_time: newSlot.end_time,
            };

            await createCoachAvailability(createData);
            await fetchAvailability();

            Swal({
                title: 'Horario Agregado',
                text: 'El horario ha sido agregado exitosamente.',
                icon: 'success',
                timer: 2000,
            });

            // Cerrar modal inmediatamente después del OK
            setIsAddingSlot(false);
            setNewSlot({
                day_of_week: 1,
                start_time: '09:00',
                end_time: '10:00',
                is_active: true,
            });
            setIsAddingSlotLoading(false);
        } catch (error) {
            console.error('Error adding availability:', error);
            setIsAddingSlotLoading(false);
            Swal({
                title: 'Error',
                text: 'No se pudo agregar el horario. Intenta de nuevo.',
                icon: 'error',
            });
        }
    };

    // Toggle slot (activar/pausar)
    const handleToggleSlot = async (id: string, activate: boolean, dayLabel: string, timeRange: string) => {
        if (!activate) {
            // Si se va a pausar, pedir confirmación
            Swal({
                title: '¿Pausar horario?',
                text: `¿Estás seguro de que deseas pausar el horario? 
                Podrás reactivarlo cuando quieras.`,
                icon: 'warning',
                buttons: {
                    cancel: {
                        text: 'Cancelar',
                        value: false,
                        visible: true,
                    },
                    confirm: {
                        text: 'Sí, pausar',
                        value: true,
                        visible: true,
                    },
                },
            }).then(async (willPause: boolean) => {
                if (willPause) {
                    try {
                        const updateData: UpdateAvailabilityData = {
                            is_active: false,
                        };
                        await updateCoachAvailability(id, updateData);
                        await fetchAvailability();

                        Swal({
                            title: 'Horario Pausado',
                            text: 'El horario ha sido pausado exitosamente.',
                            icon: 'success',
                            timer: 2000,
                        });
                    } catch (err) {
                        console.error('Error pausing slot:', err);
                        Swal({
                            title: 'Error',
                            text: 'No se pudo pausar el horario.',
                            icon: 'error',
                        });
                    }
                }
            });
        } else {
            // Si se va a activar, hacerlo directamente sin confirmación
            try {
                const updateData: UpdateAvailabilityData = {
                    is_active: true,
                };
                await updateCoachAvailability(id, updateData);
                await fetchAvailability();

                Swal({
                    title: 'Horario Activado',
                    text: 'El horario ha sido activado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                });
            } catch (err) {
                console.error('Error activating slot:', err);
                Swal({
                    title: 'Error',
                    text: 'No se pudo activar el horario.',
                    icon: 'error',
                });
            }
        }
    };

    const handleDeleteSlot = async (id: string, dayLabel: string, timeRange: string) => {
        // Buscar el slot para obtener sus datos
        const slot = availability.find((s) => s.id === id);
        if (!slot) {
            Swal({
                title: 'Error',
                text: 'No se encontró el horario.',
                icon: 'error',
            });
            return;
        }

        Swal({
            title: '¿Eliminar horario?',
            text: `¿Estás seguro de que deseas eliminar este horario?`,
            icon: 'warning',
            buttons: {
                cancel: {
                    text: 'Cancelar',
                    value: false,
                    visible: true,
                },
                confirm: {
                    text: 'Sí, eliminar',
                    value: true,
                    visible: true,
                },
            },
            dangerMode: true,
        }).then(async (willDelete: boolean) => {
            if (willDelete) {
                try {
                    // Verificar si hay reservas asociadas
                    const hasReservations = await checkAvailabilityHasReservations(coachId, slot.day_of_week, slot.start_time, slot.end_time);

                    if (hasReservations) {
                        // Si hay reservas, pausar en lugar de eliminar
                        await pauseCoachAvailability(id);
                        await fetchAvailability();

                        Swal({
                            title: 'Horario Pausado',
                            text: 'Este horario tiene reservas asociadas, por lo que se ha pausado en lugar de eliminarse. Puedes reactivarlo cuando lo desees.',
                            icon: 'info',
                            timer: 4000,
                        });
                    } else {
                        // Si no hay reservas, eliminar permanentemente
                        await permanentlyDeleteCoachAvailability(id);
                        await fetchAvailability();

                        Swal({
                            title: 'Horario Eliminado',
                            text: 'El horario ha sido eliminado exitosamente de la base de datos.',
                            icon: 'success',
                            timer: 2000,
                        });
                    }
                } catch (error) {
                    console.error('Error deleting availability:', error);
                    Swal({
                        title: 'Error',
                        text: 'No se pudo eliminar el horario. Intenta de nuevo.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    if (error) {
        return (
            <div className="schedule-content">
                <div className="error-container">
                    <h3>Error al cargar horarios</h3>
                    <p>{error}</p>
                    <button onClick={fetchAvailability} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Calcular estadísticas
    const totalSlots = availability.length;
    const activeSlots = availability.filter((slot) => slot.is_active).length;
    const inactiveSlots = totalSlots - activeSlots;
    const daysWithSlots = [...new Set(availability.map((slot) => slot.day_of_week))].length;

    const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

    const metrics = [
        { id: 'total', label: 'Total Horarios', value: totalSlots },
        { id: 'active', label: 'Activos', value: activeSlots },
        { id: 'days', label: 'Días con Horarios', value: daysWithSlots },
    ];

    return (
        <>
            <div className="schedule-header">
                <div className="schedule-header-content">
                    <h2 className="schedule-header-title">Mis Horarios</h2>
                    <span className="schedule-header-caption">Gestión de disponibilidad</span>
                </div>

                <div className="schedule-header-stats" role="list">
                    {metrics.map((metric) => (
                        <div key={metric.id} className={`schedule-header-stat schedule-header-stat--${metric.id}`} role="listitem">
                            <span className="schedule-header-stat-value">{formatCount(metric.value)}</span>
                            <span className="schedule-header-stat-label">{metric.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="schedule-actions">
                <button className="add-slot-btn pulse" onClick={() => setIsAddingSlot(true)}>
                    <i className="bi bi-plus-lg icon-bounce"></i>
                    Agregar Horario
                </button>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando horarios...</p>
                </div>
            ) : (
                <div className="schedule-grid">
                    {availabilityByDay.map((day) => (
                        <div key={day.value} className="day-card">
                            <div className="day-card__header">
                                <div className="day-info">
                                    <h3 className="day-card__name">{day.label}</h3>
                                    <p className="day-card__count">
                                        {day.slots.length} horario{day.slots.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {day.slots.length > 0 ? (
                                    <div className="day-card__status">
                                        <i className={`bi bi-check-circle-fill`}></i>
                                        Disponible
                                    </div>
                                ) : (
                                    <div className="day-card__status_empty">
                                        <i className={'bi-x-circle-fill'}></i>
                                        Sin horarios
                                    </div>
                                )}
                            </div>

                            <div className="day-card__content">
                                {day.slots.length === 0 ? (
                                    <div className="no-slots">
                                        <i className="bi bi-calendar-x"></i>
                                        <span>No hay horarios configurados</span>
                                    </div>
                                ) : (
                                    <div className="slots-list">
                                        {day.slots.map((slot) => (
                                            <div key={slot.id} className={`slot-info-item ${!slot.is_active ? 'inactive' : ''}`}>
                                                <span className="slot-info-label">Horario:</span>
                                                <span className="slot-info-value schedule">
                                                    <i className="bi bi-clock"></i>
                                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                </span>
                                                <div className="slot-actions">
                                                    {!slot.is_active ? (
                                                        <button
                                                            className="toggle-slot-btn active"
                                                            onClick={() => handleToggleSlot(slot.id, true, day.label, `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)}
                                                            title="Activar horario">
                                                            <i className="bi bi-play-circle"></i>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="toggle-slot-btn"
                                                            onClick={() => handleToggleSlot(slot.id, false, day.label, `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)}
                                                            title="Pausar horario">
                                                            <i className="bi bi-pause-circle"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        className="delete-slot-btn"
                                                        onClick={() => handleDeleteSlot(slot.id, day.label, `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para agregar nuevo horario */}
            {isAddingSlot && (
                <div className="modal-overlay" onClick={() => setIsAddingSlot(false)}>
                    <div className="add-slot-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Agregar Nuevo Horario</h4>
                            <button className="modal-close" onClick={() => setIsAddingSlot(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="form-group">
                                <label>Día de la semana:</label>
                                <select
                                    value={newSlot.day_of_week}
                                    onChange={(e) =>
                                        setNewSlot((prev) => ({
                                            ...prev,
                                            day_of_week: parseInt(e.target.value),
                                        }))
                                    }
                                    className="form-select">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hora de inicio:</label>
                                    <input
                                        type="time"
                                        value={newSlot.start_time}
                                        onChange={(e) =>
                                            setNewSlot((prev) => ({
                                                ...prev,
                                                start_time: e.target.value,
                                            }))
                                        }
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hora de fin:</label>
                                    <input
                                        type="time"
                                        value={newSlot.end_time}
                                        onChange={(e) =>
                                            setNewSlot((prev) => ({
                                                ...prev,
                                                end_time: e.target.value,
                                            }))
                                        }
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsAddingSlot(false)}>
                                Cancelar
                            </button>
                            <button className="btn-save" onClick={handleAddSlot} disabled={isAddingSlotLoading}>
                                {isAddingSlotLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Agregar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScheduleContent;
