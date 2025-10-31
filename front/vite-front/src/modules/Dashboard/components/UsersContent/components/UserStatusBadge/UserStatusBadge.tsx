import React from 'react';
import './UserStatusBadge.css';
import { UserStatusBadgeProps } from '../../types/types';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/constants';

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
    const colors = STATUS_COLORS[status];

    return (
        <span className="user-status-badge" style={{ color: '#238744' }}>
            {STATUS_LABELS[status]}
        </span>
    );
};
