import { supabase } from './supabaseClient';

export const fetchReservationsByUserId = async (userId: string) => {
    const { data, error } = await supabase.from('reservations').select('*').eq('user_id', userId).order('reservation_date', { ascending: false });

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
