import { supabase } from './supabaseClient';

export interface CoachAvailability {
    id: string;
    coach_id: string;
    day_of_week: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
}

export interface CreateCoachAvailabilityData {
    coach_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface UpdateCoachAvailabilityData extends Partial<CreateCoachAvailabilityData> {
    is_active?: boolean;
}

/**
 * Obtener toda la disponibilidad de un entrenador
 */
export const getCoachAvailability = async (coachId: string): Promise<CoachAvailability[]> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener disponibilidad activa de un entrenador
 */
export const getActiveCoachAvailability = async (coachId: string): Promise<CoachAvailability[]> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Crear nueva disponibilidad para entrenador
 */
export const createCoachAvailability = async (availabilityData: CreateCoachAvailabilityData): Promise<CoachAvailability> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .insert([availabilityData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Actualizar disponibilidad del entrenador
 */
export const updateCoachAvailability = async (id: string, availabilityData: UpdateCoachAvailabilityData): Promise<CoachAvailability> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .update(availabilityData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Eliminar disponibilidad del entrenador
 */
export const deleteCoachAvailability = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('coach_availability')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

/**
 * Activar/desactivar disponibilidad
 */
export const toggleCoachAvailabilityStatus = async (id: string, isActive: boolean): Promise<CoachAvailability> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Obtener disponibilidad por día de la semana
 */
export const getCoachAvailabilityByDay = async (coachId: string, dayOfWeek: number): Promise<CoachAvailability[]> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Verificar si un entrenador está disponible en un horario específico
 */
export const isCoachAvailable = async (
    coachId: string, 
    dayOfWeek: number, 
    startTime: string, 
    endTime: string
): Promise<boolean> => {
    const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .lte('start_time', startTime)
        .gte('end_time', endTime);

    if (error) throw error;
    return (data && data.length > 0) || false;
};
