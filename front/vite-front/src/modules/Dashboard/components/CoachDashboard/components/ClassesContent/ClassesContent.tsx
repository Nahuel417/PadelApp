import React, { useState, useEffect, useCallback } from 'react';
import { getCoachClasses, getClassDetails, CoachClass } from '../../../../../../services/coachServices';
import ClassesHeader from './components/ClassesHeader/ClassesHeader';
import ClassesList from './components/ClassesList/ClassesList';
import ClassDetailsModal from './components/ClassDetailsModal/ClassDetailsModal';
import './ClassesContent.css';

interface ClassesFilters {
    status: string;
    selectedDate: Date | null;
}

export interface ClassesContentProps {
    coachId: string;
}

const ClassesContent: React.FC<ClassesContentProps> = ({ coachId }) => {
    const [classes, setClasses] = useState<CoachClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<CoachClass | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filters, setFilters] = useState<ClassesFilters>({
        status: '',
        selectedDate: null,
    });

    // Cargar clases
    const fetchClasses = useCallback(
        async (page: number = 1) => {
            try {
                setIsLoading(true);
                setError(null);

                const dateFilters: Record<string, string> = {};

                // Helper para formatear fecha en zona horaria local
                const formatDateLocal = (date: Date): string => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                if (filters.selectedDate) {
                    const selectedIso = formatDateLocal(filters.selectedDate);
                    dateFilters.date_from = selectedIso;
                    dateFilters.date_to = selectedIso;
                } else {
                    const todayIso = formatDateLocal(new Date());
                    dateFilters.date_from = todayIso;
                }

                const filterParams = {
                    ...dateFilters,
                    ...(filters.status && { status: filters.status }),
                    page,
                    limit: 10,
                };

                const data = await getCoachClasses(coachId, filterParams);
                setClasses(data);

                // Determinar si hay siguiente página (si se obtuvieron 10 registros, hay más)
                setHasNextPage(data.length === 10);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar clases';
                setError(errorMessage);
                console.error('Error fetching classes:', err);
            } finally {
                setIsLoading(false);
            }
        },
        [coachId, filters]
    );

    useEffect(() => {
        fetchClasses(currentPage);
    }, [currentPage, fetchClasses]);

    // Handlers
    const handleFilterChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Resetear a página 1 cuando cambian los filtros
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
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
                    <button onClick={() => fetchClasses(currentPage)} className="retry-button">
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

            <ClassesList classes={classes} isLoading={isLoading} onViewClass={handleViewClass} currentPage={currentPage} hasNextPage={hasNextPage} onPageChange={handlePageChange} />

            <ClassDetailsModal isOpen={isModalOpen} classDetails={selectedClass} onClose={handleCloseModal} />
        </div>
    );
};

export default ClassesContent;
