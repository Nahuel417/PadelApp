import React from 'react';
import './SettingsHeader.css';

export interface SettingsHeaderProps {
    title: string;
    userRole: string;
    email: string;
    joinDate: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, userRole, email, joinDate }) => {
    const metrics = [
        { id: 'role', label: 'Rol Actual', value: userRole.toUpperCase() },
        { id: 'status', label: 'Estado', value: 'Activo' },
        { id: 'joined', label: 'Miembro desde', value: new Date(joinDate).toLocaleDateString('es-AR') },
    ];

    return (
        <div className="settings-header">
            <div className="settings-header-content">
                <h2 className="settings-header-title">{title}</h2>
                <span className="settings-header-caption">{email}</span>
            </div>

            <div className="settings-header-stats" role="list">
                {metrics.map((metric) => (
                    <div key={metric.id} className={`settings-header-stat settings-header-stat--${metric.id}`} role="listitem">
                        <span className="settings-header-stat-value">{metric.value}</span>
                        <span className="settings-header-stat-label">{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
