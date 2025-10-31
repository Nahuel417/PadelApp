import React, { useMemo, useCallback } from 'react';
import './UsersContent.css';
import { UsersContentProps, DashboardUserRole } from './types/types';
import { UserHeader } from './components/UserHeader/UserHeader';
import FilterChips from '../../../../shared/components/Filters/FilterChips/FilterChips';
import SearchInput from '../../../../shared/components/SearchInput/SearchInput';
import { UserList } from './components/UserList/UserList';
import { useDashboardUsers } from '../../hooks/useDashboardUsers';
import { getUserHeaderStats } from './utils/userUtils';
import { ROLE_FILTERS } from './constants/constants';
import UserManagementModal from './components/UserManagementModal/UserManagementModal';

const UsersContent: React.FC<UsersContentProps> = ({ userRole = 'admin' }) => {
    const {
        users,
        isLoading,
        error,
        currentPage,
        hasNextPage,
        roleFilter,
        searchTerm,
        setRoleFilter: setRoleFilterValue,
        setSearchTerm,
        onPageChange,
        refetch,
        managementRoles,
        selectedUser,
        isManagementOpen,
        openManagement,
        closeManagement,
        changeUserRole,
        isUpdatingRole,
        updateRoleError,
        reservations,
        isLoadingReservations,
        reservationsError,
        reloadReservations,
        reservationsPage,
        reservationsHasNextPage,
        changeReservationsPage,
        hasLoadedReservations,
        loadReservations,
        deleteUser,
        isDeletingUser,
    } = useDashboardUsers();

    const headerStats = useMemo(() => getUserHeaderStats(users), [users]);

    const roleFilterOptions = useMemo(() => ROLE_FILTERS.map(({ id, label }) => ({ value: id === 'all' ? '' : id, label })), []);

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);
        },
        [setSearchTerm]
    );

    const handleRoleChange = useCallback(
        (value: string) => {
            const nextRole: DashboardUserRole = value ? (value as DashboardUserRole) : 'all';
            setRoleFilterValue(nextRole);
        },
        [setRoleFilterValue]
    );

    return (
        <div className="users-content">
            <UserHeader title="Panel de Gestión de Usuarios" stats={headerStats} />

            <div className="users-controls">
                <div className="users-control-group">
                    <FilterChips selectedValue={roleFilter === 'all' ? '' : roleFilter} onChange={handleRoleChange} options={roleFilterOptions} />
                    <SearchInput value={searchTerm} onChange={handleSearchChange} placeholder="Buscar por nombre o email" ariaLabel="Buscar usuarios" />
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
                <UserList
                    users={users}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    hasNextPage={hasNextPage}
                    onPageChange={onPageChange}
                    onSelectUser={openManagement}
                    onDeleteUser={deleteUser}
                    isDeletingUser={isDeletingUser}
                />
            )}

            <UserManagementModal
                isOpen={isManagementOpen}
                user={selectedUser}
                availableRoles={managementRoles}
                onClose={closeManagement}
                onChangeRole={changeUserRole}
                isUpdatingRole={isUpdatingRole}
                updateError={updateRoleError}
                reservations={reservations}
                isLoadingReservations={isLoadingReservations}
                reservationsError={reservationsError}
                onReloadReservations={reloadReservations}
                reservationsPage={reservationsPage}
                reservationsHasNextPage={reservationsHasNextPage}
                onReservationsPageChange={changeReservationsPage}
                hasLoadedReservations={hasLoadedReservations}
                onLoadReservations={loadReservations}
            />
        </div>
    );
};

export default UsersContent;
