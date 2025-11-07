import React, { useState, useEffect, useCallback } from 'react';
import './CourtsContent.css';
import Swal from 'sweetalert';
import { Court, getAllCourts, toggleCourtStatus } from '../../../../services/courts';
import { CourtsHeader } from './components/CourtsHeader/CourtsHeader';
import { CourtsList } from './components/CourtsList/CourtsList';
import { CourtFormModal } from './components/CourtFormModal/CourtFormModal';

export interface CourtsContentProps {
    userRole?: 'admin' | 'coach' | 'superadmin';
}

const CourtsContent: React.FC<CourtsContentProps> = ({ userRole = 'admin' }) => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

    // Cargar canchas
    const fetchCourts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAllCourts();
            setCourts(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar canchas';
            setError(errorMessage);
            console.error('Error fetching courts:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourts();
    }, [fetchCourts]);

    // Handlers
    const handleAddCourt = useCallback(() => {
        setSelectedCourt(null);
        setIsModalOpen(true);
    }, []);

    const handleEditCourt = useCallback((court: Court) => {
        setSelectedCourt(court);
        setIsModalOpen(true);
    }, []);

    const handleToggleStatus = useCallback(async (court: Court) => {
        const newStatus = !court.is_active;
        const actionText = newStatus ? 'activar' : 'desactivar';
        
        Swal({
            title: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} cancha?`,
            text: `¿Estás seguro de que deseas ${actionText} la cancha "${court.name}"?`,
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
                    await toggleCourtStatus(court.id, newStatus);
                    await fetchCourts();
                    Swal({
                        title: newStatus ? 'Activada' : 'Desactivada',
                        text: `La cancha ha sido ${newStatus ? 'activada' : 'desactivada'} exitosamente.`,
                        icon: 'success',
                        timer: 2000,
                    });
                } catch (error) {
                    console.error('Error toggling court status:', error);
                    Swal({
                        title: 'Error',
                        text: `No se pudo ${actionText} la cancha. Intenta de nuevo.`,
                        icon: 'error',
                    });
                }
            }
        });
    }, [fetchCourts]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCourt(null);
    }, []);

    const handleSaveSuccess = useCallback(() => {
        fetchCourts();
        handleCloseModal();
    }, [fetchCourts, handleCloseModal]);

    // Calcular estadísticas
    const activeCourts = courts.filter(court => court.is_active).length;
    const totalCourts = courts.length;

    if (error) {
        return (
            <div className="courts-content">
                <div className="error-container">
                    <h3>Error al cargar canchas</h3>
                    <p>{error}</p>
                    <button onClick={fetchCourts} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="courts-content">
            <CourtsHeader 
                title="Gestión de Canchas"
                totalCourts={totalCourts}
                activeCourts={activeCourts}
                onAddCourt={handleAddCourt}
            />

            <CourtsList
                courts={courts}
                isLoading={isLoading}
                onEditCourt={handleEditCourt}
                onToggleStatus={handleToggleStatus}
            />

            <CourtFormModal
                isOpen={isModalOpen}
                court={selectedCourt}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default CourtsContent;
