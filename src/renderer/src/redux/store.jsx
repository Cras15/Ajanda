import { configureStore } from '@reduxjs/toolkit'
import dateSlice from './dateSlice'
import settingsSlice from './settingsSlice'
import snackbarSlice from './snackbarSlice'

export const store = configureStore({
    reducer: {
        snackbar: snackbarSlice,
        dates: dateSlice,
        settings: settingsSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})