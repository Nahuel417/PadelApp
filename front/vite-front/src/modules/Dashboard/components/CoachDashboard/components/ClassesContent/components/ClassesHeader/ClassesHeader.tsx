import React, { useMemo } from 'react';
import './ClassesHeader.css';
import FilterChips, { FilterChipOption } from '../../../../../../../../shared/components/Filters/FilterChips/FilterChips';

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

const formatCount = (value: number): string => new Intl.NumberFormat('es-AR').format(value);

// Opciones de filtros - siguiendo el patrón de ReserveFilters
const STATUS_OPTIONS: Array<string> = ['', 'pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
    '': 'Todas',
    'pending': 'Pendientes',
    'confirmed': 'Confirmadas',
    'completed': 'Completadas',
    'cancelled': 'Canceladas',
};

const DATE_RANGE_OPTIONS: Array<string> = ['', 'upcoming', 'today', 'week', 'past'];
const DATE_RANGE_LABELS: Record<string, string> = {
    '': 'Todas',
    'upcoming': 'Próximas',
    'today': 'Hoy',
    'week': 'Esta Semana',
    'past': 'Pasadas',
};

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

    const metrics = [
        { id: 'total', label: 'Totales', value: totalClasses },
        { id: 'upcoming', label: 'Próximas', value: upcomingClasses },
        { id: 'completed', label: 'Completadas', value: completedClasses },
    ];

    // Opciones para FilterChips - siguiendo el patrón de ReserveFilters
    const statusFilterOptions: FilterChipOption[] = useMemo(
        () => STATUS_OPTIONS.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
        []
    );

    const dateRangeFilterOptions: FilterChipOption[] = useMemo(
        () => DATE_RANGE_OPTIONS.map((dateRange) => ({ value: dateRange, label: DATE_RANGE_LABELS[dateRange] })),
        []
    );

    return (
        <>
            <div className="classes-header">
                <div className="classes-header-content">
                    <h2 className="classes-header-title">{title}</h2>
                    <span className="classes-header-caption">Resumen actualizado</span>
                </div>

                <div className="classes-header-stats" role="list">
                    {metrics.map((metric) => (
                        <div key={metric.id} className={`classes-header-stat classes-header-stat--${metric.id}`} role="listitem">
                            <span className="classes-header-stat-value">{formatCount(metric.value)}</span>
                            <span className="classes-header-stat-label">{metric.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="classes-filters">
                <div className="filter-section">
                    <label className="filter-label">Estado:</label>
                    <FilterChips 
                        selectedValue={filters.status} 
                        onChange={handleStatusChange} 
                        options={statusFilterOptions} 
                        className="classes-filter-chips" 
                    />
                </div>

                <div className="filter-section">
                    <label className="filter-label">Período:</label>
                    <FilterChips 
                        selectedValue={filters.dateRange} 
                        onChange={handleDateRangeChange} 
                        options={dateRangeFilterOptions} 
                        className="classes-filter-chips" 
                    />
                </div>
            </div>
        </>
    );
};

export default ClassesHeader;
