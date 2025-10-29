import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchDashboardUsers } from '../../../services/user';
import { DashboardUser, DashboardUserRole } from '../components/UsersContent/types/types';
import { DEFAULT_USERS_PAGE_SIZE } from '../components/UsersContent/constants/constants';
import { buildDashboardUser } from '../components/UsersContent/utils/userUtils';

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

    return useMemo(
        () => ({
            users,
            isLoading,
            error,
            currentPage,
            hasNextPage,
            roleFilter,
            searchTerm: searchInput,
            setRoleFilter,
            setSearchTerm: setSearchInput,
            onPageChange,
            refetch,
        }),
        [users, isLoading, error, currentPage, hasNextPage, roleFilter, searchInput, onPageChange, refetch]
    );
};
