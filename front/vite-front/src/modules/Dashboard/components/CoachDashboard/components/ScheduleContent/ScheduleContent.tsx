import React, { useState, useEffect, useCallback } from 'react';
import { 
    getCoachAvailability, 
    createCoachAvailability, 
    updateCoachAvailability, 
    deleteCoachAvailability,
    CoachAvailability,
    CreateAvailabilityData,
    UpdateAvailabilityData
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
    const [newSlot, setNewSlot] = useState<TimeSlot>({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        is_active: true
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
    const availabilityByDay = DAYS_OF_WEEK.map(day => ({
        ...day,
        slots: availability.filter(slot => slot.day_of_week === day.value)
    }));

    // Validar nuevo slot
    const validateTimeSlot = (slot: TimeSlot): string | null => {
        if (slot.start_time >= slot.end_time) {
            return 'La hora de fin debe ser posterior a la hora de inicio';
        }

        // Verificar superposición con slots existentes del mismo día
        const existingSlots = availability.filter(
            existing => existing.day_of_week === slot.day_of_week && existing.is_active
        );

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

        try {
            const createData: CreateAvailabilityData = {
                coach_id: coachId,
                day_of_week: newSlot.day_of_week,
                start_time: newSlot.start_time,
                end_time: newSlot.end_time
            };

            await createCoachAvailability(createData);
            await fetchAvailability();
            
            setIsAddingSlot(false);
            setNewSlot({
                day_of_week: 1,
                start_time: '09:00',
                end_time: '10:00',
                is_active: true
            });

            Swal({
                title: 'Horario Agregado',
                text: 'El horario ha sido agregado exitosamente.',
                icon: 'success',
                timer: 2000,
            });
        } catch (error) {
            console.error('Error adding availability:', error);
            Swal({
                title: 'Error',
                text: 'No se pudo agregar el horario. Intenta de nuevo.',
                icon: 'error',
            });
        }
    };

    // Eliminar slot
    const handleDeleteSlot = async (slotId: string, dayLabel: string, timeRange: string) => {
        Swal({
            title: '¿Eliminar horario?',
            text: `¿Estás seguro de que deseas eliminar el horario de ${dayLabel} (${timeRange})?`,
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
                    await deleteCoachAvailability(slotId);
                    await fetchAvailability();
                    
                    Swal({
                        title: 'Horario Eliminado',
                        text: 'El horario ha sido eliminado exitosamente.',
                        icon: 'success',
                        timer: 2000,
                    });
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

    return (
        <div className="schedule-content">
            <div className="schedule-header">
                <h3 className="schedule-title">Mis Horarios</h3>
                <p className="schedule-subtitle">Gestiona tu disponibilidad semanal</p>
                
                <button 
                    className="add-slot-btn"
                    onClick={() => setIsAddingSlot(true)}
                >
                    <i className="bi bi-plus-lg"></i>
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
                        <div key={day.value} className="day-schedule">
                            <h4 className="day-title">{day.label}</h4>
                            
                            {day.slots.length === 0 ? (
                                <div className="no-slots">
                                    <i className="bi bi-calendar-x"></i>
                                    <span>Sin horarios</span>
                                </div>
                            ) : (
                                <div className="slots-list">
                                    {day.slots.map((slot) => (
                                        <div key={slot.id} className="time-slot">
                                            <div className="slot-time">
                                                <i className="bi bi-clock"></i>
                                                <span>
                                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                </span>
                                            </div>
                                            <button
                                                className="delete-slot-btn"
                                                onClick={() => handleDeleteSlot(
                                                    slot.id, 
                                                    day.label, 
                                                    `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
                                                )}
                                                title="Eliminar horario"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            <button 
                                className="modal-close"
                                onClick={() => setIsAddingSlot(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Día de la semana:</label>
                                <select 
                                    value={newSlot.day_of_week}
                                    onChange={(e) => setNewSlot(prev => ({
                                        ...prev,
                                        day_of_week: parseInt(e.target.value)
                                    }))}
                                    className="form-select"
                                >
                                    {DAYS_OF_WEEK.map(day => (
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
                                        onChange={(e) => setNewSlot(prev => ({
                                            ...prev,
                                            start_time: e.target.value
                                        }))}
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Hora de fin:</label>
                                    <input
                                        type="time"
                                        value={newSlot.end_time}
                                        onChange={(e) => setNewSlot(prev => ({
                                            ...prev,
                                            end_time: e.target.value
                                        }))}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setIsAddingSlot(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-save"
                                onClick={handleAddSlot}
                            >
                                <i className="bi bi-check-lg"></i>
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleContent;
