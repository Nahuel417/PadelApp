import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SidebarProps } from './types/types';
import { useMenuItems } from './hooks/useMenuItems';
import { navigateToHome, cn } from './utils/navigation';
import { SidebarLogo, SidebarNav, ExitButton, SidebarToggle } from './components';
import { useUserStore } from '../../../../store/userStore';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeItem, onItemClick, userRole = 'admin' }) => {
    const menuItems = useMenuItems(userRole);
    const removeUserActive = useUserStore((state) => state.removeUserActive);
    const navigate = useNavigate();

    const handleToggle = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed, setIsCollapsed]);

    const handleExit = useCallback(() => {
        navigateToHome();
    }, []);

    const handleLogout = useCallback(async () => {
        const confirmed = await swal({
            title: '¿Cerrar Sesión?',
            text: '¿Estás seguro de que querés cerrar tu sesión actual?',
            icon: 'warning',
            buttons: ['Cancelar', 'Cerrar Sesión'],
            dangerMode: true,
        });

        if (confirmed) {
            removeUserActive();
            navigate('/login');
        }
    }, [removeUserActive, navigate]);

    const sidebarClassName = cn('sidebar', isCollapsed && 'collapsed');

    return (
        <div className={sidebarClassName}>
            <SidebarLogo isCollapsed={isCollapsed} />

            <SidebarNav menuItems={menuItems} activeItem={activeItem} isCollapsed={isCollapsed} onItemClick={onItemClick} />

            <div className="sidebar-footer">
                <button className="exit-dashboard-btn logout-btn" onClick={handleLogout} title="Cerrar Sesión">
                    <span className="exit-dashboard-icon">
                        <i className="bi bi-box-arrow-left"></i>
                    </span>
                    <span className="exit-dashboard-label">Cerrar Sesión</span>
                </button>

                <ExitButton isCollapsed={isCollapsed} onExit={handleExit} />
            </div>

            <SidebarToggle isCollapsed={isCollapsed} onToggle={handleToggle} />
        </div>
    );
};

export default Sidebar;
