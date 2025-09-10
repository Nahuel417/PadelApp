import { getHorasBloque } from '../utils/functions/calcularBloquesHorarios';
import { generarHorarios } from '../utils/functions/generarHorarios';
import { supabase } from './supabaseClient';

export const fetchReservationsByUserId = async (userId: string) => {
    const { data, error } = await supabase.from('reservations').select('*').eq('user_id', userId).order('reservation_date', { ascending: true });
    // .limit(5);

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
    const { data: reservas, error: reservasError } = await supabase
        .from('reservations')
        .select('start_time, end_time, payment_status, status')
        .eq('court_id', cancha)
        .eq('reservation_date', fecha);

    if (reservasError) throw reservasError;

    const generarReservasMap = (reservas: any[]) => {
        const reservasMap: Record<string, 'pendiente' | 'no_disponible'> = {};

        reservas.forEach((r) => {
            if (r.status === 'cancelled') return;

            let [hStart, mStart] = r.start_time.split(':').map(Number);
            let [hEnd, mEnd] = r.end_time.split(':').map(Number);

            let startMinutes = hStart * 60 + mStart;
            let endMinutes = hEnd * 60 + mEnd;

            // Ignorar reservas "vacías"
            if (startMinutes === endMinutes) return;

            // Ajuste si cruza medianoche
            if (endMinutes <= startMinutes) endMinutes += 24 * 60;

            for (let t = startMinutes; t < endMinutes; t += 60) {
                const h = Math.floor(t / 60) % 24;
                const m = t % 60;
                const horaStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

                if (r.status === 'pending' || (r.status === 'confirmed' && r.payment_status === 'pending')) {
                    reservasMap[horaStr] = 'pendiente';
                } else if (r.status === 'confirmed' && r.payment_status === 'approved') {
                    reservasMap[horaStr] = 'no_disponible';
                }
            }
        });

        return reservasMap;
    };

    const reservasMap = generarReservasMap(reservas);

    // Ajuste para día actual considerando 01:00 como cambio de día
    const now = new Date();
    const todayAdjusted = new Date(now);
    if (now.getHours() < 1) {
        todayAdjusted.setDate(todayAdjusted.getDate() - 1);
    }

    const marcarHorariosPasados = (horarios: { hora: string; estado: string }[], openingTime: string) => {
        const now = new Date();

        // Convertimos openingTime a número de hora (ej: '08:00' -> 8)
        const openingHour = Number(openingTime.split(':')[0]);

        return horarios.map((h) => {
            const [hora, min] = h.hora.split(':').map(Number);
            const fechaHorario = new Date(fecha + 'T00:00:00');
            fechaHorario.setHours(hora, min, 0, 0);

            // Solo marcar como no_disponible si es hoy, el horario ya pasó y es mayor o igual a la hora de apertura
            if (
                fecha === now.toISOString().slice(0, 10) && // es hoy
                fechaHorario.getTime() <= now.getTime() && // ya pasó
                h.estado === 'disponible' &&
                hora >= openingHour
            ) {
                return { ...h, estado: 'no_disponible' };
            }

            return h;
        });
    };

    if (affair === 'Entrenar' && entrenador) {
        const { data: coachData, error: coachError } = await supabase.from('coach_availability').select('start_time, end_time').eq('coach_id', entrenador).eq('is_active', true);

        if (coachError) throw coachError;

        const horariosEntrenador: string[] = [];
        coachData.forEach((d) => {
            horariosEntrenador.push(...generarHorarios(d.start_time, d.end_time));
        });

        let horariosConEstado = horariosCancha.map((h) => {
            if (!horariosEntrenador.includes(h)) return { hora: h, estado: 'no_disponible' };
            if (reservasMap[h]) return { hora: h, estado: reservasMap[h] };
            return { hora: h, estado: 'disponible' };
        });

        // return marcarHorariosPasados(horariosConEstado);
        return marcarHorariosPasados(horariosConEstado, canchaData.opening_time);
    }

    // Si no es Entrenar o no hay entrenador
    let horariosConEstado = horariosCancha.map((h) => ({
        hora: h,
        estado: reservasMap[h] || 'disponible',
    }));

    // return marcarHorariosPasados(horariosConEstado);
    return marcarHorariosPasados(horariosConEstado, canchaData.opening_time);
};
