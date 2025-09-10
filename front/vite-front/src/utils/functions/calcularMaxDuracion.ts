export const calcularMaxDuracion = (startHora: string, reservasMap: Record<string, string>) => {
    let duracion = 0;
    let [h, m] = startHora.split(':').map(Number);
    let minutos = h * 60 + m;

    while (duracion < 4) {
        // máximo permitido
        const hh = Math.floor((minutos / 60) % 24);
        const mm = minutos % 60;
        const horaStr = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

        // Si no existe el horario en el mapa, terminamos
        if (!(horaStr in reservasMap)) break;
        // Si está ocupado o pendiente, terminamos
        if (reservasMap[horaStr] === 'no_disponible' || reservasMap[horaStr] === 'pendiente') break;

        duracion++;
        minutos += 60;
    }

    // Ajuste: si hay un siguiente bloque disponible, sumamos 1 más para que el último bloque se cuente completo
    const siguienteBloque = `${Math.floor((minutos / 60) % 24)
        .toString()
        .padStart(2, '0')}:${(minutos % 60).toString().padStart(2, '0')}`;
    if (siguienteBloque in reservasMap && reservasMap[siguienteBloque] !== 'no_disponible' && reservasMap[siguienteBloque] !== 'pendiente') {
        duracion++;
    }

    return duracion;
};
