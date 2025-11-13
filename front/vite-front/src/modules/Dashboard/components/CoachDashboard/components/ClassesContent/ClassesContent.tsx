import React, { useState, useEffect, useCallback } from 'react';
import { getCoachClasses, getClassDetails, CoachClass } from '../../../../../../services/coachServices';
import ClassesHeader from './components/ClassesHeader/ClassesHeader';
import ClassesList from './components/ClassesList/ClassesList';
import ClassDetailsModal from './components/ClassDetailsModal/ClassDetailsModal';
import './ClassesContent.css';

export interface ClassesContentProps {
    coachId: string;
}

const ClassesContent: React.FC<ClassesContentProps> = ({ coachId }) => {
    const [classes, setClasses] = useState<CoachClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<CoachClass | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        dateRange: 'upcoming',
    });

    // Cargar clases
    const fetchClasses = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const dateFilters: any = {};
            const today = new Date().toISOString().split('T')[0];

            switch (filters.dateRange) {
                case 'today':
                    dateFilters.date_from = today;
                    dateFilters.date_to = today;
                    break;
                case 'upcoming':
                    dateFilters.date_from = today;
                    break;
                case 'week':
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    dateFilters.date_from = today;
                    dateFilters.date_to = weekFromNow.toISOString().split('T')[0];
                    break;
                case 'past':
                    dateFilters.date_to = today;
                    break;
            }

            const filterParams = {
                ...dateFilters,
                ...(filters.status && { status: filters.status }),
            };

            const data = await getCoachClasses(coachId, filterParams);
            setClasses(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar clases';
            setError(errorMessage);
            console.error('Error fetching classes:', err);
        } finally {
            setIsLoading(false);
        }
    }, [coachId, filters]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    // Handlers
    const handleFilterChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);
    }, []);

    const handleViewClass = useCallback(async (classItem: CoachClass) => {
        try {
            const classDetails = await getClassDetails(classItem.id);
            setSelectedClass(classDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading class details:', error);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedClass(null);
    }, []);

    // Calcular estadísticas
    const upcomingClasses = classes.filter((c) => new Date(c.reservation_date) >= new Date() && ['pending', 'confirmed'].includes(c.status)).length;

    const completedClasses = classes.filter((c) => c.status === 'completed').length;

    if (error) {
        return (
            <div className="classes-content">
                <div className="error-container">
                    <h3>Error al cargar clases</h3>
                    <p>{error}</p>
                    <button onClick={fetchClasses} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="classes-content">
            <ClassesHeader
                title="Gestion de Mis Clases"
                totalClasses={classes.length}
                upcomingClasses={upcomingClasses}
                completedClasses={completedClasses}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <ClassesList classes={classes} isLoading={isLoading} onViewClass={handleViewClass} />

            <ClassDetailsModal isOpen={isModalOpen} classDetails={selectedClass} onClose={handleCloseModal} />
        </div>
    );
};

export default ClassesContent;
