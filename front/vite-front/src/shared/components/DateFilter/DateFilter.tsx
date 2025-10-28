import React, { useState, useEffect } from 'react';
import './DateFilter.css';

export interface DateFilterProps {
    selectedDate?: Date;
    onDateChange: (date: Date | null) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export const DateFilter: React.FC<DateFilterProps> = ({
    selectedDate,
    onDateChange,
    placeholder = 'Seleccionar fecha',
    label,
    className = '',
    disabled = false,
    minDate,
    maxDate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (selectedDate) {
            // Si hay fecha seleccionada, mostrar su mes
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        } else {
            // Por defecto mostrar mes actual
            setCurrentMonth(new Date());
        }
    }, [selectedDate]);

    const formatDateForDisplay = (date: Date | undefined): string => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleDateSelect = (date: Date) => {
        // No permitir fechas futuras
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Fin del día actual

        if (date > today) return;

        onDateChange(date);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);

        // Solo permitir navegar a años razonables (desde 2020)
        if (prevMonth.getFullYear() >= 2020) {
            setCurrentMonth(prevMonth);
        }
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        const today = new Date();

        // Solo permitir navegar al mes actual si estamos en un mes anterior
        if (nextMonth.getFullYear() < today.getFullYear() ||
            (nextMonth.getFullYear() === today.getFullYear() && nextMonth.getMonth() <= today.getMonth())) {
            setCurrentMonth(nextMonth);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Días del mes anterior para completar la primera semana
        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevMonthLastDay = new Date(year, month, 0);
            const day = prevMonthLastDay.getDate() - (startingDayOfWeek - 1 - i);
            days.push({
                date: new Date(year, month - 1, day),
                isCurrentMonth: false,
                isDisabled: true
            });
        }

        // Días del mes actual
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isFuture = date > today;

            days.push({
                date,
                isCurrentMonth: true,
                isToday,
                isSelected,
                isDisabled: isFuture
            });
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className={`date-filter ${className}`}>
            {label && <label className="date-filter-label">{label}</label>}
            <div className="date-filter-input-container">
                <button
                    className="date-filter-input"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    type="button"
                >
                    <span className="date-filter-value">
                        {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
                    </span>
                    <div className="date-filter-icon-container">
                        {selectedDate && (
                            <button
                                type="button"
                                className="date-filter-clear"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDateChange(null);
                                    setIsOpen(false);
                                }}
                                title="Quitar filtro"
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                        <div className="date-filter-icon">
                            <i className="bi bi-calendar-event"></i>
                        </div>
                    </div>
                </button>

                {isOpen && (
                    <div className="date-filter-calendar-overlay">
                        <div className="date-filter-calendar">
                            {/* Header del calendario */}
                            <div className="date-filter-calendar-header">
                                <button
                                    type="button"
                                    className="date-filter-calendar-nav"
                                    onClick={handlePrevMonth}
                                    disabled={currentMonth.getFullYear() <= 2020}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <div className="date-filter-calendar-month">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </div>
                                <button
                                    type="button"
                                    className="date-filter-calendar-nav"
                                    onClick={handleNextMonth}
                                    disabled={currentMonth.getMonth() === new Date().getMonth() &&
                                             currentMonth.getFullYear() === new Date().getFullYear()}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="date-filter-calendar-weekdays">
                                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                                    <div key={day} className="date-filter-calendar-weekday">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Días del mes */}
                            <div className="date-filter-calendar-days">
                                {days.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`date-filter-calendar-day ${
                                            day.isToday ? 'today' : ''
                                        } ${
                                            day.isSelected ? 'selected' : ''
                                        } ${
                                            day.isDisabled ? 'disabled' : ''
                                        }`}
                                        onClick={() => !day.isDisabled && handleDateSelect(day.date)}
                                        disabled={day.isDisabled}
                                    >
                                        {day.date.getDate()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {isOpen && (
                    <div
                        className="date-filter-backdrop"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};
