import React from 'react';
import './UserTableHeader.css';

export const UserTableHeader: React.FC = () => {
    return (
        <div className="user-table-header">
            <div className="user-col user-col-name">
                <span>Nombre</span>
            </div>
            <div className="user-col user-col-email">
                <span>Email</span>
            </div>
            <div className="user-col user-col-role">
                <span>Rol</span>
            </div>
            <div className="user-col user-col-status">
                <span>Estado</span>
            </div>
            <div className="user-col user-col-created">
                <span>Alta</span>
            </div>
            <div className="user-col user-col-actions">
                <span>Acciones</span>
            </div>
        </div>
    );
};
