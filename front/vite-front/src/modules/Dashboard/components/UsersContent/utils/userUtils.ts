import { UserRole } from '../../../../../utils/enums/roles.enum';
import { DashboardUser, DashboardUserRole, DashboardUserStatus, UserHeaderStats } from '../types/types';
import { ROLE_LABELS } from '../constants/constants';

const ROLE_ID_TO_DASHBOARD_ROLE: Record<UserRole, Exclude<DashboardUserRole, 'all'>> = {
    [UserRole.USER]: 'user',
    [UserRole.COACH]: 'coach',
    [UserRole.ADMIN]: 'admin',
    [UserRole.SUPERADMIN]: 'superadmin',
};

const normalizeStatus = (status?: string | null): DashboardUserStatus => {
    if (!status) return 'active';

    const normalized = status.toLowerCase();

    if (normalized === 'active' || normalized === 'inactive' || normalized === 'pending') {
        return normalized;
    }

    return 'active';
};

export const mapRoleIdToDashboardRole = (roleId?: number | null): Exclude<DashboardUserRole, 'all'> => {
    if (!roleId || !(roleId in ROLE_ID_TO_DASHBOARD_ROLE)) {
        return 'user';
    }

    return ROLE_ID_TO_DASHBOARD_ROLE[roleId as UserRole];
};

export const getRoleLabel = (role: DashboardUserRole): string => {
    if (role === 'all') return 'Todos';
    return ROLE_LABELS[role] ?? 'Usuario';
};

export const formatUserDate = (isoDate: string): string => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const buildDashboardUser = (record: any): DashboardUser => {
    const role = mapRoleIdToDashboardRole(record?.role_id);
    const firstName = record?.first_name ?? '';
    const lastName = record?.last_name ?? '';
    const email = record?.email ?? '';

    const fullName = [firstName, lastName].filter(Boolean).join(' ') || email || 'Sin nombre';

    return {
        id: record?.id ?? crypto.randomUUID(),
        firstName,
        lastName,
        fullName,
        email,
        role,
        roleLabel: getRoleLabel(role),
        status: normalizeStatus(record?.status),
        createdAt: record?.created_at ?? '',
    };
};

export const getUserHeaderStats = (users: DashboardUser[]): UserHeaderStats => {
    return {
        totalUsers: users.length,
        activeUsers: users.filter((user) => user.status === 'active').length,
        coaches: users.filter((user) => user.role === 'coach').length,
    };
};
