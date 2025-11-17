import { supabase } from './supabaseClient';

// Interfaces
export interface CoachProfile {
    id: string;
    user_id: string;
    bio?: string;
    hourly_rate: number;
    is_available: boolean;
    created_at: string;
    phone: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        birthday: string;
        genre: string;
    };
}

export interface CoachAvailability {
    id: string;
    coach_id: string;
    day_of_week: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
}

export interface CoachClass {
    id: string;
    user_id: string;
    reservation_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
    status: string;
    payment_status: string;
    notes?: string;
    affair: string;
    coach_id: string;
    court_id?: number;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    court?: {
        id: number;
        name: string;
    };
}

export interface CoachStudent {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    total_classes: number;
    last_class_date?: string;
    next_class_date?: string;
}

export interface UpdateCoachProfileData {
    bio?: string;
    hourly_rate?: number;
    is_available?: boolean;
    phone?: string;
}

export interface CreateAvailabilityData {
    coach_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface UpdateAvailabilityData {
    day_of_week?: number;
    start_time?: string;
    end_time?: string;
    is_active?: boolean;
}

/**
 * Obtener perfil completo del entrenador
 */
export const getCoachProfile = async (userId: string): Promise<CoachProfile> => {
    console.log('getCoachProfile - Searching for user_id:', userId);

    const { data, error } = await supabase
        .from('coaches')
        .select(
            `
            *,
            user:users(*)
        `
        )
        .eq('user_id', userId)
        .single();

    console.log('getCoachProfile - Result:', { data, error });

    if (error && error.code === 'PGRST116') {
        // No existe perfil de coach, crear uno automáticamente
        console.log('getCoachProfile - Coach profile not found, creating default profile...');
        return await createDefaultCoachProfile(userId);
    }

    if (error) {
        console.error('getCoachProfile - Error:', error);
        throw new Error(`Error al obtener perfil de entrenador: ${error.message}`);
    }
    return data;
};

/**
 * Crear perfil de entrenador por defecto
 */
const createDefaultCoachProfile = async (userId: string): Promise<CoachProfile> => {
    // Primero obtener datos del usuario
    const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();

    if (userError) {
        throw new Error(`Error al obtener datos del usuario: ${userError.message}`);
    }

    // Crear perfil de coach con valores por defecto
    const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .insert({
            user_id: userId,
            hourly_rate: 5000, // Valor por defecto
            is_available: true,
            phone: '', // Campo requerido en coaches, se puede actualizar después
            bio: null,
        })
        .select(
            `
            *,
            user:users(*)
        `
        )
        .single();

    if (coachError) {
        throw new Error(`Error al crear perfil de entrenador: ${coachError.message}`);
    }

    console.log('getCoachProfile - Default profile created:', coachData);
    return coachData;
};

/**
 * Actualizar perfil del entrenador
 */
export const updateCoachProfile = async (coachId: string, profileData: UpdateCoachProfileData): Promise<CoachProfile> => {
    const { data, error } = await supabase
        .from('coaches')
        .update(profileData)
        .eq('id', coachId)
        .select(
            `
            *,
            user:users(*)
        `
        )
        .single();

    if (error) throw error;
    return data;
};

/**
 * Obtener clases del entrenador
 */
export const getCoachClasses = async (
    coachId: string,
    filters?: {
        status?: string;
        date_from?: string;
        date_to?: string;
    }
): Promise<CoachClass[]> => {
    let query = supabase
        .from('reservations')
        .select(
            `
            *,
            user:users(id, first_name, last_name, email),
            court:courts(id, name)
        `
        )
        .eq('coach_id', coachId)
        .order('reservation_date', { ascending: false })
        .order('start_time', { ascending: false });

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    if (filters?.date_from) {
        query = query.gte('reservation_date', filters.date_from);
    }

    if (filters?.date_to) {
        query = query.lte('reservation_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Obtener estadísticas del entrenador
 */
export const getCoachStats = async (coachId: string) => {
    console.log('getCoachStats - Loading stats for coach:', coachId);

    try {
        // Clases programadas (futuras)
        const { data: upcomingClasses, error: upcomingError } = await supabase
            .from('reservations')
            .select('id')
            .eq('coach_id', coachId)
            .in('status', ['pending', 'confirmed'])
            .gte('reservation_date', new Date().toISOString().split('T')[0]);

        if (upcomingError) {
            console.warn('getCoachStats - Error loading upcoming classes:', upcomingError);
        }

        // Alumnos únicos
        const { data: students, error: studentsError } = await supabase.from('reservations').select('user_id').eq('coach_id', coachId).in('status', ['confirmed', 'completed']);

        if (studentsError) {
            console.warn('getCoachStats - Error loading students:', studentsError);
        }

        const uniqueStudents = new Set(students?.map((s) => s.user_id) || []).size;

        // Clases completadas este mes
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const { data: monthlyClasses, error: monthlyError } = await supabase
            .from('reservations')
            .select('id')
            .eq('coach_id', coachId)
            .eq('status', 'completed')
            .gte('reservation_date', firstDayOfMonth.toISOString().split('T')[0]);

        if (monthlyError) {
            console.warn('getCoachStats - Error loading monthly classes:', monthlyError);
        }

        const stats = {
            upcomingClasses: upcomingClasses?.length || 0,
            totalStudents: uniqueStudents,
            monthlyClasses: monthlyClasses?.length || 0,
        };

        console.log('getCoachStats - Stats loaded:', stats);
        return stats;
    } catch (error) {
        console.error('getCoachStats - Unexpected error:', error);
        // Retornar estadísticas por defecto en caso de error
        return {
            upcomingClasses: 0,
            totalStudents: 0,
            monthlyClasses: 0,
        };
    }
};

/**
 * Obtener alumnos del entrenador
 */
export const getCoachStudents = async (coachId: string): Promise<CoachStudent[]> => {
    const { data, error } = await supabase.rpc('get_coach_students', { coach_id_param: coachId });

    if (error) throw error;
    return data || [];
};

/**
 * Obtener disponibilidad del entrenador (incluye horarios activos e inactivos)
 */
export const getCoachAvailability = async (coachId: string): Promise<CoachAvailability[]> => {
    const { data, error } = await supabase.from('coach_availability').select('*').eq('coach_id', coachId).order('day_of_week').order('start_time');

    if (error) throw error;
    return data || [];
};

/**
 * Crear nueva disponibilidad
 */
export const createCoachAvailability = async (availabilityData: CreateAvailabilityData): Promise<CoachAvailability> => {
    const { data, error } = await supabase.from('coach_availability').insert([availabilityData]).select().single();

    if (error) throw error;
    return data;
};

/**
 * Actualizar disponibilidad
 */
export const updateCoachAvailability = async (availabilityId: string, availabilityData: UpdateAvailabilityData): Promise<CoachAvailability> => {
    const { data, error } = await supabase.from('coach_availability').update(availabilityData).eq('id', availabilityId).select().single();

    if (error) throw error;
    return data;
};

/**
 * Verificar si hay reservas asociadas a un horario específico
 */
export const checkAvailabilityHasReservations = async (coachId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean> => {
    // Obtener todas las reservas del coach que coincidan con el día y horario
    const { data, error } = await supabase
        .from('reservations')
        .select('id, reservation_date, start_time, end_time')
        .eq('coach_id', coachId)
        .in('status', ['pending', 'confirmed', 'completed']);

    if (error) throw error;

    if (!data || data.length === 0) return false;

    // Verificar si alguna reserva coincide con el día de la semana y horario
    const hasReservations = data.some((reservation) => {
        const reservationDate = new Date(reservation.reservation_date);
        // JavaScript: 0=Domingo, 1=Lunes, ..., 6=Sábado
        // BD: 1=Lunes, 2=Martes, ..., 7=Domingo
        const jsDay = reservationDate.getDay();
        const reservationDayOfWeek = jsDay === 0 ? 7 : jsDay;

        // Verificar si el día coincide y si hay solapamiento de horarios
        if (reservationDayOfWeek === dayOfWeek) {
            const resStart = reservation.start_time;
            const resEnd = reservation.end_time;

            // Verificar solapamiento de horarios
            return resStart < endTime && resEnd > startTime;
        }
        return false;
    });

    return hasReservations;
};

/**
 * Eliminar disponibilidad permanentemente de la BD
 */
export const permanentlyDeleteCoachAvailability = async (availabilityId: string): Promise<void> => {
    const { error } = await supabase.from('coach_availability').delete().eq('id', availabilityId);

    if (error) throw error;
};

/**
 * Pausar disponibilidad (marcar como inactiva)
 */
export const pauseCoachAvailability = async (availabilityId: string): Promise<void> => {
    const { error } = await supabase.from('coach_availability').update({ is_active: false }).eq('id', availabilityId);

    if (error) throw error;
};

/**
 * Eliminar disponibilidad (intenta eliminar, si falla pausa)
 * @deprecated Usar permanentlyDeleteCoachAvailability o pauseCoachAvailability
 */
export const deleteCoachAvailability = async (availabilityId: string): Promise<void> => {
    const { error } = await supabase.from('coach_availability').update({ is_active: false }).eq('id', availabilityId);

    if (error) throw error;
};

/**
 * Obtener detalles de una clase específica
 */
export const getClassDetails = async (classId: string): Promise<CoachClass> => {
    const { data, error } = await supabase
        .from('reservations')
        .select(
            `
            *,
            user:users(id, first_name, last_name, email),
            court:courts(id, name)
        `
        )
        .eq('id', classId)
        .single();

    if (error) throw error;
    return data;
};
