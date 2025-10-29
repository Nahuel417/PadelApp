import React from 'react';
import { MenuItem } from '../types/types';
import { SidebarItem } from './SidebarItem';

interface SidebarNavProps {
    menuItems: MenuItem[];
    activeItem: string;
    isCollapsed: boolean;
    onItemClick: (item: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, activeItem, isCollapsed, onItemClick }) => {
    return (
        <nav className="sidebar-nav">
            {menuItems.map((item) => (
                <SidebarItem key={item.id} item={item} isActive={activeItem === item.id} isCollapsed={isCollapsed} onClick={onItemClick} />
            ))}
        </nav>
    );
};
