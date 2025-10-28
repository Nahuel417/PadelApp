import React, { useMemo } from 'react';
import './DashboardHeader.css';
import { DashboardHeaderProps } from './types/types';
import { getSectionTitle } from './utils/userUtils';
import { MobileMenuButton, HeaderTitle, UserInfo } from './components';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, userRole, isCollapsed, onToggleSidebar, activeSection = 'dashboard' }) => {
    const headerTitle = useMemo(() => getSectionTitle(activeSection), [activeSection]);

    return (
        <header className="dashboard-header">
            <MobileMenuButton onClick={onToggleSidebar} />

            <HeaderTitle key={activeSection} title={headerTitle} />

            <div className="dashboard-header-actions">
                <UserInfo userName={userName} userRole={userRole} />
            </div>
        </header>
    );
};

export default DashboardHeader;
