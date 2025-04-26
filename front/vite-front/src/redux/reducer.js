import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userActive: null,
    userAppointments: [],
};

const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        addUserActive: (state, action) => {
            state.userActive = action.payload;
        },

        removeUserActive: (state, action) => {
            state.userActive = null;
        },

        userAppointments: (state, action) => {
            state.userAppointments = action.payload;
        },

        addUserAppointments: (state, action) => {
            state.userAppointments.push(action.payload);
        },

        editUserAppointment: (state, action) => {
            const { id, status } = action.payload;
            const appointment = state.userAppointments.find((turno) => turno.id === id);

            if (appointment) {
                appointment.status = status;
            }
        },
    },
});

export default userSlice.reducer;

export const { addUserActive, removeUserActive, userAppointments, addUserAppointments, editUserAppointment } = userSlice.actions;
