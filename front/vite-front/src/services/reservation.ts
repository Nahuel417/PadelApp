import { ReservationStatus } from '../utils/enums/reservationStatus.enum';
import { generarHorarios } from '../utils/functions/generarHorarios';
import { supabase } from './supabaseClient';

export const fetchReservationsByUserId = async (userId: string, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data, error } = await supabase
        .from('reservations')
        .select(`*, coach:coach_id ( user:user_id ( first_name, last_name ) )`)
        .eq('user_id', userId)
        .order('reservation_date', { ascending: false })
        .range(from, to + 1); // pedimos uno más

    if (error) throw error;

    // chequeamos si hay siguiente
    const hasNextPage = data && data.length > limit;

    return {
        data: data?.slice(0, limit) ?? [],
        hasNextPage,
    };
};

export const cancelReservation = async (id: string) => {
    const { data, error } = await supabase.from('reservations').update({ status: ReservationStatus.CANCELLED, cancelled_at: new Date().toISOString() }).eq('id', id).select().single();

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

        const openingHour = Number(openingTime.split(':')[0]);

        return horarios.map((h) => {
            const [hora, min] = h.hora.split(':').map(Number);

            // Creamos la fecha completa en local
            const [year, month, day] = fecha.split('-').map(Number);
            const fechaHorario = new Date(year, month - 1, day, hora, min, 0, 0);

            const isToday = now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === day;

            if (isToday && fechaHorario.getTime() <= now.getTime() && h.estado === 'disponible' && hora >= openingHour) {
                return { ...h, estado: 'no_disponible' };
            }

            return h;
        });
    };

    if (affair === 'Entrenar' && entrenador) {
        // Calcular day_of_week a partir de la fecha seleccionada
        const fechaDate = new Date(fecha);
        // En JS getDay() devuelve 0=Domingo, 1=Lunes... lo ajustamos a 1= Lunes, 7=Domingo
        const jsDay = fechaDate.getDay();
        const dayOfWeek = jsDay === 0 ? 7 : jsDay;

        const { data: coachData, error: coachError } = await supabase
            .from('coach_availability')
            .select('start_time, end_time')
            .eq('coach_id', entrenador)
            .eq('day_of_week', dayOfWeek)
            .eq('is_active', true);

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
