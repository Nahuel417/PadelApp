import React, { useMemo, useCallback } from 'react';
import './UsersContent.css';
import { UsersContentProps } from './types/types';
import { UserHeader } from './components/UserHeader/UserHeader';
import { UserFilters } from './components/UserFilters/UserFilters';
import { UserSearch } from './components/UserSearch/UserSearch';
import { UserList } from './components/UserList/UserList';
import { useDashboardUsers } from '../../hooks/useDashboardUsers';
import { getUserHeaderStats } from './utils/userUtils';

const UsersContent: React.FC<UsersContentProps> = ({ userRole = 'admin' }) => {
    const { users, isLoading, error, currentPage, hasNextPage, roleFilter, searchTerm, setRoleFilter, setSearchTerm, onPageChange, refetch } = useDashboardUsers();

    const headerStats = useMemo(() => getUserHeaderStats(users), [users]);

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);
        },
        [setSearchTerm]
    );

    return (
        <div className="users-content">
            <UserHeader title="Gestión de Usuarios" stats={headerStats} />

            <div className="users-controls">
                <div className="users-control-group">
                    <UserFilters selectedRole={roleFilter} onRoleChange={setRoleFilter} />
                    <UserSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                </div>
            </div>

            {error ? (
                <div className="users-error">
                    <h3>Error al cargar usuarios</h3>
                    <p>{error}</p>
                    <button type="button" onClick={refetch}>
                        Reintentar
                    </button>
                </div>
            ) : (
                <UserList users={users} isLoading={isLoading} currentPage={currentPage} hasNextPage={hasNextPage} onPageChange={onPageChange} />
            )}
        </div>
    );
};

export default UsersContent;
