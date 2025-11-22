import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

interface DashboardStats {
    users: number;
    reservations: number;
    courts: number;
    coaches: number;
}

interface ChartData {
    revenue: {
        categories: string[];
        data: number[];
    };
    reservationStatus: {
        series: number[]; // [Confirmadas, Pendientes, Canceladas]
    };
    popularTimes: {
        categories: string[];
        data: number[];
    };
}

interface DashboardState {
    stats: DashboardStats;
    chartData: ChartData;
    loading: boolean;
    fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: {
        users: 0,
        reservations: 0,
        courts: 0,
        coaches: 0,
    },
    chartData: {
        revenue: { categories: [], data: [] },
        reservationStatus: { series: [0, 0, 0] },
        popularTimes: { categories: [], data: [] },
    },
    loading: false,

    fetchDashboardData: async () => {
        set({ loading: true });
        try {
            // 1. Fetch Stats Counts
            const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

            const { count: activeReservationsCount } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']);

            const { count: courtsCount } = await supabase.from('courts').select('*', { count: 'exact', head: true }).eq('is_active', true);

            const { count: coachesCount } = await supabase.from('coaches').select('*', { count: 'exact', head: true }).eq('is_available', true);

            // 2. Fetch Reservations for Status Chart & Popular Times
            const { data: reservationsData } = await supabase.from('reservations').select('status, start_time');

            const confirmed = reservationsData?.filter((r) => r.status === 'confirmed').length || 0;
            const pending = reservationsData?.filter((r) => r.status === 'pending').length || 0;
            const cancelled = reservationsData?.filter((r) => r.status === 'cancelled').length || 0;

            // Calculate Popular Times
            const hourCounts: Record<string, number> = {};
            reservationsData?.forEach((r) => {
                if (r.start_time) {
                    // Extract hour "14:00:00" -> "14hs"
                    const hour = r.start_time.split(':')[0];
                    const key = `${hour}hs`;
                    hourCounts[key] = (hourCounts[key] || 0) + 1;
                }
            });

            // Sort by hour
            const sortedHours = Object.keys(hourCounts).sort((a, b) => {
                return parseInt(a) - parseInt(b);
            });
            const popularTimesData = sortedHours.map((h) => hourCounts[h]);

            // 3. Fetch Revenue Data (Only confirmed reservations, subtracting coach fees)
            const currentYear = new Date().getFullYear();
            const { data: revenueData } = await supabase
                .from('reservations')
                .select(
                    `
                    total_amount,
                    reservation_date,
                    start_time,
                    end_time,
                    coach_id,
                    coaches (
                        hourly_rate
                    )
                `
                )
                .eq('status', 'confirmed')
                .gte('reservation_date', `${currentYear}-01-01`)
                .lte('reservation_date', `${currentYear}-12-31`);

            // Aggregate revenue by month
            const monthlyRevenue = new Array(12).fill(0);
            const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

            revenueData?.forEach((reservation: any) => {
                const date = new Date(reservation.reservation_date);
                const month = date.getMonth(); // 0-11

                let netAmount = Number(reservation.total_amount) || 0;

                // Subtract coach fee if applicable
                if (reservation.coach_id && reservation.coaches && reservation.coaches.hourly_rate) {
                    const startTimeParts = reservation.start_time.split(':');
                    const endTimeParts = reservation.end_time.split(':');

                    const startHours = parseInt(startTimeParts[0]) + parseInt(startTimeParts[1]) / 60;
                    const endHours = parseInt(endTimeParts[0]) + parseInt(endTimeParts[1]) / 60;

                    const durationInHours = endHours - startHours;
                    const coachFee = durationInHours * Number(reservation.coaches.hourly_rate);

                    netAmount -= coachFee;
                }

                if (netAmount < 0) netAmount = 0; // Safety check
                monthlyRevenue[month] += netAmount;
            });

            // Filter out future months or months with 0 if desired, or show all up to current
            const currentMonth = new Date().getMonth();
            const categories = monthLabels.slice(0, currentMonth + 1);
            const revenueSeries = monthlyRevenue.slice(0, currentMonth + 1);

            set({
                stats: {
                    users: usersCount || 0,
                    reservations: activeReservationsCount || 0,
                    courts: courtsCount || 0,
                    coaches: coachesCount || 0,
                },
                chartData: {
                    reservationStatus: { series: [confirmed, pending, cancelled] },
                    revenue: { categories, data: revenueSeries },
                    popularTimes: { categories: sortedHours, data: popularTimesData },
                },
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            set({ loading: false });
        }
    },
}));
