import React from 'react';
import { CoachClass } from '../../../../../../../../services/coachServices';
import { ClassRow } from '../ClassRow/ClassRow';
import { ClassTableHeader } from '../ClassTableHeader/ClassTableHeader';
import { Pagination } from '../../../../../../../../shared';
import './ClassesList.css';

export interface ClassesListProps {
    classes: CoachClass[];
    isLoading: boolean;
    onViewClass: (classItem: CoachClass) => void;
    currentPage?: number;
    hasNextPage?: boolean;
    onPageChange?: (page: number) => void;
}

const ClassesList: React.FC<ClassesListProps> = ({ classes, isLoading, onViewClass, currentPage = 1, hasNextPage, onPageChange }) => {
    if (isLoading && classes.length === 0) {
        return (
            <div className="class-list-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="class-list-empty">
                <div className="class-empty-icon">
                    <i className="bi bi-inbox"></i>
                </div>
                <div className="class-empty-content">
                    <h3>No se registran clases</h3>
                    <p>Ajustá los filtros o revisá más tarde para ver nuevas clases programadas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="class-table-container">
            <ClassTableHeader />
            <div className="class-table">
                {classes.map((classItem) => (
                    <ClassRow key={classItem.id} classItem={classItem} onViewDetails={onViewClass} />
                ))}
            </div>

            {/* Paginación */}
            {onPageChange && <Pagination currentPage={currentPage} hasNextPage={hasNextPage || false} onPageChange={onPageChange} />}
        </div>
    );
};

export default ClassesList;
