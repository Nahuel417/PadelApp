import React from 'react';
import { SidebarLogoProps } from '../types/types';

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isCollapsed }) => {
    return (
        <div className="sidebar-logo">
            <div className="logo-icon">
                <i className="bi-trophy"></i>
            </div>
            <span className="logo-text">PadelApp</span>
        </div>
    );
};
