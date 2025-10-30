import { UserRole } from '../../../../../utils/enums/roles.enum';

export type DashboardUserRole = 'all' | 'user' | 'coach' | 'admin' | 'superadmin';

export type DashboardUserStatus = 'active' | 'inactive' | 'pending';

export interface DashboardUser {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: DashboardUserRole;
    roleLabel: string;
    status: DashboardUserStatus;
    createdAt: string;
}

export type DashboardManageableRole = 'user' | 'coach' | 'admin';

export interface UserReservationSummary {
    id: string;
    dateLabel: string;
    timeRange: string;
    status: string;
    courtName?: string;
    counterpartName?: string;
}

export interface UsersContentProps {
    userRole?: 'admin' | 'coach' | 'superadmin';
}

export interface UserHeaderStats {
    totalUsers: number;
    activeUsers: number;
    coaches: number;
    admins: number;
}

export interface UserHeaderProps {
    title: string;
    stats: UserHeaderStats;
}

export interface UserFiltersProps {
    selectedRole: DashboardUserRole;
    onRoleChange: (role: DashboardUserRole) => void;
}

export interface UserSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export interface UserListProps {
    users: DashboardUser[];
    isLoading?: boolean;
    currentPage?: number;
    hasNextPage?: boolean;
    onPageChange?: (page: number) => void;
    onSelectUser?: (id: string) => void;
}

export interface UserManagementModalProps {
    isOpen: boolean;
    user: DashboardUser | null;
    availableRoles: DashboardManageableRole[];
    onClose: () => void;
    onChangeRole: (role: DashboardManageableRole) => Promise<void> | void;
    isUpdatingRole: boolean;
    updateError?: string | null;
    reservations: UserReservationSummary[];
    isLoadingReservations: boolean;
    reservationsError?: string | null;
    onReloadReservations: () => Promise<void> | void;
}

export interface UserManagementState {
    selectedUserId: string | null;
    selectedUser: DashboardUser | null;
    isModalOpen: boolean;
    isUpdatingRole: boolean;
    updateError: string | null;
    reservations: UserReservationSummary[];
    isLoadingReservations: boolean;
    reservationsError: string | null;
}

export interface UserRowProps {
    user: DashboardUser;
    onSelectUser?: (id: string) => void;
}

export interface UserStatusBadgeProps {
    status: DashboardUserStatus;
}
