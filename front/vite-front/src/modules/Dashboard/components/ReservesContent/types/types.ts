export type ReserveStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reserve {
    id: string;
    courtName: string;
    date: string;
    startTime: string;
    endTime: string;
    userName: string;
    status: ReserveStatus;
    price: number;
    trainerName?: string;
}

export interface ReservesContentProps {
    userRole?: 'admin' | 'coach' | 'superadmin';
}

export interface ReserveHeaderProps {
    title: string;
    totalReserves: number;
    pendingReserves: number;
}

export interface ReserveFiltersProps {
    selectedStatus: ReserveStatus | 'all';
    onStatusChange: (status: ReserveStatus | 'all') => void;
}

export interface ReserveListProps {
    reserves: Reserve[];
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onCancel?: (id: string) => void;
    isLoading?: boolean;
}

export interface ReserveRowProps {
    reserve: Reserve;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onCancel?: (id: string) => void;
}
