import { ReserveStatus } from '../types/types';

export const STATUS_LABELS: Record<ReserveStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada'
};

export const STATUS_COLORS: Record<ReserveStatus, { bg: string; text: string; border: string }> = {
    pending: {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fcd34d'
    },
    confirmed: {
        bg: '#d1fae5',
        text: '#065f46',
        border: '#6ee7b7'
    },
    completed: {
        bg: '#dbeafe',
        text: '#0c2d6b',
        border: '#93c5fd'
    },
    cancelled: {
        bg: '#fee2e2',
        text: '#7f1d1d',
        border: '#fca5a5'
    }
};

export const MOCK_RESERVES = [
    {
        id: '1',
        courtName: 'Cancha 1',
        date: '2025-10-28',
        startTime: '10:00',
        endTime: '11:00',
        userName: 'Carlos López',
        status: 'pending' as ReserveStatus,
        price: 150,
        trainerName: 'Juan Pérez'
    },
    {
        id: '2',
        courtName: 'Cancha 2',
        date: '2025-10-28',
        startTime: '14:00',
        endTime: '15:30',
        userName: 'María García',
        status: 'confirmed' as ReserveStatus,
        price: 225,
        trainerName: undefined
    },
    {
        id: '3',
        courtName: 'Cancha 3',
        date: '2025-10-27',
        startTime: '18:00',
        endTime: '19:00',
        userName: 'Pedro Martínez',
        status: 'completed' as ReserveStatus,
        price: 150
    },
    {
        id: '4',
        courtName: 'Cancha 1',
        date: '2025-10-26',
        startTime: '09:00',
        endTime: '10:00',
        userName: 'Ana Rodríguez',
        status: 'cancelled' as ReserveStatus,
        price: 150
    }
];
