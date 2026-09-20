import React, { useState, useEffect } from 'react';
import './DateFilter.css';

const START_YEAR_LIMIT = 2020;

const startOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

const endOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export interface DateFilterProps {
    selectedDate?: Date;
    onDateChange: (date: Date | null) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    allowFutureDates?: boolean;
}

export const DateFilter: React.FC<DateFilterProps> = ({
    selectedDate,
    onDateChange,
    placeholder = 'Seleccionar fecha',
    label,
    className = '',
    disabled = false,
    minDate,
    maxDate,
    allowFutureDates = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getMinAllowedMonth = () => (minDate ? startOfMonth(minDate) : new Date(START_YEAR_LIMIT, 0, 1));
    const getMaxAllowedMonth = () => (maxDate ? startOfMonth(maxDate) : null);

    const getIsPrevDisabled = (month: Date) => {
        const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        return prevMonth < getMinAllowedMonth();
    };

    const getIsNextDisabled = (month: Date) => {
        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

        if (!allowFutureDates) {
            const currentMonthStart = startOfMonth(new Date());
            return nextMonth > currentMonthStart;
        }

        const maxMonth = getMaxAllowedMonth();
        if (maxMonth) {
            return nextMonth > maxMonth;
        }

        return false;
    };

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
            year: 'numeric',
        });
    };

    const handleDateSelect = (date: Date) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Fin del día actual

        if (!allowFutureDates && date > today) return;
        if (minDate && date < startOfDay(minDate)) return;
        if (maxDate && date > endOfDay(maxDate)) return;

        onDateChange(date);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        if (getIsPrevDisabled(currentMonth)) {
            return;
        }

        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prevMonth);
    };

    const handleNextMonth = () => {
        if (getIsNextDisabled(currentMonth)) {
            return;
        }

        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(nextMonth);
    };

    const startOfDay = (date: Date) => {
        const copy = new Date(date);
        copy.setHours(0, 0, 0, 0);
        return copy;
    };

    const endOfDay = (date: Date) => {
        const copy = new Date(date);
        copy.setHours(23, 59, 59, 999);
        return copy;
    };

    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

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
                isDisabled: true,
            });
        }

        // Días del mes actual
        const today = startOfDay(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isFuture = !allowFutureDates && date > today;
            const isBeforeMin = minDate ? date < startOfDay(minDate) : false;
            const isAfterMax = maxDate ? date > endOfDay(maxDate) : false;

            days.push({
                date,
                isCurrentMonth: true,
                isToday,
                isSelected,
                isDisabled: isFuture || isBeforeMin || isAfterMax,
            });
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className={`date-filter ${className}`}>
            {label && <label className="date-filter-label">{label}</label>}
            <div className="date-filter-input-container">
                <button className="date-filter-input" onClick={() => setIsOpen(!isOpen)} disabled={disabled} type="button">
                    <span className="date-filter-value">{selectedDate ? formatDateForDisplay(selectedDate) : placeholder}</span>
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
                                title="Quitar filtro">
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
                                    disabled={minDate ? startOfMonth(currentMonth) <= startOfMonth(minDate) : currentMonth.getFullYear() <= 2020}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <div className="date-filter-calendar-month">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </div>
                                <button type="button" className="date-filter-calendar-nav" onClick={handleNextMonth} disabled={getIsNextDisabled(currentMonth)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="date-filter-calendar-weekdays">
                                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
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
                                        className={`date-filter-calendar-day ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''} ${day.isDisabled ? 'disabled' : ''}`}
                                        onClick={() => !day.isDisabled && handleDateSelect(day.date)}
                                        disabled={day.isDisabled}>
                                        {day.date.getDate()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {isOpen && <div className="date-filter-backdrop" onClick={() => setIsOpen(false)} />}
            </div>
        </div>
    );
};
