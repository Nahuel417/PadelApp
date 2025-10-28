import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole?: 'admin' | 'coach' | 'superadmin';
    userName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = 'admin', userName = 'Usuario' }) => {
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleMenuClick = (item: string) => {
        setActiveMenuItem(item);
        // TODO: Implement navigation logic
    };

    const getRoleLabel = () => {
        switch (userRole) {
            case 'superadmin':
                return 'Super Administrador';
            case 'admin':
                return 'Administrador';
            case 'coach':
                return 'Entrenador';
            default:
                return 'Usuario';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} activeItem={activeMenuItem} onItemClick={handleMenuClick} userRole={userRole} />

            <div className={`dashboard-main ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Header personalizado del Dashboard */}
                <header className="dashboard-header">
                    <button className="mobile-menu-button" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h1 className="dashboard-header-title">Dashboard General</h1>

                    <div className="dashboard-header-actions">
                        <div className="header-user">
                            <div className="user-avatar">{getInitials(userName)}</div>
                            <div className="user-info">
                                <span className="user-name">{userName}</span>
                                <span className="user-role">{getRoleLabel()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
