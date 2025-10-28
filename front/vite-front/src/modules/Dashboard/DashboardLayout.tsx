import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
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

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} activeItem={activeMenuItem} onItemClick={handleMenuClick} userRole={userRole} />

            <div className={`dashboard-main ${isCollapsed ? 'collapsed' : ''}`}>
                <DashboardHeader userName={userName} userRole={userRole} isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} activeSection={activeMenuItem} />

                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
