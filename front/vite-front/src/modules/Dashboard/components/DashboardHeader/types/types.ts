export type UserRole = 'admin' | 'coach' | 'superadmin';

export interface DashboardHeaderProps {
    userName: string;
    userRole: UserRole;
    isCollapsed: boolean;
    onToggleSidebar: () => void;
    activeSection?: string;
}

export interface MobileMenuButtonProps {
    onClick: () => void;
}

export interface HeaderTitleProps {
    title: string;
}

export interface UserInfoProps {
    userName: string;
    userRole: UserRole;
}

export interface UserAvatarProps {
    initials: string;
}
