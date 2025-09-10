export const validarHorariosConsecutivos = (horarios: string[]) => {
    if (!horarios || horarios.length <= 1) return true;

    // Convertimos a minutos
    let times = horarios.map((h) => {
        const [hh, mm] = h.split(':').map(Number);
        return hh * 60 + mm;
    });

    // Intentamos cada horario como punto de partida
    for (let startIndex = 0; startIndex < times.length; startIndex++) {
        const start = times[startIndex];
        // Ajustamos los tiempos para que todos sean >= start (si cruzan medianoche sumamos 1440)
        const adjusted = times.map((t) => (t < start ? t + 1440 : t));
        adjusted.sort((a, b) => a - b);

        // Verificamos consecutividad
        let consecutivos = true;
        for (let i = 1; i < adjusted.length; i++) {
            if (adjusted[i] - adjusted[i - 1] !== 60) {
                consecutivos = false;
                break;
            }
        }
        if (consecutivos) return true; // si alguna alineación funciona, es válida
    }

    return false; // ninguna alineación es consecutiva
};
