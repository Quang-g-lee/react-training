import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'

const AUTH_STORAGE_KEY = 'react-training:authenticated'

function readSavedAuth() {
    try {
        return typeof window !== 'undefined' &&
            window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    } catch {
        return false
    }
}

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    preloadedState: {
        auth: { isAuthenticated: readSavedAuth() }
    },
})

store.subscribe(() => {
    try {
        if (store.getState().auth.isAuthenticated) {
            window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        } else {
            window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
    } catch {
        // Biểu mẫu vẫn hoạt động trong thẻ hiện tại nếu bộ nhớ trình duyệt không khả dụng.
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
