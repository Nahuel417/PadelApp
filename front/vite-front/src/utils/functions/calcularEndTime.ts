export const calcularEndTime = (horarios: string[]) => {
    if (!horarios || horarios.length === 0) return null;

    // Ordenar horarios
    const sortedHoras = horarios
        .map((h) => h.trim())
        .sort((a, b) => {
            const [ha, ma] = a.split(':').map(Number);
            const [hb, mb] = b.split(':').map(Number);
            return ha - hb || ma - mb;
        });

    const start_time = sortedHoras[0];

    // Calcular end_time sumando 1 hora al último horario
    const [horasUlt, minutosUlt] = sortedHoras[sortedHoras.length - 1].split(':').map(Number);
    const date = new Date();
    date.setHours(horasUlt + 1, minutosUlt, 0, 0);
    const end_time = date.toTimeString().slice(0, 5);

    return { start_time, end_time };
};
