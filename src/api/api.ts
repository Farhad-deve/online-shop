import axios from "axios";

export const api = axios.create({
    baseURL: "https://online-shop-auth-api.onrender.com/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => Promise.reject(error)
);
