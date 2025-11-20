import React, { useState } from 'react';
import './ClassRow.css';
import { CoachClass } from '../../../../../../../../services/coachServices';

interface ClassRowProps {
    classItem: CoachClass;
    onViewDetails: (classItem: CoachClass) => void;
}

export const ClassRow: React.FC<ClassRowProps> = ({ classItem, onViewDetails }) => {
    const [isLoading, setIsLoading] = useState(false);
    const colors = {
        pending: { bg: '#dbeafe', text: '#3b82d9' },
        confirmed: { bg: '#e1f3ea', text: '#238744' },
        completed: { bg: '#dbeafe', text: '#3b82d9' },
        cancelled: { bg: '#fdeaea', text: '#b91c1c' },
    };

    const statusInfo = colors[classItem.status as keyof typeof colors] || colors.pending;

    // Formatear fecha
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Formatear hora
    const formatTime = (timeString: string): string => {
        return timeString.slice(0, 5);
    };

    // Extraer número de cancha
    const extractCourtNumber = (courtName: string | undefined): string => {
        if (!courtName) return '—';
        const match = courtName.match(/\d+/);
        return match ? match[0] : '—';
    };

    const startTime = formatTime(classItem.start_time);
    const endTime = formatTime(classItem.end_time);
    const courtNumber = extractCourtNumber(classItem.court?.name);
    const displayCourt = courtNumber === '—' ? '—' : `# ${courtNumber}`;

    // Traducir estados
    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            completed: 'Completada',
            cancelled: 'Cancelada',
        };
        return labels[status] || status;
    };

    // Manejar click en ver detalles con loading
    const handleViewDetails = async () => {
        setIsLoading(true);
        try {
            await onViewDetails(classItem);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`class-row ${classItem.status}`} style={{ borderColor: statusInfo.text }}>
            <div className="class-col class-col-date">
                <span>{formatDate(classItem.reservation_date)}</span>
            </div>
            <div className="class-col class-col-time">
                <span>
                    {startTime} - {endTime}
                </span>
            </div>
            <div className="class-col class-col-court">
                <span className="class-court-tag" aria-label={`Cancha ${courtNumber}`}>
                    {displayCourt}
                </span>
            </div>
            <div className="class-col class-col-user">
                <span>{classItem.user ? `${classItem.user.first_name} ${classItem.user.last_name}` : '—'}</span>
            </div>
            <div className="class-col class-col-affair">
                <span>{classItem.affair || '—'}</span>
            </div>
            <div className="class-col class-col-price">
                <span>${classItem.total_amount ? classItem.total_amount.toFixed(2) : '0.00'}</span>
            </div>
            <div className="class-col class-col-status">
                <span className={`status-badge ${classItem.status}`} style={{ color: statusInfo.text }}>
                    {getStatusLabel(classItem.status)}
                </span>
            </div>
            <div className="class-col class-col-actions">
                <button className="class-action-btn details" onClick={handleViewDetails} disabled={isLoading} title="Ver detalles">
                    {isLoading ? <div className="btn-spinner"></div> : <i className="bi bi-eye"></i>}
                </button>
            </div>
        </div>
    );
};
