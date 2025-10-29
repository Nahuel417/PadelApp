import React from 'react';
import { SidebarToggleProps } from '../types/types';

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ isCollapsed, onToggle }) => {
    const ariaLabel = isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar';
    const iconClass = `bi-chevron-${isCollapsed ? 'right' : 'left'}`;

    return (
        <button className="sidebar-toggle" onClick={onToggle} title={ariaLabel} aria-label={ariaLabel} aria-expanded={!isCollapsed}>
            <span className="toggle-icon">
                <i className={iconClass}></i>
            </span>
        </button>
    );
};
