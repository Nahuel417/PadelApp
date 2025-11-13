import React, { useState, useEffect } from 'react';
import { DetailsModal, DetailSection } from '../../../../../../shared/components';
import { Coach, getCoachStats } from '../../../../../../services/coaches';
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
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' },
];

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose }) => {
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [coachStats, setCoachStats] = useState({ totalClasses: 0, completedClasses: 0, confirmedClasses: 0 });

    useEffect(() => {
        if (isOpen && coach) {
            loadAvailability();
            loadCoachStats();
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

    const loadCoachStats = async () => {
        if (!coach) return;

        try {
            const stats = await getCoachStats(coach.id);
            setCoachStats(stats);
        } catch (error) {
            console.error('Error loading coach stats:', error);
        }
    };

    const formatRate = (rate: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(rate);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificado';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getGenreText = (genre?: string) => {
        if (!genre) return 'No especificado';
        return genre.charAt(0).toUpperCase() + genre.slice(1);
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

    // Configuración del modal
    const modalProps = {
        title: 'Detalles del Entrenador',
        subtitle: `${coach.user.first_name} ${coach.user.last_name}`,
        headerIcon: 'bi-person-video3',
        statusBadge: {
            text: statusText,
            className: statusClass,
            icon: statusIcon
        },
        summaryCard: {
            avatar: `${coach.user.first_name.charAt(0)}${coach.user.last_name.charAt(0)}`,
            title: `${coach.user.first_name} ${coach.user.last_name}`,
            subtitle: coach.user.email,
            extraInfo: coach.phone ? (
                <p className="summary-phone">
                    <i className="bi bi-telephone"></i>
                    {coach.phone}
                </p>
            ) : null
        }
    };

    // Secciones de detalles
    const sections: DetailSection[] = [
        {
            title: 'Información Personal',
            icon: 'bi-person-circle',
            items: [
                {
                    label: 'Nombre completo',
                    value: `${coach.user.first_name} ${coach.user.last_name}`
                },
                {
                    label: 'Email',
                    value: coach.user.email
                },
                {
                    label: 'Teléfono',
                    value: coach.phone || 'No especificado'
                },
                {
                    label: 'Fecha de nacimiento',
                    value: formatDate(coach.user.birthday)
                },
                {
                    label: 'Género',
                    value: getGenreText(coach.user.genre)
                },
                {
                    label: 'Estado',
                    value: (
                        <span className={`status ${statusClass}`}>
                            <i className={`bi ${statusIcon}`}></i>
                            {statusText}
                        </span>
                    ),
                    className: 'status-item'
                },
                {
                    label: 'Biografía',
                    value: coach.bio || 'No especificada',
                    fullWidth: true
                }
            ]
        },
        {
            title: 'Información Profesional',
            icon: 'bi-briefcase',
            items: [
                {
                    label: 'Tarifa por hora',
                    value: formatRate(coach.hourly_rate),
                    className: 'price'
                },
                {
                    label: 'Fecha de alta',
                    value: formatDate(coach.created_at)
                },
                {
                    label: 'Clases totales',
                    value: `${coachStats.totalClasses} clases`,
                    className: 'stats'
                }
            ]
        },
        {
            title: 'Horarios de Disponibilidad',
            icon: 'bi-calendar-week',
            items: [],
            customContent: isLoading ? (
                <div className="details-loading">
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
            )
        }
    ];

    return (
        <DetailsModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalProps.title}
            subtitle={modalProps.subtitle}
            headerIcon={modalProps.headerIcon}
            statusBadge={modalProps.statusBadge}
            summaryCard={modalProps.summaryCard}
            sections={sections}
            isLoading={false}
        />
    );
};
