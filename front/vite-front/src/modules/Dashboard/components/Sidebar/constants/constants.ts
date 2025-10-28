import { MenuItem } from '../types/types';

export const COMMON_MENU_ITEMS: MenuItem[] = [{ id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' }];

export const COACH_MENU_ITEMS: MenuItem[] = [
    { id: 'mis-clases', label: 'Mis Clases', icon: 'bi-calendar2-check' },
    { id: 'alumnos', label: 'Mis Alumnos', icon: 'bi-people' },
    { id: 'horarios', label: 'Horarios', icon: 'bi-clock' },
    { id: 'perfil', label: 'Mi Perfil', icon: 'bi-person' },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
    { id: 'reservas', label: 'Reservas', icon: 'bi-calendar-event' },
    { id: 'usuarios', label: 'Usuarios', icon: 'bi-people' },
    { id: 'canchas', label: 'Canchas', icon: 'bi-layout-three-columns' },
    { id: 'entrenadores', label: 'Entrenadores', icon: 'bi-person-badge' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-bar-chart' },
];

export const SUPER_ADMIN_MENU_ITEMS: MenuItem[] = [
    { id: 'reservas', label: 'Reservas', icon: 'bi-calendar-event' },
    { id: 'usuarios', label: 'Usuarios', icon: 'bi-people' },
    { id: 'canchas', label: 'Canchas', icon: 'bi-layout-three-columns' },
    { id: 'entrenadores', label: 'Entrenadores', icon: 'bi-person-badge' },
    { id: 'admins', label: 'Administradores', icon: 'bi-person-check' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-bar-chart' },
    { id: 'configuracion', label: 'Configuración', icon: 'bi-gear' },
];

export const SETTINGS_ITEM: MenuItem = {
    id: 'configuracion',
    label: 'Configuración',
    icon: 'bi-gear',
};
