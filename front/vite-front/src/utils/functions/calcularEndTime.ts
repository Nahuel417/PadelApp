export const calcularEndTime = (horarios: string[]) => {
    if (!horarios || horarios.length === 0) return null;

    // Convertimos a minutos
    const timesInMinutes = horarios.map((h) => {
        const [hh, mm] = h.split(':').map(Number);
        return hh * 60 + mm;
    });

    const firstTime = timesInMinutes[0]; // tomamos el primer horario seleccionado
    const adjusted = timesInMinutes.map((t) => (t < firstTime ? t + 1440 : t));
    adjusted.sort((a, b) => a - b);

    const start = adjusted[0];
    const end = adjusted[adjusted.length - 1] + 60;

    const toHHMM = (m: number) => {
        const total = m % 1440;
        const h = Math.floor(total / 60)
            .toString()
            .padStart(2, '0');
        const mm = (total % 60).toString().padStart(2, '0');
        return `${h}:${mm}`;
    };

    return {
        start_time: toHHMM(start),
        end_time: toHHMM(end),
    };
};
