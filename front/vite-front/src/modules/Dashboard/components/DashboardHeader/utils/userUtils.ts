import { UserRole } from '../types/types';
import { ROLE_LABELS, SECTION_TITLES, DEFAULT_HEADER_TITLE } from '../constants/constants';

/**
 * Obtiene las iniciales de un nombre
 * @param name - Nombre completo del usuario
 * @returns Iniciales en mayúsculas (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Obtiene la etiqueta del rol en español
 * @param role - Rol del usuario
 * @returns Etiqueta del rol traducida
 */
export const getRoleLabel = (role: UserRole): string => {
    return ROLE_LABELS[role] || 'Usuario';
};

/**
 * Obtiene el título de la sección activa
 * @param sectionId - ID de la sección activa
 * @returns Título de la sección
 */
export const getSectionTitle = (sectionId: string): string => {
    return SECTION_TITLES[sectionId] || DEFAULT_HEADER_TITLE;
};
