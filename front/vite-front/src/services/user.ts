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

type FetchManagementReservationsResponse = {
    data: any[];
    hasNextPage: boolean;
};

const ROLE_ID_MAP: Record<ManageableRole, UserRole> = {
    user: UserRole.USER,
    coach: UserRole.COACH,
    admin: UserRole.ADMIN,
};

export const updateDashboardUserRole = async (userId: string, nextRole: ManageableRole) => {
    const targetRoleId = ROLE_ID_MAP[nextRole];

    const { data, error } = await supabase
        .from('users')
        .update({ role_id: targetRoleId })
        .eq('id', userId)
        .select('id, role_id')
        .single();

    if (error) throw error;

    return data;
};

export const deleteDashboardUser = async (userId: string) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) throw error;
};

type FetchManagementReservationsParams = {
    userId: string;
    role: Exclude<DashboardUserRoleFilter, 'all'>;
    page?: number;
    limit?: number;
};

export const fetchManagementReservations = async ({ userId, role, page = 1, limit = 5 }: FetchManagementReservationsParams): Promise<FetchManagementReservationsResponse> => {
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

    const from = (page - 1) * limit;
    const to = from + limit;

    let query;

    if (role === 'coach') {
        const { data: coachRecord, error: coachError } = await supabase
            .from('coaches')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (coachError) throw coachError;

        if (!coachRecord?.id) {
            return { data: [], hasNextPage: false };
        }

        query = supabase.from('reservations').select(baseSelect).eq('coach_id', coachRecord.id);
    } else {
        query = supabase.from('reservations').select(baseSelect).eq('user_id', userId);
    }

    const { data, error } = await query
        .order('reservation_date', { ascending: false })
        .order('start_time', { ascending: false })
        .range(from, to);

    if (error) throw error;

    const reservations = data ?? [];
    const hasNextPage = reservations.length > limit;

    return {
        data: reservations.slice(0, limit),
        hasNextPage,
    };
};

const ROLE_FILTER_MAP: Record<Exclude<DashboardUserRoleFilter, 'all'>, UserRole> = {
    user: UserRole.USER,
    coach: UserRole.COACH,
    admin: UserRole.ADMIN,
    superadmin: UserRole.SUPERADMIN,
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
