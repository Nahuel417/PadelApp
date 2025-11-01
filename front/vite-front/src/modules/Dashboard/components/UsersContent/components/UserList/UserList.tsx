import React from 'react';
import './UserList.css';
import { UserListProps } from '../../types/types';
import { UserTableHeader } from '../UserTableHeader/UserTableHeader';
import { UserRow } from '../UserRow/UserRow';
import { Pagination, Spinner } from '../../../../../../shared';

export const UserList: React.FC<UserListProps> = ({ users, isLoading, currentPage = 1, hasNextPage, onPageChange, onSelectUser, onDeleteUser, isDeletingUser }) => {
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
                <div className="user-empty-icon">
                    <i className="bi bi-people"></i>
                </div>
                <div className="user-empty-content">
                    <h3>No encontramos usuarios</h3>
                    <p>Probá ajustando el rol o buscá con otro término.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-table-container">
            <UserTableHeader />
            <div className="user-table" role="table" aria-label="Listado de usuarios">
                {users.map((user) => (
                    <UserRow key={user.id} user={user} onSelectUser={onSelectUser} onDeleteUser={onDeleteUser} isDeletingUser={isDeletingUser} />
                ))}
            </div>

            {onPageChange && (
                <Pagination currentPage={currentPage} hasNextPage={hasNextPage || false} onPageChange={onPageChange} />
            )}
        </div>
    );
};
