import { supabase } from './supabaseClient';
import { UserRole } from '../utils/enums/roles.enum';

type DashboardUserRoleFilter = 'all' | 'user' | 'coach' | 'admin' | 'superadmin';

type FetchUsersParams = {
    page?: number;
    limit?: number;
    role?: DashboardUserRoleFilter;
    search?: string;
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
