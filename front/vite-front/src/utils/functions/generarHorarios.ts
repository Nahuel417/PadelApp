export const generarHorarios = (startTime: string, endTime: string) => {
    const horarios: string[] = [];

    let hora = new Date(`1970-01-01T${startTime}`);
    const cierre = new Date(`1970-01-01T${endTime}`);

    if (cierre <= hora) {
        cierre.setDate(cierre.getDate() + 1);
    }

    while (hora <= cierre) {
        horarios.push(hora.toTimeString().slice(0, 5));
        hora.setHours(hora.getHours() + 1);
    }

    return horarios;
};
