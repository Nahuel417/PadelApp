import { DashboardManageableRole, DashboardUserRole } from '../types/types';

export const DEFAULT_USERS_PAGE_SIZE = 10;

export const ROLE_FILTERS: Array<{ id: DashboardUserRole; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'user', label: 'Usuarios' },
    { id: 'coach', label: 'Entrenadores' },
    { id: 'admin', label: 'Administradores' },
    { id: 'superadmin', label: 'Superadmins' },
];

export const ROLE_LABELS: Record<Exclude<DashboardUserRole, 'all'>, string> = {
    user: 'Usuario',
    coach: 'Entrenador',
    admin: 'Administrador',
    superadmin: 'Superadmin',
};

export const MANAGEABLE_ROLES: DashboardManageableRole[] = ['user', 'coach', 'admin'];

export const STATUS_LABELS: Record<'active' | 'inactive' | 'pending', string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
};

export const STATUS_COLORS: Record<'active' | 'inactive' | 'pending', { bg: string; text: string; border: string }> = {
    active: {
        bg: '#238744',
        text: '#ffffff',
        border: '#238744',
    },
    inactive: {
        bg: '#b91c1c',
        text: '#ffffff',
        border: '#b91c1c',
    },
    pending: {
        bg: '#d48806',
        text: '#ffffff',
        border: '#d48806',
    },
};
