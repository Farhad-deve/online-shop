import axios from "axios";

export const api = axios.create({
    baseURL: "https://online-shop-auth-api.onrender.com/api",
});

