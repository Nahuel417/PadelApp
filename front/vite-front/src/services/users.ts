import { supabase } from './supabaseClient';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: string;
    created_at: string;
}

/**
 * Buscar usuario por email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No se encontró el usuario
            return null;
        }
        throw error;
    }
    return data;
};

/**
 * Buscar usuarios por email (búsqueda parcial)
 */
export const searchUsersByEmail = async (emailQuery: string): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', `%${emailQuery.toLowerCase().trim()}%`)
        .limit(10);

    if (error) throw error;
    return data || [];
};

/**
 * Verificar si un usuario ya es entrenador
 */
export const isUserAlreadyCoach = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('coaches')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No se encontró, no es entrenador
            return false;
        }
        throw error;
    }
    return !!data;
};
