import React from 'react';
import './UserRow.css';
import { UserRowProps } from '../../types/types';
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge';
import { formatUserDate } from '../../utils/userUtils';

export const UserRow: React.FC<UserRowProps> = ({ user, onSelectUser }) => {
    const handleManageClick = () => {
        onSelectUser?.(user.id);
    };

    return (
        <div className="user-row" role="row">
            <div className="user-col user-col-name" role="cell" aria-label="Nombre">
                <span className="user-name">{user.fullName}</span>
                {user.email && <small className="user-name-email">{user.email}</small>}
            </div>
            <div className="user-col user-col-email" role="cell" aria-label="Email">
                <span>{user.email || 'Sin email'}</span>
            </div>
            <div className="user-col user-col-role" role="cell" aria-label="Rol">
                <span className="user-role-chip">{user.roleLabel}</span>
            </div>
            <div className="user-col user-col-status" role="cell" aria-label="Estado">
                <UserStatusBadge status={user.status} />
            </div>
            <div className="user-col user-col-created" role="cell" aria-label="Fecha de alta">
                <span>{formatUserDate(user.createdAt)}</span>
            </div>
            <div className="user-col user-col-actions" role="cell" aria-label="Acciones">
                <button type="button" className="user-manage-button" onClick={handleManageClick}>
                    <i className="bi bi-pencil"></i>
                    <span>Gestionar</span>
                </button>
            </div>
        </div>
    );
};
