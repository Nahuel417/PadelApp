import React from 'react';
import './UserStatusBadge.css';
import { UserStatusBadgeProps } from '../../types/types';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/constants';

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
    const colors = STATUS_COLORS[status];

    return (
        <span className="user-status-badge" style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}>
            {STATUS_LABELS[status]}
        </span>
    );
};
