import React, { useState, useEffect } from 'react';
import './CoachDetailsModal.css';
import { Coach } from '../../../../../../services/coaches';
import { getCoachAvailability } from '../../../../../../services/coachAvailability';

interface CoachDetailsModalProps {
    isOpen: boolean;
    coach: Coach | null;
    onClose: () => void;
}

interface AvailabilitySlot {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose }) => {
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && coach) {
            loadAvailability();
        }
    }, [isOpen, coach]);

    const loadAvailability = async () => {
        if (!coach) return;

        setIsLoading(true);
        try {
            const slots = await getCoachAvailability(coach.id.toString());
            setAvailability(slots);
        } catch (error) {
            console.error('Error loading availability:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatRate = (rate: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(rate);
    };

    const getExperienceText = (years?: number) => {
        if (!years) return 'Sin especificar años';
        return years === 1 ? '1 año' : `${years} años`;
    };

    const getDayLabel = (dayValue: number) => {
        return DAYS_OF_WEEK.find((day) => day.value === dayValue)?.label || 'Día';
    };

    const formatTime = (time: string) => {
        return time.slice(0, 5); // Remove seconds
    };

    const getAvailabilityByDay = () => {
        const groupedByDay: { [key: number]: AvailabilitySlot[] } = {};

        availability.forEach((slot) => {
            if (!groupedByDay[slot.day_of_week]) {
                groupedByDay[slot.day_of_week] = [];
            }
            groupedByDay[slot.day_of_week].push(slot);
        });

        // Sort slots by start time within each day
        Object.keys(groupedByDay).forEach((day) => {
            groupedByDay[parseInt(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
        });

        return groupedByDay;
    };

    if (!isOpen || !coach) return null;

    const availabilityByDay = getAvailabilityByDay();
    const statusText = coach.is_available ? 'Disponible' : 'No disponible';
    const statusIcon = coach.is_available ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
    const statusClass = coach.is_available ? 'available' : 'unavailable';

    return (
        <div className="coach-details-overlay" onClick={onClose}>
            <div className="coach-details-content" onClick={(e) => e.stopPropagation()}>
                <div className="coach-details-header">
                    <div className="details-header-left">
                        <div className="details-header-icon">
                            <i className="bi bi-person-video3"></i>
                        </div>
                        <div className="details-header-text">
                            <h2>Detalles del Entrenador</h2>
                            <p className="details-header-subtitle">
                                {coach.user.first_name} {coach.user.last_name}
                            </p>
                        </div>
                    </div>
                    <div className="details-header-actions">
                        <span className={`details-status-badge ${statusClass}`}>
                            <i className={`bi ${statusIcon}`}></i>
                            {statusText}
                        </span>
                        <button className="coach-details-close" onClick={onClose} aria-label="Cerrar modal de detalles">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                <div className="coach-details-body">
                    <div className="coach-summary-card">
                        <div className="summary-avatar">
                            <span>
                                {coach.user.first_name.charAt(0)}
                                {coach.user.last_name.charAt(0)}
                            </span>
                        </div>
                        <div className="summary-info">
                            <h3>
                                {coach.user.first_name} {coach.user.last_name}
                            </h3>
                            <p>{coach.user.email}</p>
                            <div className="summary-meta">
                                <span className="summary-meta-item">
                                    <i className="bi bi-calendar-event"></i>
                                    {getExperienceText(coach.experience_years)} de experiencia
                                </span>
                                {coach.specialties && (
                                    <span className="summary-meta-item">
                                        <i className="bi bi-star"></i>
                                        {coach.specialties}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información Personal */}
                    <div className="details-section details-section-card">
                        <h3 className="details-section-title">
                            <i className="bi bi-person-circle"></i>
                            Información Personal
                        </h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Nombre completo</span>
                                <span className="detail-value">
                                    {coach.user.first_name} {coach.user.last_name}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{coach.user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado</span>
                                <span className={`detail-value status ${statusClass}`}>
                                    <i className={`bi ${statusIcon}`}></i>
                                    {statusText}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Información Profesional */}
                    <div className="details-section details-section-card">
                        <h3 className="details-section-title">
                            <i className="bi bi-briefcase"></i>
                            Información Profesional
                        </h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Tarifa por hora</span>
                                <span className="detail-value price">{formatRate(coach.hourly_rate)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Experiencia</span>
                                <span className="detail-value">{getExperienceText(coach.experience_years)}</span>
                            </div>
                            {coach.specialties && (
                                <div className="detail-item full-width">
                                    <span className="detail-label">Especialidades</span>
                                    <span className="detail-value">{coach.specialties}</span>
                                </div>
                            )}
                        </div>

                        {coach.description && (
                            <div className="description-section">
                                <span className="detail-label">Descripción</span>
                                <p className="description-text">{coach.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Horarios de Disponibilidad */}
                    <div className="details-section details-section-card">
                        <h3 className="details-section-title">
                            <i className="bi bi-calendar-week"></i>
                            Horarios de Disponibilidad
                        </h3>

                        {isLoading ? (
                            <div className="loading-availability">
                                <i className="bi bi-arrow-clockwise spin"></i>
                                Cargando horarios...
                            </div>
                        ) : availability.length === 0 ? (
                            <div className="no-availability">
                                <i className="bi bi-calendar-x"></i>
                                <p>No hay horarios configurados</p>
                                <small>Configura horarios desde la edición del entrenador</small>
                            </div>
                        ) : (
                            <div className="availability-schedule">
                                {DAYS_OF_WEEK.map((day) => {
                                    const daySlots = availabilityByDay[day.value];
                                    if (!daySlots || daySlots.length === 0) return null;

                                    return (
                                        <div key={day.value} className="day-schedule">
                                            <div className="day-name">{day.label}</div>
                                            <div className="day-slots">
                                                {daySlots.map((slot, index) => (
                                                    <div key={slot.id || index} className="time-slot">
                                                        <i className="bi bi-clock"></i>
                                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="coach-details-footer">
                    <button className="btn-close" onClick={onClose}>
                        <i className="bi bi-x-circle"></i>
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
