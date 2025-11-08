import React, { useState, useEffect, useCallback } from 'react';
import { getCoachStudents, CoachStudent } from '../../../../../../services/coachServices';
import './StudentsContent.css';

export interface StudentsContentProps {
    coachId: string;
}

const StudentsContent: React.FC<StudentsContentProps> = ({ coachId }) => {
    const [students, setStudents] = useState<CoachStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Cargar estudiantes
    const fetchStudents = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getCoachStudents(coachId);
            setStudents(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar estudiantes';
            setError(errorMessage);
            console.error('Error fetching students:', err);
        } finally {
            setIsLoading(false);
        }
    }, [coachId]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Filtrar estudiantes por búsqueda
    const filteredStudents = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return (
            <div className="students-content">
                <div className="error-container">
                    <h3>Error al cargar estudiantes</h3>
                    <p>{error}</p>
                    <button onClick={fetchStudents} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="students-content">
            <div className="students-header">
                <h3 className="students-title">Mis Alumnos</h3>
                <p className="students-subtitle">Gestiona la información de tus estudiantes</p>
                
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando estudiantes...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="bi bi-people"></i>
                    </div>
                    <h4>
                        {searchTerm ? 'No se encontraron estudiantes' : 'Aún no tienes estudiantes'}
                    </h4>
                    <p>
                        {searchTerm 
                            ? 'Intenta con otros términos de búsqueda'
                            : 'Los estudiantes aparecerán aquí cuando tengas clases programadas'
                        }
                    </p>
                </div>
            ) : (
                <div className="students-grid">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="student-card">
                            <div className="student-card__header">
                                <div className="student-avatar">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <div className="student-info">
                                    <h4 className="student-name">
                                        {student.first_name} {student.last_name}
                                    </h4>
                                    <p className="student-email">{student.email}</p>
                                </div>
                            </div>
                            
                            <div className="student-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Total de Clases</span>
                                    <span className="stat-value">{student.total_classes}</span>
                                </div>
                                
                                {student.last_class_date && (
                                    <div className="stat-item">
                                        <span className="stat-label">Última Clase</span>
                                        <span className="stat-value">
                                            {new Date(student.last_class_date).toLocaleDateString('es-AR')}
                                        </span>
                                    </div>
                                )}
                                
                                {student.next_class_date && (
                                    <div className="stat-item">
                                        <span className="stat-label">Próxima Clase</span>
                                        <span className="stat-value upcoming">
                                            {new Date(student.next_class_date).toLocaleDateString('es-AR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentsContent;
