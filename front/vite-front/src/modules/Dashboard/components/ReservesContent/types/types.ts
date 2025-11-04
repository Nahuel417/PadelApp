export type ReserveStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet';

export interface Reserve {
    id: string;
    courtName: string;
    date: string;
    startTime: string;
    endTime: string;
    userName: string;
    status: ReserveStatus;
    total_amount: number;
    trainerName?: string;
    payment_status?: PaymentStatus;
    payment_method?: PaymentMethod;
    payment_reference?: string;
    paid_at?: string;
    created_at?: string;
    cancelled_at?: string;
    notes?: string;
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
    onViewDetails?: (reserve: Reserve) => void;
    isLoading?: boolean;
    currentPage?: number;
    hasNextPage?: boolean;
    onPageChange?: (page: number) => void;
}

export interface ReserveRowProps {
    reserve: Reserve;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onCancel?: (id: string) => void;
    onViewDetails?: (reserve: Reserve) => void;
}
