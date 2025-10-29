import React from 'react';
import { SidebarItemProps } from '../types/types';

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, isCollapsed, onClick }) => {
    const handleClick = () => onClick(item.id);

    return (
        <button className={`nav-item ${isActive ? 'active' : ''}`} onClick={handleClick} title={isCollapsed ? item.label : undefined} aria-current={isActive ? 'page' : undefined}>
            <span className="nav-item-icon">
                <i className={item.icon}></i>
            </span>
            <span className={`nav-item-label ${isActive ? 'active' : 'inactive'}`}>{item.label}</span>
        </button>
    );
};
