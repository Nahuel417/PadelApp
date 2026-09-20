import { supabase } from './supabaseClient';

export interface Coach {
    id: number;
    user_id: string;
    hourly_rate: number;
    is_available: boolean;
    bio?: string;
    phone: string;
    created_at: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        birthday: string;
        genre: string;
    };
}

export interface CreateCoachData {
    user_id: string;
    hourly_rate: number;
    bio?: string;
    phone: string;
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
                email,
                birthday,
                genre
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
 * Obtener estadísticas del entrenador
 */
export const getCoachStats = async (coachId: number) => {
    const { data, error } = await supabase
        .from('reservations')
        .select('id, status')
        .eq('coach_id', coachId)
        .in('status', ['confirmed', 'completed']);

    if (error) throw error;

    return {
        totalClasses: data?.length || 0,
        completedClasses: data?.filter(r => r.status === 'completed').length || 0,
        confirmedClasses: data?.filter(r => r.status === 'confirmed').length || 0
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
