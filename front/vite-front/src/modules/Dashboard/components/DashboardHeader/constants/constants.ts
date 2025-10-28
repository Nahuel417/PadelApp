import { UserRole } from '../types/types';

export const ROLE_LABELS: Record<UserRole, string> = {
    superadmin: 'Super Administrador',
    admin: 'Administrador',
    coach: 'Entrenador'
};

export const DEFAULT_HEADER_TITLE = 'Dashboard General';

export const SECTION_TITLES: Record<string, string> = {
    dashboard: 'Dashboard General',
    'mis-clases': 'Mis Clases',
    alumnos: 'Mis Alumnos',
    horarios: 'Horarios',
    perfil: 'Mi Perfil',
    reservas: 'Gestión de Reservas',
    usuarios: 'Gestión de Usuarios',
    canchas: 'Gestión de Canchas',
    entrenadores: 'Gestión de Entrenadores',
    admins: 'Gestión de Administradores',
    reportes: 'Reportes y Estadísticas',
    configuracion: 'Configuración del Sistema'
};
