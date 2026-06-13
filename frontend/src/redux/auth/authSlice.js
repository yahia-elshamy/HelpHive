import { createSlice } from "@reduxjs/toolkit";

// Helper: safely read from localStorage
const loadUserFromStorage = () => {
    try {
        const user = localStorage.getItem("hh_user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const initialState = {
    user: loadUserFromStorage(),       // rehydrate on startup
    accessToken: null,                 // never persist this — it's short-lived (15 min)
    isAuthenticated: !!loadUserFromStorage()  // true if user exists in storage
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;

            // Save user info to localStorage so it survives refresh
            localStorage.setItem("hh_user", JSON.stringify(user));
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            // Clean up localStorage on logout
            localStorage.removeItem("hh_user");
        }
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;