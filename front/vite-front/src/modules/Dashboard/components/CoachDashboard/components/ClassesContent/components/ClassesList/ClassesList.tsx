import React from 'react';
import { CoachClass } from '../../../../../../../../services/coachServices';
import ClassCard from './components/ClassCard/ClassCard';
import './ClassesList.css';

export interface ClassesListProps {
    classes: CoachClass[];
    isLoading: boolean;
    onViewClass: (classItem: CoachClass) => void;
}

const ClassesList: React.FC<ClassesListProps> = ({
    classes,
    isLoading,
    onViewClass
}) => {
    if (isLoading) {
        return (
            <div className="classes-list">
                <div className="classes-list__loading">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="class-card-skeleton">
                            <div className="skeleton-header"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                            </div>
                            <div className="skeleton-actions"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="classes-list">
                <div className="classes-list__empty">
                    <div className="empty-icon">
                        <i className="bi bi-calendar-x"></i>
                    </div>
                    <h3>No hay clases programadas</h3>
                    <p>Las clases aparecerán aquí cuando los alumnos hagan reservas contigo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="classes-list">
            <div className="classes-list__grid">
                {classes.map((classItem) => (
                    <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        onViewDetails={() => onViewClass(classItem)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClassesList;
