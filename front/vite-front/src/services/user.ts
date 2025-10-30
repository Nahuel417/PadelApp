import { supabase } from './supabaseClient';
import { UserRole } from '../utils/enums/roles.enum';

type DashboardUserRoleFilter = 'all' | 'user' | 'coach' | 'admin' | 'superadmin';
type ManageableRole = 'user' | 'coach' | 'admin';

type FetchUsersParams = {
    page?: number;
    limit?: number;
    role?: DashboardUserRoleFilter;
    search?: string;
};

export const updateDashboardUserRole = async (userId: string, nextRole: ManageableRole) => {
    const { data, error } = await supabase
        .from('users')
        .update({ role_id: ROLE_UPDATE_MAP[nextRole], updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('id, role_id')
        .single();

    if (error) throw error;

    return data;
};

type FetchManagementReservationsParams = {
    userId: string;
    role: Exclude<DashboardUserRoleFilter, 'all'>;
    limit?: number;
};

export const fetchManagementReservations = async ({ userId, role, limit = 10 }: FetchManagementReservationsParams) => {
    const baseSelect = `
        id,
        reservation_date,
        start_time,
        end_time,
        status,
        court:court_id (
            name
        ),
        coach:coach_id (
            id,
            user:user_id (
                first_name,
                last_name
            )
        ),
        user:user_id (
            id,
            first_name,
            last_name,
            email
        )
    `;

    let query;

    if (role === 'coach') {
        const { data: coachRecord, error: coachError } = await supabase
            .from('coaches')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (coachError) throw coachError;

        if (!coachRecord?.id) {
            return [];
        }

        query = supabase.from('reservations').select(baseSelect).eq('coach_id', coachRecord.id);
    } else {
        query = supabase.from('reservations').select(baseSelect).eq('user_id', userId);
    }

    const { data, error } = await query
        .order('reservation_date', { ascending: false })
        .order('start_time', { ascending: false })
        .limit(limit);

    if (error) throw error;

    return data ?? [];
};

const ROLE_FILTER_MAP: Record<Exclude<DashboardUserRoleFilter, 'all'>, UserRole> = {
    user: UserRole.USER,
    coach: UserRole.COACH,
    admin: UserRole.ADMIN,
    superadmin: UserRole.SUPERADMIN,
};

const ROLE_UPDATE_MAP: Record<ManageableRole, UserRole> = {
    user: UserRole.USER,
    coach: UserRole.COACH,
    admin: UserRole.ADMIN,
};

const sanitizeSearchTerm = (term: string): string => {
    return term.replace(/[%_]/g, '');
};

export const fetchDashboardUsers = async ({ page = 1, limit = 10, role = 'all', search }: FetchUsersParams = {}) => {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    let query = supabase
        .from('users')
        .select('id, first_name, last_name, email, role_id, created_at')
        .order('created_at', { ascending: false });

    if (role !== 'all') {
        query = query.eq('role_id', ROLE_FILTER_MAP[role]);
    }

    if (search && search.trim()) {
        const sanitized = sanitizeSearchTerm(search.trim());
        const ilike = `%${sanitized}%`;
        query = query.or(`email.ilike.${ilike},first_name.ilike.${ilike},last_name.ilike.${ilike}`);
    }

    const { data, error } = await query.range(from, to + 1);

    if (error) throw error;

    const hasNextPage = data && data.length > limit;

    return {
        data: data?.slice(0, limit) ?? [],
        hasNextPage,
    };
};
