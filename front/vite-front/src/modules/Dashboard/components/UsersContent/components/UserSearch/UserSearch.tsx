import React, { ChangeEvent } from 'react';
import './UserSearch.css';
import { UserSearchProps } from '../../types/types';

export const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, onSearchChange }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <div className="user-search">
            <i className="bi bi-search"></i>
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Buscar por nombre o email"
                aria-label="Buscar usuarios"
            />
        </div>
    );
};
