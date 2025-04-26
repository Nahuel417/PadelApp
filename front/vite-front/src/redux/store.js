import { configureStore } from '@reduxjs/toolkit';
import userSliceReducer from './reducer';

const store = configureStore({
    reducer: {
        userData: userSliceReducer,
    },
});

export default store;
