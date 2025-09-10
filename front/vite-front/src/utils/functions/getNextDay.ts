export const getNextDays = (n = 7) => {
    const now = new Date();

    // Ajustamos la fecha: si son entre 00:00 y 00:59, seguimos considerando "hoy" como el día anterior
    const today = new Date(now);
    if (now.getHours() < 1) {
        today.setDate(today.getDate() - 1);
    }

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };
    const days = [];

    for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Etiqueta amigable
        const label = date.toLocaleDateString('es-ES', options);
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

        // Fecha exacta local
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 1 a 12
        const day = String(date.getDate()).padStart(2, '0');
        const exactDate = `${year}-${month}-${day}`;

        days.push({
            date,
            label: formattedLabel,
            exactDate,
        });
    }

    return days;
};
