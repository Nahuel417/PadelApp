import { create } from 'zustand';
import { fetchCanchas, fetchEntrenadores } from '../services/reservation';
import { Court } from '../interfaces/courtsInterface';
import { Coach } from '../interfaces/coachInterface';

interface ReservationStore {
    courts: Court[];
    coaches: Coach[];
    loading: boolean;
    fetchInitialData: () => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
    courts: [],
    coaches: [],
    loading: false,
    fetchInitialData: async () => {
        const { courts, coaches } = get();
        if (courts.length > 0 && coaches.length > 0) return;

        set({ loading: true });

        let newCourts: Court[] = [];
        let newCoaches: Coach[] = [];

        try {
            newCourts = await fetchCanchas();
        } catch (error) {
            console.error('Error al cargar canchas:', error);
            newCourts = [];
        }

        try {
            newCoaches = await fetchEntrenadores();
        } catch (error) {
            console.error('Error al cargar entrenadores:', error);
            newCoaches = [];
        }

        set({ courts: newCourts, coaches: newCoaches, loading: false });
    },
}));
