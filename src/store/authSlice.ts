import {createSlice} from '@reduxjs/toolkit'
type AuthState = {isAuthenticated: boolean}

const initialState: AuthState = {  //trạng thái ban đầu: chưa đăng nhập
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.isAuthenticated = false
        },
    },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer