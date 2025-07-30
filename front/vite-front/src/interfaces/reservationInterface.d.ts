export interface Reservation {
    id: string;
    affair: string;
    user_id: string;
    court_id: number;
    coach_id?: string;
    reservation_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
    status?: string;
    payment_status?: string;
    preference_id?: string;
    notes?: string;
    cancelled_at?: string;
    updated_at?: string;
    created_at?: string;
}
