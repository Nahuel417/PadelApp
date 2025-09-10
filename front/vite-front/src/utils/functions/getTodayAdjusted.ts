export const getTodayAdjusted = () => {
    const now = new Date();
    const today = new Date(now);

    // Si la hora es menor a 1 (00:00 a 00:59), seguimos considerando el día anterior
    if (now.getHours() < 1) {
        today.setDate(today.getDate() - 1);
    }

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 1 a 12
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // formato YYYY-MM-DD
};
