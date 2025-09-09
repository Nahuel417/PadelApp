export const calcularEndTime = (startTime: string) => {
    const [horas, minutos] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(horas + 1, minutos, 0, 0);
    return date.toTimeString().slice(0, 5);
};
