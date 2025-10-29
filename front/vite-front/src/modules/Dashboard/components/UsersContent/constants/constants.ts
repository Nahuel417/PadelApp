import { DashboardUserRole } from '../types/types';

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

export const STATUS_LABELS: Record<'active' | 'inactive' | 'pending', string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
};

export const STATUS_COLORS: Record<'active' | 'inactive' | 'pending', { bg: string; text: string; border: string }> = {
    active: {
        bg: '#e1f3ea',
        text: '#238744',
        border: '#a3d9c3',
    },
    inactive: {
        bg: '#fdeaea',
        text: '#b91c1c',
        border: '#f5b5b5',
    },
    pending: {
        bg: '#fff4d6',
        text: '#d48806',
        border: '#f3c969',
    },
};
