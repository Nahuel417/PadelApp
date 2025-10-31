import React, { useCallback } from 'react';
import './UserRow.css';
import { UserRowProps } from '../../types/types';
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge';
import { formatUserDate, getRoleChipClass } from '../../utils/userUtils';

export const UserRow: React.FC<UserRowProps> = ({ user, onSelectUser, onDeleteUser, isDeletingUser }) => {
    const handleManageClick = useCallback(() => {
        onSelectUser?.(user.id);
    }, [onSelectUser, user.id]);

    const handleDeleteClick = useCallback(() => {
        if (!onDeleteUser) return;
        onDeleteUser(user);
    }, [onDeleteUser, user]);

    const rowClassName = `user-row user-row--${user.status}`;
    const roleChipClassName = `user-role-chip ${getRoleChipClass(user.role)}`;

    return (
        <div className={rowClassName} role="row">
            <div className="user-col-r user-col-name" role="cell" aria-label="Nombre">
                <span className="user-name">{user.fullName}</span>
            </div>
            <div className="user-col-r user-col-email" role="cell" aria-label="Email">
                <span className="user-email">{user.email || 'Sin email'}</span>
            </div>
            <div className="user-col-r user-col-role" role="cell" aria-label="Rol">
                <span className={roleChipClassName} style={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: '600' }}>
                    {user.roleLabel}
                </span>
            </div>
            <div className="user-col-r user-col-status" role="cell" aria-label="Estado">
                <UserStatusBadge status={user.status} />
            </div>
            <div className="user-col-r user-col-created" role="cell" aria-label="Fecha de alta">
                <span>{formatUserDate(user.createdAt)}</span>
            </div>
            <div className="user-col-r user-col-actions" role="cell" aria-label="Acciones">
                <div className="user-actions">
                    <button type="button" className="user-manage-button" onClick={handleManageClick} aria-label={`Gestionar ${user.fullName}`}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    {onDeleteUser && (
                        <button
                            type="button"
                            className="user-delete-button"
                            onClick={handleDeleteClick}
                            aria-label={`Eliminar ${user.fullName}`}
                            disabled={isDeletingUser}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
