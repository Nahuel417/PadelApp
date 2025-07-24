import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../interfaces/userInterface';
import { Reservation } from '../interfaces/reservationInterface';

interface UserState {
    userActive: User | null | undefined;
    userReservations: Reservation[];

    addUserActive: (user: User) => void;
    removeUserActive: () => void;

    setUserReservations: (reservations: Reservation[]) => void;
    addUserReservation: (reservation: Reservation) => void;
    editUserReservation: (id: string, status: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
    userActive: undefined,
    userReservations: [],

    addUserActive: (user) => set(() => ({ userActive: user })),
    removeUserActive: () => set(() => ({ userActive: null })),

    setUserReservations: (reservations) => set(() => ({ userReservations: reservations })),

    addUserReservation: (reservation) =>
        set((state) => ({
            userReservations: [...state.userReservations, reservation],
        })),

    editUserReservation: (id, status) =>
        set((state) => ({
            userReservations: state.userReservations.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
}));
