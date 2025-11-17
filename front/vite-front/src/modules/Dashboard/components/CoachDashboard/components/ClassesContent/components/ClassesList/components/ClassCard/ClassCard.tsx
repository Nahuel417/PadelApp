import React, { useState } from 'react';
import './ClassCard.css';
import { CoachClass } from '../../../../../../../../../../services/coachServices';

export interface ClassCardProps {
    classData: CoachClass;
    onViewDetails: (classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onViewDetails }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleViewDetails = (classId: string) => {
        setIsLoading(true);
        onViewDetails(classId);

        // Resetear el loading después de un breve momento para permitir que el modal se abra
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };
    // Validación para evitar errores si classData es undefined
    if (!classData) {
        return null;
    }

    const formatDate = (dateString: string) => {
        // Parsear la fecha manualmente para evitar problemas de zona horaria
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11

        return date.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // HH:MM
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    className: 'confirmed',
                    text: 'Confirmada',
                    icon: 'bi-check-circle-fill',
                };
            case 'pending':
                return {
                    className: 'pending',
                    text: 'Pendiente',
                    icon: 'bi-clock-fill',
                };
            case 'completed':
                return {
                    className: 'completed',
                    text: 'Completada',
                    icon: 'bi-check-circle-fill',
                };
            case 'cancelled':
                return {
                    className: 'cancelled',
                    text: 'Cancelada',
                    icon: 'bi-x-circle-fill',
                };
            default:
                return {
                    className: 'pending',
                    text: 'Pendiente',
                    icon: 'bi-clock-fill',
                };
        }
    };

    const statusInfo = getStatusInfo(classData.status);
    const isPastClass = new Date(classData.reservation_date) < new Date();

    return (
        <div className={`class-card ${isPastClass ? 'past' : ''} ${classData.status === 'cancelled' ? 'unavailable' : ''} status-${classData.status}`}>
            <div className="class-card__header">
                <div className="class-info">
                    <h3 className="class-card__name">{classData.court?.name || 'Cancha no especificada'}</h3>
                    <p className="class-card__email">{formatDate(classData.reservation_date)}</p>
                </div>
                <div className={`class-card__status ${statusInfo.className}`}>
                    <i className={`bi ${statusInfo.icon}`}></i>
                    {statusInfo.text}
                </div>
            </div>

            <div className="class-card__content">
                <div className="class-info-item">
                    <span className="class-info-label">Horario:</span>
                    <span className="class-info-value schedule">
                        {formatTime(classData.start_time)} - {formatTime(classData.end_time)}
                    </span>
                </div>

                <div className="class-info-item">
                    <span className="class-info-label">Alumno:</span>
                    <span className="class-info-value">
                        {classData.user.first_name} {classData.user.last_name}
                    </span>
                </div>

                <div className="class-info-item">
                    <span className="class-info-label">Cancha:</span>
                    <span className="class-info-value">{classData.court?.name || 'No asignada'}</span>
                </div>

                {classData.notes && (
                    <div className="class-description">
                        <span className="class-info-label">Notas:</span>
                        <p className="class-description-text">{classData.notes}</p>
                    </div>
                )}
            </div>

            <div className="class-card__actions">
                <button className="class-action-btn details" onClick={() => handleViewDetails(classData.id)} title="Ver detalles de la clase" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <i className="bi bi-arrow-clockwise spin"></i>
                            Cargando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-eye"></i>
                            Ver Detalles
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ClassCard;
