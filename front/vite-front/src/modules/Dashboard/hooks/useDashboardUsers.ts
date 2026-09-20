import { useCallback, useEffect, useMemo, useState } from 'react';
import swal from 'sweetalert';
import { fetchDashboardUsers, updateDashboardUserRole, fetchManagementReservations, deleteDashboardUser } from '../../../services/user';
import { DashboardManageableRole, DashboardUser, DashboardUserRole, UserReservationSummary } from '../components/UsersContent/types/types';
import { DEFAULT_USERS_PAGE_SIZE, MANAGEABLE_ROLES, ROLE_LABELS } from '../components/UsersContent/constants/constants';
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
    reservationsPage: number;
    reservationsHasNextPage: boolean;
    changeReservationsPage: (page: number) => Promise<void>;
    hasLoadedReservations: boolean;
    loadReservations: () => Promise<void>;
    deleteUser: (user: DashboardUser) => Promise<void>;
    isDeletingUser: boolean;
}

const RESERVATIONS_PAGE_SIZE = 5;

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
    const [reservationsPage, setReservationsPage] = useState<number>(1);
    const [reservationsHasNextPage, setReservationsHasNextPage] = useState<boolean>(false);
    const [hasLoadedReservations, setHasLoadedReservations] = useState<boolean>(false);
    const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false);

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
        async (user: DashboardUser | null, page = 1) => {
            if (!user) {
                setReservations([]);
                setReservationsPage(1);
                setReservationsHasNextPage(false);
                setHasLoadedReservations(false);
                return;
            }

            try {
                setIsLoadingReservations(true);
                setReservationsError(null);
                setReservationsPage(page);

                const roleForQuery = user.role === 'all' ? 'user' : user.role;
                const { data, hasNextPage } = await fetchManagementReservations({
                    userId: user.id,
                    role: roleForQuery,
                    page,
                    limit: RESERVATIONS_PAGE_SIZE,
                });
                const context = user.role === 'coach' ? 'coach' : 'user';
                const summaries = data.map((record) => buildReservationSummary(record, context));
                setReservations(summaries);
                setReservationsHasNextPage(hasNextPage);
                setHasLoadedReservations(true);
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
            setReservations([]);
            setReservationsError(null);
            setReservationsPage(1);
            setReservationsHasNextPage(false);
            setHasLoadedReservations(false);
        },
        [users]
    );

    const closeManagement = useCallback(() => {
        setIsManagementOpen(false);
        setSelectedUserId(null);
        setReservations([]);
        setReservationsError(null);
        setUpdateRoleError(null);
        setReservationsPage(1);
        setReservationsHasNextPage(false);
        setHasLoadedReservations(false);
    }, []);

    const reloadReservations = useCallback(async () => {
        if (!selectedUser || !hasLoadedReservations) return;
        await fetchReservationsForUser(selectedUser, reservationsPage);
    }, [fetchReservationsForUser, hasLoadedReservations, reservationsPage, selectedUser]);

    const changeReservationsPage = useCallback(
        async (page: number) => {
            if (!selectedUser || page < 1 || !hasLoadedReservations) return;
            await fetchReservationsForUser(selectedUser, page);
        },
        [fetchReservationsForUser, hasLoadedReservations, selectedUser]
    );

    const loadReservations = useCallback(async () => {
        if (!selectedUser || hasLoadedReservations || isLoadingReservations) return;
        await fetchReservationsForUser(selectedUser, 1);
    }, [fetchReservationsForUser, hasLoadedReservations, isLoadingReservations, selectedUser]);

    const changeUserRole = useCallback(
        async (role: DashboardManageableRole) => {
            if (!selectedUser) return;

            try {
                const nextRoleLabel = ROLE_LABELS[role];
                const confirmed = await swal({
                    title: 'Confirmar cambio de rol',
                    text: `¿Deseás cambiar el rol de ${selectedUser.fullName} a ${nextRoleLabel}?`,
                    icon: 'warning',
                    buttons: ['Cancelar', 'Confirmar'],
                    dangerMode: true,
                });

                if (!confirmed) return;

                setIsUpdatingRole(true);
                setUpdateRoleError(null);

                await updateDashboardUserRole(selectedUser.id, role);
                await refetch();

                const updatedUser = users.find((item) => item.id === selectedUser.id);
                const refreshedUser = updatedUser ?? {
                    ...selectedUser,
                    role,
                    roleLabel: ROLE_LABELS[role],
                };

                if (hasLoadedReservations) {
                    await fetchReservationsForUser(refreshedUser, 1);
                }

                await swal({
                    title: 'Rol actualizado',
                    icon: 'success',
                    buttons: {
                        confirm: {
                            text: 'Aceptar',
                            value: true,
                        },
                    },
                });
            } catch (err) {
                setUpdateRoleError('No se pudo actualizar el rol del usuario');
                console.error('Error updating dashboard user role:', err);
            } finally {
                setIsUpdatingRole(false);
            }
        },
        [fetchReservationsForUser, hasLoadedReservations, refetch, selectedUser, users]
    );

    const deleteUser = useCallback(
        async (user: DashboardUser) => {
            const confirmed = await swal({
                title: '¿Eliminar usuario?',
                text: `Esta acción eliminará permanentemente a ${user.fullName}.`,
                icon: 'warning',
                buttons: ['Cancelar', 'Eliminar'],
                dangerMode: true,
            });

            if (!confirmed) return;

            try {
                setIsDeletingUser(true);
                await deleteDashboardUser(user.id);

                if (selectedUserId === user.id) {
                    closeManagement();
                }

                await refetch();

                await swal({
                    title: 'Usuario eliminado',
                    icon: 'success',
                    buttons: {
                        confirm: {
                            text: 'Aceptar',
                            value: true,
                        },
                    },
                });
            } catch (err) {
                console.error('Error deleting dashboard user:', err);
                await swal({
                    title: 'No se pudo eliminar el usuario',
                    text: err instanceof Error ? err.message : 'Intentalo nuevamente más tarde.',
                    icon: 'error',
                    buttons: {
                        confirm: {
                            text: 'Aceptar',
                            value: true,
                        },
                    },
                });
            } finally {
                setIsDeletingUser(false);
            }
        },
        [closeManagement, refetch, selectedUserId]
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
            reservationsPage,
            reservationsHasNextPage,
            changeReservationsPage,
            hasLoadedReservations,
            loadReservations,
            deleteUser,
            isDeletingUser,
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
            reservationsPage,
            reservationsHasNextPage,
            changeReservationsPage,
            hasLoadedReservations,
            loadReservations,
            deleteUser,
            isDeletingUser,
        ]
    );
};
