
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { tasksApi } from './api/tasksApi';
import { usersApi } from './api/usersApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    
    // Regular Redux slices
    auth: authReducer,
    ui: uiReducer,
    tasks: tasksReducer,
  },
  
  // Adding RTK Query middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authApi.middleware)
      .concat(tasksApi.middleware)
      .concat(usersApi.middleware),
      
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for RTK Query (refetchOnFocus, refetchOnReconnect)
setupListeners(store.dispatch);

// Type definitions for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
