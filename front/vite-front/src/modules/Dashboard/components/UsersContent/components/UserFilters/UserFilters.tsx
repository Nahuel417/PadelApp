import React from 'react';
import './UserFilters.css';
import { UserFiltersProps } from '../../types/types';
import { ROLE_FILTERS } from '../../constants/constants';

export const UserFilters: React.FC<UserFiltersProps> = ({ selectedRole, onRoleChange }) => {
    return (
        <div className="user-filters">
            {ROLE_FILTERS.map((role) => (
                <button key={role.id} className={`user-filter-btn ${selectedRole === role.id ? 'active' : ''}`} onClick={() => onRoleChange(role.id)}>
                    {role.label}
                </button>
            ))}
        </div>
    );
};
