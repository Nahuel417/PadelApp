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

export interface UsersContentProps {
    userRole?: 'admin' | 'coach' | 'superadmin';
}

export interface UserHeaderStats {
    totalUsers: number;
    activeUsers: number;
    coaches: number;
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

export interface UserRowProps {
    user: DashboardUser;
    onSelectUser?: (id: string) => void;
}

export interface UserStatusBadgeProps {
    status: DashboardUserStatus;
}
