import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth.slice';
import planificationSlice from './slices/planification.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    planifications: planificationSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;