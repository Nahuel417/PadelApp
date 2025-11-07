import { supabase } from './supabaseClient';

export interface Coach {
    id: number;
    user_id: string;
    hourly_rate: number;
    is_available: boolean;
    specialties?: string;
    experience_years?: number;
    description?: string;
    created_at: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface CreateCoachData {
    user_id: string;
    hourly_rate: number;
    specialties?: string;
    experience_years?: number;
    description?: string;
}

export interface UpdateCoachData extends Partial<CreateCoachData> {
    is_available?: boolean;
}

/**
 * Obtener todos los entrenadores
 */
export const getAllCoaches = async (): Promise<Coach[]> => {
    const { data, error } = await supabase
        .from('coaches')
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener entrenadores disponibles solamente
 */
export const getAvailableCoaches = async (): Promise<Coach[]> => {
    const { data, error } = await supabase
        .from('coaches')
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('is_available', true)
        .order('user.first_name', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener un entrenador por ID
 */
export const getCoachById = async (id: number): Promise<Coach> => {
    const { data, error } = await supabase
        .from('coaches')
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Obtener entrenador por user_id
 */
export const getCoachByUserId = async (userId: string): Promise<Coach> => {
    const { data, error } = await supabase
        .from('coaches')
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Crear nuevo entrenador
 */
export const createCoach = async (coachData: CreateCoachData): Promise<Coach> => {
    const { data, error } = await supabase
        .from('coaches')
        .insert([coachData])
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Actualizar información del entrenador
 */
export const updateCoach = async (id: number, coachData: UpdateCoachData): Promise<Coach> => {
    const { data, error } = await supabase
        .from('coaches')
        .update(coachData)
        .eq('id', id)
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Cambiar disponibilidad del entrenador
 */
export const toggleCoachAvailability = async (id: number, isAvailable: boolean): Promise<Coach> => {
    const { data, error } = await supabase
        .from('coaches')
        .update({ is_available: isAvailable })
        .eq('id', id)
        .select(`
            *,
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Obtener reservas de un entrenador
 */
export const getCoachReservations = async (coachId: number, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data, error } = await supabase
        .from('reservations')
        .select(`
            *,
            court:court_id (
                id,
                name,
                surface_type
            ),
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('coach_id', coachId)
        .order('reservation_date', { ascending: false })
        .order('start_time', { ascending: false })
        .range(from, to + 1);

    if (error) throw error;

    const hasNextPage = data && data.length > limit;
    return {
        data: data?.slice(0, limit) ?? [],
        hasNextPage,
    };
};

/**
 * Obtener alumnos de un entrenador (usuarios únicos con reservas)
 */
export const getCoachStudents = async (coachId: number) => {
    const { data, error } = await supabase
        .from('reservations')
        .select(`
            user:user_id (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('coach_id', coachId)
        .not('user_id', 'is', null);

    if (error) throw error;

    // Eliminar duplicados por user_id
    const uniqueStudents = data?.reduce((acc: any[], reservation: any) => {
        const existingStudent = acc.find(student => student.user.id === reservation.user.id);
        if (!existingStudent) {
            acc.push(reservation);
        }
        return acc;
    }, []) || [];

    return uniqueStudents.map(item => item.user);
};
