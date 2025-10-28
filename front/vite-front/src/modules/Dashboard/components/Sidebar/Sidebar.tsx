import React, { useCallback } from 'react';
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SidebarProps } from './types/types';
import { useMenuItems } from './hooks/useMenuItems';
import { navigateToHome, cn } from './utils/navigation';
import { SidebarLogo, SidebarNav, ExitButton, SidebarToggle } from './components';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeItem, onItemClick, userRole = 'admin' }) => {
    const menuItems = useMenuItems(userRole);

    const handleToggle = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed, setIsCollapsed]);

    const handleExit = useCallback(() => {
        navigateToHome();
    }, []);

    const sidebarClassName = cn('sidebar', isCollapsed && 'collapsed');

    return (
        <div className={sidebarClassName}>
            <SidebarLogo isCollapsed={isCollapsed} />

            <SidebarNav menuItems={menuItems} activeItem={activeItem} isCollapsed={isCollapsed} onItemClick={onItemClick} />

            <ExitButton isCollapsed={isCollapsed} onExit={handleExit} />

            <SidebarToggle isCollapsed={isCollapsed} onToggle={handleToggle} />
        </div>
    );
};

export default Sidebar;
