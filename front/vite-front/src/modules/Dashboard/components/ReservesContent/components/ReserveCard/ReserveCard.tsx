import React from 'react';
import './ReserveCard.css';
import { ReserveRowProps } from '../../types/types';
import { formatDate } from '../../utils/reserveUtils';
import { ReserveStatusBadge } from '../ReserveStatusBadge/ReserveStatusBadge';

export const ReserveCard: React.FC<ReserveRowProps> = ({ reserve, onApprove, onReject, onCancel }) => {
    const isPending = reserve.status === 'pending';
    const isCancellable = reserve.status === 'pending' || reserve.status === 'confirmed';

    return (
        <div className="reserve-card">
            <div className="reserve-card-header">
                <div className="reserve-card-title">
                    <h3 className="reserve-court-name">{reserve.courtName}</h3>
                    <ReserveStatusBadge status={reserve.status} />
                </div>
            </div>

            <div className="reserve-card-body">
                <div className="reserve-info-row">
                    <div className="reserve-info-item">
                        <span className="reserve-label">Fecha</span>
                        <span className="reserve-value">{formatDate(reserve.date)}</span>
                    </div>
                    <div className="reserve-info-item">
                        <span className="reserve-label">Horario</span>
                        <span className="reserve-value">
                            {reserve.startTime} - {reserve.endTime}
                        </span>
                    </div>
                </div>

                <div className="reserve-info-row">
                    <div className="reserve-info-item">
                        <span className="reserve-label">Usuario</span>
                        <span className="reserve-value">{reserve.userName}</span>
                    </div>
                    <div className="reserve-info-item">
                        <span className="reserve-label">Precio</span>
                        <span className="reserve-value reserve-price">${reserve.price}.00</span>
                    </div>
                </div>

                {reserve.trainerName && (
                    <div className="reserve-info-row">
                        <div className="reserve-info-item">
                            <span className="reserve-label">Entrenador</span>
                            <span className="reserve-value">{reserve.trainerName}</span>
                        </div>
                    </div>
                )}
            </div>

            {(isPending || isCancellable) && (
                <div className="reserve-card-actions">
                    {isPending && (
                        <>
                            <button
                                className="reserve-btn reserve-btn-approve"
                                onClick={() => onApprove?.(reserve.id)}
                                title="Aprobar reserva"
                            >
                                <i className="bi bi-check-circle"></i>
                                Aprobar
                            </button>
                            <button
                                className="reserve-btn reserve-btn-reject"
                                onClick={() => onReject?.(reserve.id)}
                                title="Rechazar reserva"
                            >
                                <i className="bi bi-x-circle"></i>
                                Rechazar
                            </button>
                        </>
                    )}
                    {isCancellable && (
                        <button
                            className="reserve-btn reserve-btn-cancel"
                            onClick={() => onCancel?.(reserve.id)}
                            title="Cancelar reserva"
                        >
                            <i className="bi bi-trash"></i>
                            Cancelar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
