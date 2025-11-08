import React from 'react';
import { CoachClass } from '../../../../../../../../../../services/coachServices';
import './ClassCard.css';

export interface ClassCardProps {
    classItem: CoachClass;
    onViewDetails: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, onViewDetails }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // Remove seconds from HH:MM:SS
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'confirmed';
            case 'completed':
                return 'completed';
            case 'cancelled':
                return 'cancelled';
            case 'pending':
            default:
                return 'pending';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmada';
            case 'completed':
                return 'Completada';
            case 'cancelled':
                return 'Cancelada';
            case 'pending':
            default:
                return 'Pendiente';
        }
    };

    const getPaymentStatusText = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'paid':
                return 'Pagado';
            case 'pending':
                return 'Pendiente';
            case 'failed':
                return 'Fallido';
            default:
                return 'Sin definir';
        }
    };

    const isUpcoming = new Date(classItem.reservation_date) >= new Date();

    return (
        <div className={`class-card ${!isUpcoming ? 'past' : ''}`}>
            <div className="class-card__header">
                <div className="class-card__date-time">
                    <h4 className="class-card__date">{formatDate(classItem.reservation_date)}</h4>
                    <p className="class-card__time">
                        {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                    </p>
                </div>
                <div className={`class-card__status ${getStatusColor(classItem.status)}`}>
                    <i className={`bi ${
                        classItem.status === 'confirmed' ? 'bi-check-circle-fill' :
                        classItem.status === 'completed' ? 'bi-check-circle-fill' :
                        classItem.status === 'cancelled' ? 'bi-x-circle-fill' :
                        'bi-clock-fill'
                    }`}></i>
                    {getStatusText(classItem.status)}
                </div>
            </div>

            <div className="class-card__content">
                <div className="class-info-item">
                    <span className="class-info-label">Alumno:</span>
                    <span className="class-info-value">
                        {classItem.user.first_name} {classItem.user.last_name}
                    </span>
                </div>

                {classItem.court && (
                    <div className="class-info-item">
                        <span className="class-info-label">Cancha:</span>
                        <span className="class-info-value">{classItem.court.name}</span>
                    </div>
                )}

                <div className="class-info-item">
                    <span className="class-info-label">Tipo:</span>
                    <span className="class-info-value">{classItem.affair}</span>
                </div>

                <div className="class-info-item">
                    <span className="class-info-label">Monto:</span>
                    <span className="class-info-value price">
                        ${classItem.total_amount.toLocaleString('es-AR')}
                    </span>
                </div>

                <div className="class-info-item">
                    <span className="class-info-label">Pago:</span>
                    <span className={`class-info-value payment-${classItem.payment_status}`}>
                        {getPaymentStatusText(classItem.payment_status)}
                    </span>
                </div>

                {classItem.notes && (
                    <div className="class-info-item full-width">
                        <span className="class-info-label">Notas:</span>
                        <span className="class-info-value">{classItem.notes}</span>
                    </div>
                )}
            </div>

            <div className="class-card__actions">
                <button 
                    className="class-action-btn details"
                    onClick={onViewDetails}
                    title="Ver detalles"
                >
                    <i className="bi bi-eye"></i>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
};

export default ClassCard;
