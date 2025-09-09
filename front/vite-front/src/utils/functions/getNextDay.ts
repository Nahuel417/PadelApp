export const getNextDays = (n = 7) => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };
    const days = [];

    for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const label = date.toLocaleDateString('es-ES', options);

        days.push({
            date,
            label: label.charAt(0).toUpperCase() + label.slice(1),
        });
    }

    return days;
};
