export const getHorasBloque = (start_time: string, end_time: string): string[] => {
    const horas: string[] = [];
    let [startH, startM] = start_time.split(':').map(Number);
    let [endH, endM] = end_time.split(':').map(Number);

    let current = startH * 60 + startM;
    let end = endH * 60 + endM;

    if (end <= current) end += 24 * 60; // cruzando medianoche

    while (current < end) {
        const h = Math.floor(current / 60) % 24;
        const m = current % 60;
        horas.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        current += 60; // bloques de 1 hora
    }
    return horas;
};
