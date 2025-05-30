
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    tasks: tasksReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
