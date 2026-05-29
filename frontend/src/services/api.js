import axios from "axios";
import store from "../redux/store";
import {setCredentials, clearCredentials} from "../redux/auth/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/refresh`,
                    {withCredentials: true}
                );

                const {accessToken} = response.data;

                const currentUser = store.getState().auth.user;
                store.dispatch(setCredentials({
                    user: currentUser,
                    accessToken
                }));

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch(refreshError){
                store.dispatch(clearCredentials());
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;