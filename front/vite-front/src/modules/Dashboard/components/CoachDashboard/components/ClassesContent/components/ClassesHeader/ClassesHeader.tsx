import React from 'react';
import './ClassesHeader.css';

export interface ClassesHeaderProps {
    title: string;
    totalClasses: number;
    upcomingClasses: number;
    completedClasses: number;
    filters: {
        status: string;
        dateRange: string;
    };
    onFilterChange: (filters: { status: string; dateRange: string }) => void;
}

const ClassesHeader: React.FC<ClassesHeaderProps> = ({
    title,
    totalClasses,
    upcomingClasses,
    completedClasses,
    filters,
    onFilterChange
}) => {
    const handleStatusChange = (status: string) => {
        onFilterChange({ ...filters, status });
    };

    const handleDateRangeChange = (dateRange: string) => {
        onFilterChange({ ...filters, dateRange });
    };

    return (
        <div className="classes-header">
            <div className="classes-header__top">
                <div className="classes-header__title-section">
                    <h3 className="classes-header__title">{title}</h3>
                    <div className="classes-header__stats">
                        <span className="stat-item">
                            <i className="bi bi-calendar-check"></i>
                            Total: {totalClasses}
                        </span>
                        <span className="stat-item upcoming">
                            <i className="bi bi-clock"></i>
                            Próximas: {upcomingClasses}
                        </span>
                        <span className="stat-item completed">
                            <i className="bi bi-check-circle"></i>
                            Completadas: {completedClasses}
                        </span>
                    </div>
                </div>
            </div>

            <div className="classes-header__filters">
                <div className="filter-group">
                    <label className="filter-label">Estado:</label>
                    <select 
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="completed">Completadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Período:</label>
                    <select 
                        className="filter-select"
                        value={filters.dateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                    >
                        <option value="upcoming">Próximas</option>
                        <option value="today">Hoy</option>
                        <option value="week">Esta Semana</option>
                        <option value="past">Pasadas</option>
                        <option value="">Todas</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ClassesHeader;
