export enum ReservationStatus {
    PENDING = 'pending', // Creada, esperando el pago.
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed', // Cuando ya paso la fecha y hora de la reserva.
}
