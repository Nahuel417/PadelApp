export const getDateFromWeekday = (weekdayIndex: number): string => {
    const today = new Date();
    const dayDiff = weekdayIndex - today.getDay();

    const fechaSeleccionada = new Date(today);
    fechaSeleccionada.setDate(today.getDate() + dayDiff);

    return fechaSeleccionada.toISOString().split('T')[0];
};
