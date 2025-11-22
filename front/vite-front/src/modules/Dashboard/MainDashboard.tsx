import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import ReservesContent from './components/ReservesContent/ReservesContent';
import UsersContent from './components/UsersContent/UsersContent';
import CourtsContent from './components/CourtsContent/CourtsContent';
import CoachesContent from './components/CoachesContent/CoachesContent';
import SettingsContent from './components/SettingsContent/SettingsContent';
import { DashboardHomeHeader } from './components/DashboardHomeHeader/DashboardHomeHeader';
import RevenueChart from './components/Charts/RevenueChart';
import ReservationsStatusChart from './components/Charts/ReservationsStatusChart';
import PopularTimesChart from './components/Charts/PopularTimesChart';
import './components/Charts/Charts.css';
import './MainDashboard.css';
import { useUserStore } from '../../store/userStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { UserRole } from '../../utils/enums/roles.enum';

const MainDashboard: React.FC = () => {
    const user = useUserStore((state) => state.userActive);
    const { stats, chartData, fetchDashboardData, loading } = useDashboardStore();

    // Mapeo de rol para el layout
    const getUserRoleString = (roleId?: number): 'superadmin' | 'admin' | 'coach' => {
        switch (roleId) {
            case UserRole.SUPERADMIN:
                return 'superadmin';
            case UserRole.ADMIN:
                return 'admin';
            case UserRole.COACH:
                return 'coach';
            default:
                return 'admin';
        }
    };

    const userRole = getUserRoleString(user?.role_id);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Usuario';

    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const dashboardMetrics = [
        { id: 'users', label: 'Usuarios Totales', value: stats.users },
        { id: 'reservations', label: 'Reservas Activas', value: stats.reservations },
        { id: 'courts', label: 'Canchas Disp.', value: stats.courts },
        { id: 'coaches', label: 'Entrenadores', value: stats.coaches },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'reservas':
                return <ReservesContent userRole={userRole} />;
            case 'usuarios':
                return <UsersContent userRole={userRole} />;
            case 'canchas':
                return <CourtsContent userRole={userRole} />;
            case 'entrenadores':
                return <CoachesContent userRole={userRole} />;
            case 'configuracion':
                return <SettingsContent />;
            case 'dashboard':
            default:
                return (
                    <div className="main-dashboard-container">
                        <DashboardHomeHeader title="Panel Principal" metrics={dashboardMetrics} />

                        <div className="charts-grid">
                            <RevenueChart categories={chartData.revenue.categories} data={chartData.revenue.data} />
                            <ReservationsStatusChart series={chartData.reservationStatus.series} />
                            <PopularTimesChart categories={chartData.popularTimes.categories} data={chartData.popularTimes.data} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout userRole={userRole} userName={userName} activeSection={activeSection} onSectionChange={setActiveSection}>
            {renderContent()}
        </DashboardLayout>
    );
};

export default MainDashboard;
