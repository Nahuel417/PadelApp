import React from 'react';
import './ReserveStatusBadge.css';
import { ReserveStatus } from '../../types/types';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/constants';

interface ReserveStatusBadgeProps {
    status: ReserveStatus;
}

export const ReserveStatusBadge: React.FC<ReserveStatusBadgeProps> = ({ status }) => {
    const colors = STATUS_COLORS[status];
    const label = STATUS_LABELS[status];

    return (
        <span
            className="reserve-status-badge"
            style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
            }}>
            {label}
        </span>
    );
};
