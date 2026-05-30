import api from "./api.js";

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
}

export const registerUser = async (formData) => {
    const response = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export const logoutUser = async () => {
    const response = api.post("/auth/logout");
    return response.data;
}

export const forgotPasswordRequest = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPasswordRequest = async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
};