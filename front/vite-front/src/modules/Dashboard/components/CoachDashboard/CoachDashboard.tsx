import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { useUserStore } from '../../../../store/userStore';
import { getCoachProfile, getCoachStats, CoachProfile } from '../../../../services/coachServices';
import ClassesContent from './components/ClassesContent/ClassesContent';
import ProfileContent from './components/ProfileContent/ProfileContent';
import ScheduleContent from './components/ScheduleContent/ScheduleContent';
import './CoachDashboard.css';

const CoachDashboard: React.FC = () => {
    const user = useUserStore((state) => state.userActive);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
    const [stats, setStats] = useState({
        upcomingClasses: 0,
        totalStudents: 0,
        monthlyClasses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCoachData = async () => {
            try {
                console.log('CoachDashboard - Loading coach data for user:', user.id);
                setIsLoading(true);
                const profile = await getCoachProfile(user.id);
                console.log('CoachDashboard - Profile loaded:', profile);
                setCoachProfile(profile);

                const coachStats = await getCoachStats(profile.id);
                console.log('CoachDashboard - Stats loaded:', coachStats);
                setStats(coachStats);
            } catch (error) {
                console.error('Error loading coach data:', error);
                setError(error instanceof Error ? error.message : 'Error desconocido al cargar datos del entrenador');
            } finally {
                setIsLoading(false);
            }
        };

        if (user.id) {
            loadCoachData();
        } else {
            console.log('CoachDashboard - No user.id available');
        }
    }, [user.id]);

    const renderContent = () => {
        console.log('CoachDashboard - renderContent:', { activeSection, coachProfile, isLoading });

        if (isLoading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando datos del entrenador...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <h3>Error al cargar perfil</h3>
                    <p>{error}</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>Asegúrate de que tu usuario tenga un perfil de entrenador creado en el sistema.</p>
                </div>
            );
        }

        if (!coachProfile) {
            return (
                <div className="error-container">
                    <h3>Perfil no encontrado</h3>
                    <p>No se encontró información del entrenador para este usuario.</p>
                </div>
            );
        }

        switch (activeSection) {
            case 'mis-clases':
                return <ClassesContent coachId={coachProfile.id} />;
            case 'perfil':
                return <ProfileContent coachProfile={coachProfile} onProfileUpdate={setCoachProfile} />;
            case 'horarios':
                return <ScheduleContent coachId={coachProfile.id} />;
            case 'dashboard':
            default:
                return (
                    <div className="main-dashboard-container">
                        <div className="page-header">
                            <h3 className="page-title">Panel de Entrenador</h3>
                            <hr className="title-underline" />
                        </div>

                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Cargando datos...</p>
                            </div>
                        ) : (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <div className="stat-info">
                                                <p className="stat-label">Clases Programadas</p>
                                                <p className="stat-value">{stats.upcomingClasses}</p>
                                            </div>
                                            <div className="stat-icon">
                                                <span className="stat-icon-emoji">📅</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <div className="stat-info">
                                                <p className="stat-label">Alumnos Activos</p>
                                                <p className="stat-value">{stats.totalStudents}</p>
                                            </div>
                                            <div className="stat-icon">
                                                <span className="stat-icon-emoji">👥</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <div className="stat-card-content">
                                            <div className="stat-info">
                                                <p className="stat-label">Clases Este Mes</p>
                                                <p className="stat-value">{stats.monthlyClasses}</p>
                                            </div>
                                            <div className="stat-icon">
                                                <span className="stat-icon-emoji">🏆</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h4 className="info-title">Bienvenido, {coachProfile?.user.first_name}</h4>
                                    <p className="info-text">
                                        Gestiona tus clases programadas, horarios de disponibilidad y la información de tus alumnos. Mantén actualizada tu agenda y comunica cualquier cambio
                                        a tus estudiantes.
                                    </p>
                                    <div className="quick-actions">
                                        <button className="quick-action-btn" onClick={() => setActiveSection('mis-clases')}>
                                            <i className="bi bi-calendar-check"></i>
                                            Ver Clases
                                        </button>
                                        <button className="quick-action-btn" onClick={() => setActiveSection('horarios')}>
                                            <i className="bi bi-clock"></i>
                                            Gestionar Horarios
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
        }
    };

    return (
        <DashboardLayout userRole="coach" userName={`${user.first_name} ${user.last_name}`} activeSection={activeSection} onSectionChange={setActiveSection}>
            {renderContent()}
        </DashboardLayout>
    );
};

export default CoachDashboard;
