import React from 'react';
import DashboardLayout from '../../DashboardLayout';
import './CoachDashboard.css';

const CoachDashboard: React.FC = () => {
    // TODO: Obtener estos datos del estado global o contexto
    const userRole = 'coach';
    const userName = 'Carlos Rodríguez';

    return (
        <DashboardLayout userRole={userRole} userName={userName}>
            <div className="coach-dashboard-container">
                <div className="coach-page-header">
                    <h3 className="coach-page-title">Panel de Entrenador</h3>
                    <hr className="coach-title-underline" />
                </div>

                <div className="coach-stats-grid">
                    {/* Estadísticas del entrenador */}
                    <div className="coach-stat-card">
                        <div className="coach-stat-card-content">
                            <div className="coach-stat-info">
                                <p className="coach-stat-label">Clases Programadas</p>
                                <p className="coach-stat-value">12</p>
                            </div>
                            <div className="coach-stat-icon">
                                <span className="coach-stat-icon-emoji">📅</span>
                            </div>
                        </div>
                    </div>

                    <div className="coach-stat-card">
                        <div className="coach-stat-card-content">
                            <div className="coach-stat-info">
                                <p className="coach-stat-label">Alumnos Activos</p>
                                <p className="coach-stat-value">28</p>
                            </div>
                            <div className="coach-stat-icon">
                                <span className="coach-stat-icon-emoji">👥</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="coach-info-card">
                    <h4 className="coach-info-title">Panel de Control de Entrenador</h4>
                    <p className="coach-info-text">
                        Gestiona tus clases programadas, horarios de disponibilidad y la información de tus alumnos. Mantén actualizada tu agenda y comunica cualquier cambio a tus
                        estudiantes.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CoachDashboard;
