import React from 'react';
import './ReserveDetailsModal.css';
import { Reserve } from '../../types/types';
import { formatDate, formatTime, extractCourtNumber } from '../../utils/reserveUtils';

interface ReserveDetailsModalProps {
    isOpen: boolean;
    reserve: Reserve | null;
    onClose: () => void;
}

const PAYMENT_STATUS_LABELS = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
};

const PAYMENT_METHOD_LABELS = {
    credit_card: 'Tarjeta de crédito',
    debit_card: 'Tarjeta de débito',
    bank_transfer: 'Transferencia bancaria',
    cash: 'Efectivo',
    digital_wallet: 'Billetera digital',
};

const STATUS_LABELS = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
};

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const ReserveDetailsModal: React.FC<ReserveDetailsModalProps> = ({ isOpen, reserve, onClose }) => {
    if (!isOpen || !reserve) return null;

    const courtNumber = extractCourtNumber(reserve.courtName);
    const displayCourt = courtNumber === '—' ? '—' : `# ${courtNumber}`;

    return (
        <div className="reserve-modal-overlay" onClick={onClose}>
            <div className="reserve-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="reserve-ticket">
                    {/* Header del ticket */}
                    <div className="ticket-header">
                        <div className="ticket-title">
                            <h2>Detalle de Reserva</h2>
                            <span className="ticket-id">#{reserve.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* Estado de la reserva */}
                    <div className="ticket-status-section">
                        <div className={`ticket-status-badge ${reserve.status}`}>{STATUS_LABELS[reserve.status]}</div>
                        <div className={`ticket-payment-badge ${reserve.payment_status || 'pending'}`}>
                            Pago: {PAYMENT_STATUS_LABELS[reserve.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || 'Pendiente'}
                        </div>
                    </div>

                    {/* Información principal */}
                    <div className="ticket-main-info">
                        <div className="ticket-section">
                            <h3>Información de la Reserva</h3>
                            <div className="ticket-info-grid">
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Fecha:</span>
                                    <span className="ticket-value">{formatDate(reserve.date)}</span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Horario:</span>
                                    <span className="ticket-value">
                                        {formatTime(reserve.startTime)} - {formatTime(reserve.endTime)}
                                    </span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Cancha:</span>
                                    <span className="ticket-value court-tag">{displayCourt}</span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Usuario:</span>
                                    <span className="ticket-value">{reserve.userName}</span>
                                </div>
                                {reserve.trainerName && (
                                    <div className="ticket-info-item">
                                        <span className="ticket-label">Entrenador:</span>
                                        <span className="ticket-value">{reserve.trainerName}</span>
                                    </div>
                                )}
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Duración:</span>
                                    <span className="ticket-value">
                                        {(() => {
                                            const start = new Date(`2000-01-01T${reserve.startTime}`);
                                            const end = new Date(`2000-01-01T${reserve.endTime}`);
                                            const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                                            return `${diff} minutos`;
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Información de pagos */}
                        <div className="ticket-section">
                            <h3>Información de Pago</h3>
                            <div className="ticket-info-grid">
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Estado del Pago:</span>
                                    <span className={`ticket-value payment-status ${reserve.payment_status || 'pending'}`}>
                                        {PAYMENT_STATUS_LABELS[reserve.payment_status as keyof typeof PAYMENT_STATUS_LABELS] || 'Pendiente'}
                                    </span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Monto Total:</span>
                                    <span className="ticket-value price">${reserve.total_amount?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">Método de Pago:</span>
                                    <span className="ticket-value">{reserve.payment_method ? PAYMENT_METHOD_LABELS[reserve.payment_method] : PAYMENT_METHOD_LABELS.cash}</span>
                                </div>
                                <div className="ticket-info-item">
                                    <span className="ticket-label">ID de Reserva:</span>
                                    <span className="ticket-value">{reserve.id.slice(-12).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Información de fechas */}
                        <div className="ticket-section">
                            <h3>Historial</h3>
                            <div className="ticket-timeline-grid">
                                <div className="timeline-item">
                                    <div className="timeline-icon created">
                                        <i className="bi bi-plus-circle"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <span className="timeline-label">Creada:</span>
                                        <span className="timeline-value">{reserve.created_at ? formatDateTime(reserve.created_at) : 'No disponible'}</span>
                                    </div>
                                </div>

                                {reserve.status === 'cancelled' && reserve.cancelled_at && (
                                    <div className="timeline-item">
                                        <div className="timeline-icon cancelled">
                                            <i className="bi bi-x-circle"></i>
                                        </div>
                                        <div className="timeline-content">
                                            <span className="timeline-label">Cancelada:</span>
                                            <span className="timeline-value">{formatDateTime(reserve.cancelled_at)}</span>
                                        </div>
                                    </div>
                                )}

                                {reserve.status === 'confirmed' && (
                                    <div className="timeline-item">
                                        <div className="timeline-icon confirmed">
                                            <i className="bi bi-check-circle"></i>
                                        </div>
                                        <div className="timeline-content">
                                            <span className="timeline-label">Confirmada:</span>
                                            <span className="timeline-value">{reserve.payment_status === 'approved' ? 'Pago aprobado' : 'Pendiente de pago'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notas adicionales */}
                        {reserve.notes && (
                            <div className="ticket-section">
                                <h3>Notas</h3>
                                <div className="ticket-notes">{reserve.notes}</div>
                            </div>
                        )}
                    </div>

                    {/* Footer del ticket */}
                    <div className="ticket-footer">
                        <button className="ticket-print-button" type="button">
                            <i className="bi bi-printer"></i>
                            Imprimir comprobante
                        </button>
                        <div className="ticket-footer-info">
                            <small>PadelApp - Sistema de Gestión de Reservas</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReserveDetailsModal;
