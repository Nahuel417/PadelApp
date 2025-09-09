import { generarHorarios } from '../utils/functions/generarHorarios';
import { supabase } from './supabaseClient';

export const fetchReservationsByUserId = async (userId: string) => {
    const { data, error } = await supabase.from('reservations').select('*').eq('user_id', userId).order('reservation_date', { ascending: false }).limit(5);

    if (error) throw error;
    return data;
};

export const cancelReservation = async (id: string) => {
    const { data, error } = await supabase.from('reservations').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('id', id).select().single();

    if (error) throw error;
    return data;
};

export const createReservation = async (reserva) => {
    const { data, error } = await supabase.from('reservations').insert([reserva]).select().single();

    if (error) throw error;
    return data;
};

export const fetchCanchas = async () => {
    const { data, error } = await supabase.from('courts').select('id, name, surface_type, price_per_hour, is_active').eq('is_active', true).order('id', { ascending: true });

    if (error) throw error;
    return data;
};

export const fetchEntrenadores = async () => {
    const { data, error } = await supabase.from('coaches').select(`id, hourly_rate, user:users!coaches_user_id_fkey ( first_name, last_name )`).eq('is_available', true);

    if (error) throw error;

    return (
        data?.map((coach: any) => ({
            id: coach.id,
            hourly_rate: coach.hourly_rate,
            user: Array.isArray(coach.user) ? coach.user[0] : coach.user,
        })) ?? []
    );
};

export const fetchHorarios = async ({ affair, cancha, entrenador, fecha }) => {
    const { data: canchaData, error: canchaError } = await supabase.from('courts').select('opening_time, closing_time').eq('id', cancha).single();

    if (canchaError) throw canchaError;

    const horariosCancha = generarHorarios(canchaData.opening_time, canchaData.closing_time);

    // Traer reservas de esa cancha y fecha
    const { data: reservas, error: reservasError } = await supabase.from('reservations').select('start_time, payment_status, status').eq('court_id', cancha).eq('reservation_date', fecha);

    if (reservasError) throw reservasError;

    // Mapear estado de reservas
    const reservasMap: Record<string, string> = {};
    reservas.forEach((r) => {
        const hora = r.start_time.slice(0, 5); // "08:00:00" -> "08:00"
        if (r.status === 'cancelled') return;

        if (r.payment_status === 'pending') reservasMap[hora] = 'pendiente';
        else reservasMap[hora] = 'no_disponible';
    });

    if (affair === 'Entrenar' && entrenador) {
        // Traer disponibilidad del entrenador
        const { data: coachData, error: coachError } = await supabase.from('coach_availability').select('start_time, end_time').eq('coach_id', entrenador).eq('is_active', true);

        if (coachError) throw coachError;

        const horariosEntrenador: string[] = [];
        coachData.forEach((d) => {
            horariosEntrenador.push(...generarHorarios(d.start_time, d.end_time));
        });

        // Combinar cancha + entrenador + reservas
        const horariosConEstado = horariosCancha.map((h) => {
            if (!horariosEntrenador.includes(h)) return { hora: h, estado: 'no_disponible' }; // entrenador no disponible
            if (reservasMap[h]) return { hora: h, estado: reservasMap[h] }; // pendiente o no disponible por reserva
            return { hora: h, estado: 'disponible' }; // libre
        });

        // Filtrar horarios pasados si es hoy
        const hoy = new Date().toISOString().slice(0, 10);
        if (fecha === hoy) {
            const ahora = new Date();
            return horariosConEstado.map((h) => {
                const [hora, min] = h.hora.split(':').map(Number);

                // Ignorar 00 y 01
                if (hora === 0 || hora === 1) return h;

                const fechaHorario = new Date();
                fechaHorario.setHours(hora, min, 0, 0);
                if (fechaHorario <= ahora) return { ...h, estado: 'no_disponible' };
                return h;
            });
        }

        return horariosConEstado;
    }

    // Si no es Entrenar o no hay entrenador, solo marcar reservas sobre la cancha
    let horariosConEstado = horariosCancha.map((h) => ({
        hora: h,
        estado: reservasMap[h] || 'disponible',
    }));

    // Filtrar horarios pasados si es hoy
    const hoy = new Date().toISOString().slice(0, 10);
    if (fecha === hoy) {
        const ahora = new Date();
        horariosConEstado = horariosConEstado.map((h) => {
            const [hora, min] = h.hora.split(':').map(Number);

            // Ignorar 00 y 01
            if (hora === 0 || hora === 1) return h;

            const fechaHorario = new Date();
            fechaHorario.setHours(hora, min, 0, 0);

            if (fechaHorario <= ahora) return { ...h, estado: 'no_disponible' };
            return h;
        });
    }

    return horariosConEstado;
};
