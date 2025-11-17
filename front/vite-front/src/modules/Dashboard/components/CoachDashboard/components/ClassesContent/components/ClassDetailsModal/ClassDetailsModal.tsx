import React from 'react';
import { CoachClass } from '../../../../../../../../services/coachServices';
import './ClassDetailsModal.css';

export interface ClassDetailsModalProps {
    isOpen: boolean;
    classDetails: CoachClass | null;
    onClose: () => void;
}

const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({ isOpen, classDetails, onClose }) => {
    if (!isOpen || !classDetails) return null;

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
                return '#60a5fa';
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

    const getPaymentDateText = () => {
        // Si el pago está pagado, mostrar la fecha de la clase
        // Si está pendiente, mostrar "Pendiente de pago"
        if (classDetails.payment_status === 'paid') {
            return formatDate(classDetails.reservation_date);
        }
        return 'Pendiente';
    };

    const getPaymentMethodText = () => {
        // Método de pago por defecto (puede ser expandido según BD)
        return 'Transferencia Bancaria';
    };

    return (
        <div className="class-details-modal-overlay" onClick={onClose}>
            <div className="class-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="class-details-modal__header">
                    <div className="details-header-left">
                        <div className="details-header-icon">
                            <i className="bi bi-calendar-event"></i>
                        </div>
                        <div className="details-header-text">
                            <h2>Detalles de la Clase</h2>
                            <p className="details-header-subtitle">{formatDate(classDetails.reservation_date)}</p>
                        </div>
                    </div>
                    <div className="details-header-actions">
                        <span className={`details-status-badge ${classDetails.status}`}>
                            <i
                                className={`bi ${
                                    classDetails.status === 'confirmed'
                                        ? 'bi-check-circle-fill'
                                        : classDetails.status === 'completed'
                                        ? 'bi-check-circle-fill'
                                        : classDetails.status === 'cancelled'
                                        ? 'bi-x-circle-fill'
                                        : 'bi-clock-fill'
                                }`}></i>
                            {getStatusText(classDetails.status)}
                        </span>
                    </div>
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
                                <span className="detail-value status-badge" style={{ color: getStatusColor(classDetails.status) }}>
                                    {getStatusText(classDetails.status)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Cancha</span>
                                <span className="detail-value">{classDetails.court?.name || 'No especificada'}</span>
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

                    {/* Información de pago */}
                    <div className="detail-section">
                        <h4 className="detail-section-title">
                            <i className="bi bi-credit-card"></i>
                            Información de Pago
                        </h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Monto Total</span>
                                <span className="detail-value price">${classDetails.total_amount.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado del Pago</span>
                                <span className={`detail-value payment-${classDetails.payment_status}`}>{getPaymentStatusText(classDetails.payment_status)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Fecha de Pago</span>
                                <span className="detail-value">{getPaymentDateText()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Método de Pago</span>
                                <span className="detail-value">{getPaymentMethodText()}</span>
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
                    <button className="btn-close" onClick={onClose}>
                        <i className="bi bi-x-circle"></i>
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsModal;
