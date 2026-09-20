import React, { useState, useEffect, useCallback } from 'react';
import './CoachesContent.css';
import Swal from 'sweetalert';
import { Coach, getAllCoaches, toggleCoachAvailability } from '../../../../services/coaches';
import { CoachesHeader } from './components/CoachesHeader/CoachesHeader';
import { CoachesList } from './components/CoachesList/CoachesList';
import { CoachFormModal } from './components/CoachFormModal/CoachFormModal';
import { CoachDetailsModal } from './components/CoachDetailsModal/CoachDetailsModal';

export interface CoachesContentProps {
    userRole?: 'admin' | 'coach' | 'superadmin';
}

const CoachesContent: React.FC<CoachesContentProps> = ({ userRole = 'admin' }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [detailsCoach, setDetailsCoach] = useState<Coach | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Cargar entrenadores
    const fetchCoaches = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAllCoaches();
            setCoaches(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar entrenadores';
            setError(errorMessage);
            console.error('Error fetching coaches:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoaches();
    }, [fetchCoaches]);

    // Handlers
    const handleAddCoach = useCallback(() => {
        setSelectedCoach(null);
        setIsModalOpen(true);
    }, []);

    const handleEditCoach = useCallback((coach: Coach) => {
        setSelectedCoach(coach);
        setIsModalOpen(true);
    }, []);

    const handleToggleAvailability = useCallback(async (coach: Coach) => {
        const newStatus = !coach.is_available;
        const actionText = newStatus ? 'activar' : 'desactivar';
        
        Swal({
            title: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} entrenador?`,
            text: `¿Estás seguro de que deseas ${actionText} a ${coach.user.first_name} ${coach.user.last_name}?`,
            icon: 'warning',
            buttons: {
                cancel: {
                    text: 'Cancelar',
                    value: false,
                    visible: true,
                },
                confirm: {
                    text: `Sí, ${actionText}`,
                    value: true,
                    visible: true,
                },
            },
            dangerMode: !newStatus,
        }).then(async (willToggle: boolean) => {
            if (willToggle) {
                try {
                    await toggleCoachAvailability(coach.id, newStatus);
                    await fetchCoaches();
                    Swal({
                        title: newStatus ? 'Activado' : 'Desactivado',
                        text: `El entrenador ha sido ${newStatus ? 'activado' : 'desactivado'} exitosamente.`,
                        icon: 'success',
                        timer: 2000,
                    });
                } catch (error) {
                    console.error('Error toggling coach availability:', error);
                    Swal({
                        title: 'Error',
                        text: `No se pudo ${actionText} el entrenador. Intenta de nuevo.`,
                        icon: 'error',
                    });
                }
            }
        });
    }, [fetchCoaches]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCoach(null);
    }, []);

    const handleSaveSuccess = useCallback(() => {
        fetchCoaches();
        handleCloseModal();
    }, [fetchCoaches, handleCloseModal]);

    const handleViewDetails = useCallback((coach: Coach) => {
        setDetailsCoach(coach);
        setIsDetailsModalOpen(true);
    }, []);

    const handleCloseDetailsModal = useCallback(() => {
        setIsDetailsModalOpen(false);
        setDetailsCoach(null);
    }, []);

    // Calcular estadísticas
    const availableCoaches = coaches.filter(coach => coach.is_available).length;
    const totalCoaches = coaches.length;

    if (error) {
        return (
            <div className="coaches-content">
                <div className="error-container">
                    <h3>Error al cargar entrenadores</h3>
                    <p>{error}</p>
                    <button onClick={fetchCoaches} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="coaches-content">
            <CoachesHeader 
                title="Gestión de Entrenadores"
                totalCoaches={totalCoaches}
                availableCoaches={availableCoaches}
                onAddCoach={handleAddCoach}
            />

            <CoachesList
                coaches={coaches}
                isLoading={isLoading}
                onEditCoach={handleEditCoach}
                onToggleAvailability={handleToggleAvailability}
                onViewDetails={handleViewDetails}
            />

            <CoachFormModal
                isOpen={isModalOpen}
                coach={selectedCoach}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
            />

            <CoachDetailsModal
                isOpen={isDetailsModalOpen}
                coach={detailsCoach}
                onClose={handleCloseDetailsModal}
            />
        </div>
    );
};

export default CoachesContent;
