import React from 'react';
import './UserHeader.css';
import { UserHeaderProps } from '../../types/types';

export const UserHeader: React.FC<UserHeaderProps> = ({ title, stats }) => {
    return (
        <div className="user-header">
            <div className="user-header-content">
                <h2 className="user-header-title">{title}</h2>
                <div className="user-header-stats">
                    <span className="user-header-stat">
                        <strong>{stats.totalUsers}</strong> Totales
                    </span>
                    <span className="user-header-separator">•</span>
                    <span className="user-header-stat active">
                        <strong>{stats.activeUsers}</strong> Activos
                    </span>
                    <span className="user-header-separator">•</span>
                    <span className="user-header-stat coaches">
                        <strong>{stats.coaches}</strong> Entrenadores
                    </span>
                </div>
            </div>
        </div>
    );
};
