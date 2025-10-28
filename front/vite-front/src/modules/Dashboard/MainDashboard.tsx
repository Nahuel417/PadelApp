import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ReservesContent from './components/ReservesContent/ReservesContent';
import './MainDashboard.css';

const MainDashboard: React.FC = () => {
    // TODO: Obtener estos datos del estado global o contexto
    const userRole = 'admin'; // Puede ser 'admin', 'coach', 'superadmin'
    const userName = 'Juan Pérez';
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'reservas':
                return <ReservesContent userRole={userRole} />;
            case 'dashboard':
            default:
                return (
                    <div className="main-dashboard-container">
                        <div className="page-header">
                            <h3 className="page-title">Panel Principal</h3>
                            <hr className="title-underline" />
                        </div>

                        <div className="stats-grid">
                            {/* Estadísticas Cards */}
                            <div className="stat-card">
                                <div className="stat-card-content">
                                    <div className="stat-info">
                                        <p className="stat-label">Reservas Activas</p>
                                        <p className="stat-value">24</p>
                                    </div>
                                    <div className="stat-icon">
                                        <span className="stat-icon-emoji">📅</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-content">
                                    <div className="stat-info">
                                        <p className="stat-label">Usuarios Totales</p>
                                        <p className="stat-value">156</p>
                                    </div>
                                    <div className="stat-icon">
                                        <span className="stat-icon-emoji">👥</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-content">
                                    <div className="stat-info">
                                        <p className="stat-label">Canchas Disponibles</p>
                                        <p className="stat-value">8</p>
                                    </div>
                                    <div className="stat-icon">
                                        <span className="stat-icon-emoji">🏓</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="welcome-card">
                            <h4 className="welcome-title">Bienvenido al Panel de Administración</h4>
                            <p className="welcome-text">
                                Desde aquí puedes gestionar todas las reservas, usuarios y canchas de la plataforma. Utiliza el menú lateral para navegar entre las diferentes secciones.
                            </p>
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
