import React from 'react';
import './Sidebar.css';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    activeItem: string;
    onItemClick: (item: string) => void;
    userRole?: 'admin' | 'coach' | 'superadmin'; // Para determinar qué items mostrar
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeItem, onItemClick, userRole = 'admin' }) => {
    // Definir items según el rol
    const getMenuItems = () => {
        const commonItems = [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }];

        const coachItems = [
            { id: 'mis-clases', label: 'Mis Clases', icon: '🎾' },
            { id: 'alumnos', label: 'Mis Alumnos', icon: '👥' },
            { id: 'horarios', label: 'Horarios', icon: '🕒' },
            { id: 'perfil', label: 'Mi Perfil', icon: '👤' },
        ];

        const adminItems = [
            { id: 'reservas', label: 'Reservas', icon: '📅' },
            { id: 'usuarios', label: 'Usuarios', icon: '👥' },
            { id: 'canchas', label: 'Canchas', icon: '🏓' },
            { id: 'entrenadores', label: 'Entrenadores', icon: '🎾' },
            { id: 'reportes', label: 'Reportes', icon: '📈' },
        ];

        const superAdminItems = [
            { id: 'reservas', label: 'Reservas', icon: '📅' },
            { id: 'usuarios', label: 'Usuarios', icon: '👥' },
            { id: 'canchas', label: 'Canchas', icon: '🏓' },
            { id: 'entrenadores', label: 'Entrenadores', icon: '🎾' },
            { id: 'admins', label: 'Administradores', icon: '👑' },
            { id: 'reportes', label: 'Reportes', icon: '📈' },
            { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
        ];

        const settingsItem = { id: 'configuracion', label: 'Configuración', icon: '⚙️' };

        if (userRole === 'coach') {
            return [...commonItems, ...coachItems];
        } else if (userRole === 'superadmin') {
            return [...commonItems, ...superAdminItems];
        } else {
            return [...commonItems, ...adminItems, settingsItem];
        }
    };

    const menuItems = getMenuItems();

    const handleBackToApp = () => {
        window.location.href = '/';
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo Section */}
            <div className="sidebar-logo">
                <span className="logo-text">PadelApp</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button key={item.id} className={`nav-item ${activeItem === item.id ? 'active' : ''}`} onClick={() => onItemClick(item.id)} title={isCollapsed ? item.label : undefined}>
                        <span className="nav-item-icon">{item.icon}</span>
                        <span className={`nav-item-label ${activeItem === item.id ? 'active' : ''}`}>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Botón Salir del Dashboard */}
            <button className="exit-dashboard-btn" onClick={() => (window.location.href = '/')} title="Volver a la página principal">
                <span className="exit-dashboard-icon">←</span>
                <span className="exit-dashboard-label">Volver</span>
            </button>

            {/* Toggle Button */}
            <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expandir' : 'Contraer'}>
                <span className="toggle-icon">
                    <span> {'<'} </span>
                </span>
            </button>
        </div>
    );
};

export default Sidebar;
