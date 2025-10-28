import React from 'react';
import './ReserveRow.css';
import { ReserveRowProps } from '../../types/types';
import { formatDate } from '../../utils/reserveUtils';

export const ReserveRow: React.FC<ReserveRowProps> = ({ reserve, onApprove, onReject, onCancel }) => {
    const colors = {
        pending: { bg: '#dbeafe', text: '#3b82d9' },
        confirmed: { bg: '#e1f3ea', text: '#238744' },
        completed: { bg: '#dbeafe', text: '#3b82d9' },
        cancelled: { bg: '#fdeaea', text: '#b91c1c' }
    };
    const statusInfo = colors[reserve.status];
    const isPending = reserve.status === 'pending';
    const isCancellable = reserve.status === 'pending' || reserve.status === 'confirmed';

    return (
        <div className={`reserve-row ${reserve.status}`} style={{ borderColor: statusInfo.text }}>
            <div className="reserve-col reserve-col-date">
                <span>{formatDate(reserve.date)}</span>
            </div>
            <div className="reserve-col reserve-col-time">
                <span>
                    {reserve.startTime} - {reserve.endTime}
                </span>
            </div>
            <div className="reserve-col reserve-col-court">
                <span>{reserve.courtName}</span>
            </div>
            <div className="reserve-col reserve-col-user">
                <span>{reserve.userName}</span>
            </div>
            <div className="reserve-col reserve-col-trainer">
                <span>{reserve.trainerName || '—'}</span>
            </div>
            <div className="reserve-col reserve-col-price">
                <span>${reserve.price}.00</span>
            </div>
            <div className="reserve-col reserve-col-status">
                <span className={`status-badge ${reserve.status}`} style={{ color: statusInfo.text }}>
                    {reserve.status === 'pending' && 'Pendiente'}
                    {reserve.status === 'confirmed' && 'Confirmada'}
                    {reserve.status === 'completed' && 'Completada'}
                    {reserve.status === 'cancelled' && 'Cancelada'}
                </span>
            </div>
            <div className="reserve-col reserve-col-actions">
                {isPending && (
                    <>
                        <button className="reserve-action-btn approve" onClick={() => onApprove?.(reserve.id)} title="Aprobar">
                            <i className="bi bi-check-circle"></i>
                        </button>
                        <button className="reserve-action-btn reject" onClick={() => onReject?.(reserve.id)} title="Rechazar">
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </>
                )}
                {isCancellable && (
                    <button className="reserve-action-btn cancel" onClick={() => onCancel?.(reserve.id)} title="Cancelar">
                        <i className="bi bi-trash"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
