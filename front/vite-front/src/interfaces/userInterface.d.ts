import { UserRole } from '../utils/roles.enum';

export interface User {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    birthday?: string;
    genre?: string;
    role_id?: UserRole;
    created_at?: string;
}
