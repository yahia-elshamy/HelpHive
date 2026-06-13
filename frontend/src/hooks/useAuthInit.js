// frontend/src/hooks/useAuthInit.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../redux/auth/authSlice";
import axios from "axios";

export default function useAuthInit() {
    // This flag prevents the app from rendering routes
    // before we know if the user is authenticated or not
    const [isAuthReady, setIsAuthReady] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to get a fresh access token using the HttpOnly refresh cookie
                // The cookie is sent automatically because of { withCredentials: true }
                const response = await axios.get(
                    "http://localhost:5000/auth/refresh",
                    { withCredentials: true }
                );

                const { accessToken } = response.data;

                // Get the user we saved in localStorage
                const savedUser = JSON.parse(localStorage.getItem("hh_user"));

                if (savedUser && accessToken) {
                    // Restore the full auth state
                    dispatch(setCredentials({
                        user: savedUser,
                        accessToken
                    }));
                } else {
                    dispatch(clearCredentials());
                }
            } catch {
                // Refresh token is expired or missing → user must log in again
                dispatch(clearCredentials());
            } finally {
                // Auth check is done — app can now render
                setIsAuthReady(true);
            }
        };

        initAuth();
    }, []); // runs once on mount

    return { isAuthReady };
}