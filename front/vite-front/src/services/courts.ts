import { supabase } from './supabaseClient';

export interface Court {
    id: number;
    name: string;
    surface_type: string;
    price_per_hour: number;
    is_active: boolean;
    opening_time: string;
    closing_time: string;
    created_at: string;
}

export interface CreateCourtData {
    name: string;
    surface_type: string;
    price_per_hour: number;
    opening_time: string;
    closing_time: string;
}

export interface UpdateCourtData extends Partial<CreateCourtData> {
    is_active?: boolean;
}

/**
 * Obtener todas las canchas
 */
export const getAllCourts = async (): Promise<Court[]> => {
    const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener una cancha por ID
 */
export const getCourtById = async (id: number): Promise<Court> => {
    const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Crear nueva cancha
 */
export const createCourt = async (courtData: CreateCourtData): Promise<Court> => {
    const { data, error } = await supabase
        .from('courts')
        .insert([courtData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Actualizar información de cancha
 */
export const updateCourt = async (id: number, courtData: UpdateCourtData): Promise<Court> => {
    const { data, error } = await supabase
        .from('courts')
        .update(courtData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Cambiar estado activo/inactivo de una cancha
 */
export const toggleCourtStatus = async (id: number, isActive: boolean): Promise<Court> => {
    const { data, error } = await supabase
        .from('courts')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Obtener canchas activas solamente
 */
export const getActiveCourts = async (): Promise<Court[]> => {
    const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
};
