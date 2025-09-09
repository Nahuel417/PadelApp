export enum PaymentStatus {
    PENDING_PAYMENT = 'pending',
    APPROVED_PAYMENT = 'approved', // Pago aprobado.
    REJECTED_PAYMENT = 'rejected', // Pago rechazado.
    CANCELLED_PAYMENT = 'cancelled',
    REFUNDED_PAYMENT = 'refunded', // Pago reembolsado.
}
