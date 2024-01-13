import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import calcReducer from './calcSlice';
import applicReducer from './applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calc: calcReducer,
    applic: applicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;