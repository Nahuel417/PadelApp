import React from 'react';
import './UserList.css';
import { UserListProps } from '../../types/types';
import { UserTableHeader } from '../UserTableHeader/UserTableHeader';
import { UserRow } from '../UserRow/UserRow';
import { Pagination, Spinner } from '../../../../../../shared';

export const UserList: React.FC<UserListProps> = ({ users, isLoading, currentPage = 1, hasNextPage, onPageChange, onSelectUser }) => {
    if (isLoading && users.length === 0) {
        return (
            <div className="user-list-loading">
                <Spinner />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="user-list-empty">
                <i className="bi bi-people"></i>
                <p>No se encontraron usuarios para mostrar.</p>
            </div>
        );
    }

    return (
        <div className="user-table-container">
            <UserTableHeader />
            <div className="user-table" role="table" aria-label="Listado de usuarios">
                {users.map((user) => (
                    <UserRow key={user.id} user={user} onSelectUser={onSelectUser} />
                ))}
            </div>

            {onPageChange && (
                <Pagination currentPage={currentPage} hasNextPage={hasNextPage || false} onPageChange={onPageChange} />
            )}
        </div>
    );
};
