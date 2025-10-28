export type UserRole = 'admin' | 'coach' | 'superadmin';

export interface MenuItem {
    id: string;
    label: string;
    icon: string;
}

export interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    activeItem: string;
    onItemClick: (item: string) => void;
    userRole?: UserRole;
}

export interface SidebarItemProps {
    item: MenuItem;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: (id: string) => void;
}

export interface SidebarLogoProps {
    isCollapsed: boolean;
}

export interface SidebarToggleProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export interface ExitButtonProps {
    isCollapsed: boolean;
    onExit: () => void;
}
