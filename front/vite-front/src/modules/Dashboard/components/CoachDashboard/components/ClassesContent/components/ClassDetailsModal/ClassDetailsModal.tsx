import React from 'react';
import { CoachClass } from '../../../../../../../../services/coachServices';
import './ClassDetailsModal.css';

export interface ClassDetailsModalProps {
    isOpen: boolean;
    classDetails: CoachClass | null;
    onClose: () => void;
}

const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({
    isOpen,
    classDetails,
    onClose
}) => {
    if (!isOpen || !classDetails) return null;

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
        return timeString.slice(0, 5);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return '#238744';
            case 'completed':
                return '#238744';
            case 'cancelled':
                return '#b91c1c';
            case 'pending':
            default:
                return '#856404';
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

    return (
        <div className="class-details-modal-overlay" onClick={onClose}>
            <div className="class-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="class-details-modal__header">
                    <h3 className="class-details-modal__title">Detalles de la Clase</h3>
                    <button 
                        className="class-details-modal__close"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="class-details-modal__content">
                    {/* Información de fecha y hora */}
                    <div className="detail-section">
                        <h4 className="detail-section-title">
                            <i className="bi bi-calendar-event"></i>
                            Información de la Clase
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Fecha</span>
                                <span className="detail-value">{formatDate(classDetails.reservation_date)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Horario</span>
                                <span className="detail-value">
                                    {formatTime(classDetails.start_time)} - {formatTime(classDetails.end_time)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado</span>
                                <span 
                                    className="detail-value status-badge"
                                    style={{ color: getStatusColor(classDetails.status) }}
                                >
                                    {getStatusText(classDetails.status)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Tipo de Clase</span>
                                <span className="detail-value">{classDetails.affair}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información del alumno */}
                    <div className="detail-section">
                        <h4 className="detail-section-title">
                            <i className="bi bi-person"></i>
                            Información del Alumno
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Nombre</span>
                                <span className="detail-value">
                                    {classDetails.user.first_name} {classDetails.user.last_name}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{classDetails.user.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información de la cancha */}
                    {classDetails.court && (
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <i className="bi bi-geo-alt"></i>
                                Información de la Cancha
                            </h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Cancha</span>
                                    <span className="detail-value">{classDetails.court.name}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información de pago */}
                    <div className="detail-section">
                        <h4 className="detail-section-title">
                            <i className="bi bi-credit-card"></i>
                            Información de Pago
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Monto Total</span>
                                <span className="detail-value price">
                                    ${classDetails.total_amount.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado del Pago</span>
                                <span className={`detail-value payment-${classDetails.payment_status}`}>
                                    {getPaymentStatusText(classDetails.payment_status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notas */}
                    {classDetails.notes && (
                        <div className="detail-section">
                            <h4 className="detail-section-title">
                                <i className="bi bi-chat-text"></i>
                                Notas
                            </h4>
                            <div className="notes-content">
                                <p>{classDetails.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="class-details-modal__footer">
                    <button 
                        className="modal-btn secondary"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsModal;
