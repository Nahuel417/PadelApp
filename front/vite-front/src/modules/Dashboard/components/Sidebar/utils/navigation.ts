/**
 * Navega a la página principal de la aplicación
 */
export const navigateToHome = (): void => {
    window.location.href = '/';
};

/**
 * Genera clases CSS condicionales
 */
export const cn = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
};
