import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchDashboardUsers, updateDashboardUserRole, fetchManagementReservations } from '../../../services/user';
import { DashboardManageableRole, DashboardUser, DashboardUserRole, UserReservationSummary } from '../components/UsersContent/types/types';
import { DEFAULT_USERS_PAGE_SIZE, MANAGEABLE_ROLES } from '../components/UsersContent/constants/constants';
import { buildDashboardUser, buildReservationSummary } from '../components/UsersContent/utils/userUtils';

interface UseDashboardUsersState {
    users: DashboardUser[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    hasNextPage: boolean;
    roleFilter: DashboardUserRole;
    searchTerm: string;
    setRoleFilter: (role: DashboardUserRole) => void;
    setSearchTerm: (value: string) => void;
    onPageChange: (page: number) => Promise<void>;
    refetch: () => Promise<void>;
    managementRoles: DashboardManageableRole[];
    selectedUser: DashboardUser | null;
    isManagementOpen: boolean;
    openManagement: (userId: string) => Promise<void>;
    closeManagement: () => void;
    changeUserRole: (role: DashboardManageableRole) => Promise<void>;
    isUpdatingRole: boolean;
    updateRoleError: string | null;
    reservations: UserReservationSummary[];
    isLoadingReservations: boolean;
    reservationsError: string | null;
    reloadReservations: () => Promise<void>;
}

export const useDashboardUsers = (initialRole: DashboardUserRole = 'all'): UseDashboardUsersState => {
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [roleFilter, setRoleFilter] = useState<DashboardUserRole>(initialRole);
    const [searchInput, setSearchInput] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    const [isManagementOpen, setIsManagementOpen] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);
    const [updateRoleError, setUpdateRoleError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<UserReservationSummary[]>([]);
    const [isLoadingReservations, setIsLoadingReservations] = useState<boolean>(false);
    const [reservationsError, setReservationsError] = useState<string | null>(null);

    useEffect(() => {
        const handler = window.setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 350);

        return () => {
            window.clearTimeout(handler);
        };
    }, [searchInput]);

    const fetchUsers = useCallback(
        async (page = 1): Promise<void> => {
            try {
                setIsLoading(true);
                setError(null);

                const { data, hasNextPage: nextPage } = await fetchDashboardUsers({
                    page,
                    limit: DEFAULT_USERS_PAGE_SIZE,
                    role: roleFilter,
                    search: debouncedSearch,
                });

                const mappedUsers = data.map(buildDashboardUser);

                setUsers(mappedUsers);
                setHasNextPage(nextPage);
                setCurrentPage(page);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios';
                setError(message);
                console.error('Error fetching dashboard users:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [roleFilter, debouncedSearch]
    );

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const onPageChange = useCallback(
        async (page: number): Promise<void> => {
            await fetchUsers(page);
        },
        [fetchUsers]
    );

    const refetch = useCallback(async (): Promise<void> => {
        await fetchUsers(1);
    }, [fetchUsers]);

    const safeSetRoleFilter = useCallback((nextRole: DashboardUserRole) => {
        setRoleFilter(nextRole);
        setCurrentPage(1);
    }, []);

    const selectedUser = useMemo<DashboardUser | null>(
        () => (selectedUserId ? users.find((user) => user.id === selectedUserId) ?? null : null),
        [selectedUserId, users]
    );

    const fetchReservationsForUser = useCallback(
        async (user: DashboardUser | null) => {
            if (!user) {
                setReservations([]);
                return;
            }

            try {
                setIsLoadingReservations(true);
                setReservationsError(null);

                const roleForQuery = user.role === 'all' ? 'user' : user.role;
                const data = await fetchManagementReservations({ userId: user.id, role: roleForQuery });
                const context = user.role === 'coach' ? 'coach' : 'user';
                const summaries = data.map((record) => buildReservationSummary(record, context));
                setReservations(summaries);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error al obtener el historial de reservas';
                setReservationsError(message);
                console.error('Error fetching management reservations:', err);
            } finally {
                setIsLoadingReservations(false);
            }
        },
        []
    );

    const openManagement = useCallback(
        async (userId: string) => {
            setSelectedUserId(userId);
            setIsManagementOpen(true);
            setUpdateRoleError(null);

            const user = users.find((item) => item.id === userId) ?? null;
            await fetchReservationsForUser(user);
        },
        [fetchReservationsForUser, users]
    );

    const closeManagement = useCallback(() => {
        setIsManagementOpen(false);
        setSelectedUserId(null);
        setReservations([]);
        setReservationsError(null);
        setUpdateRoleError(null);
    }, []);

    const reloadReservations = useCallback(async () => {
        await fetchReservationsForUser(selectedUser);
    }, [fetchReservationsForUser, selectedUser]);

    const changeUserRole = useCallback(
        async (role: DashboardManageableRole) => {
            if (!selectedUser) return;

            try {
                setIsUpdatingRole(true);
                setUpdateRoleError(null);

                await updateDashboardUserRole(selectedUser.id, role);
                await refetch();

                const updatedUser = users.find((item) => item.id === selectedUser.id);
                if (updatedUser) {
                    await fetchReservationsForUser(updatedUser);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'No se pudo actualizar el rol del usuario';
                setUpdateRoleError(message);
                console.error('Error updating dashboard user role:', err);
            } finally {
                setIsUpdatingRole(false);
            }
        },
        [fetchReservationsForUser, refetch, selectedUser, users]
    );

    return useMemo(
        () => ({
            users,
            isLoading,
            error,
            currentPage,
            hasNextPage,
            roleFilter,
            searchTerm: searchInput,
            setRoleFilter: safeSetRoleFilter,
            setSearchTerm: setSearchInput,
            onPageChange,
            refetch,
            managementRoles: MANAGEABLE_ROLES,
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
        }),
        [
            users,
            isLoading,
            error,
            currentPage,
            hasNextPage,
            roleFilter,
            searchInput,
            onPageChange,
            refetch,
            safeSetRoleFilter,
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
        ]
    );
};
