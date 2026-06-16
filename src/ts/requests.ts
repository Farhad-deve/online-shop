import { api } from "../api/api";
import { type RegUser, type LogUser, type User } from "../ts/types";
import { renderAllcategories } from "./functions";
import { validateAuthForm, clearFormError, showFormError } from "./validation";

export async function getMe() {
    try {
        const response = await api.get('/auth/me');

        const token = localStorage.getItem('token');

        if (!token) return;

        return response.data.data
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function registerUser(userData : RegUser) {
    try {
        const response = await api.post('/auth/register', userData);

        localStorage.setItem('token', response.data.data.token);

        console.log(response)
        return response.data
    } catch(error : any) {
        console.dir(error)
        const message = error.response?.data?.message;

        if (message) {
            showFormError(message);
        }
    }
}

export async function loginUser(userData : LogUser) {
    try {
        const response = await api.post('/auth/login', userData);

        localStorage.setItem('token', response.data.data.token);

        console.log(response)
        return response.data
    } catch(error : any) {
        console.dir(error)
        const message = error.response?.data?.message;

        if (message) {
            showFormError(message);
        }
    }
}

export async function getCategories() {
    try {
        const response = await api.get('/products/categories');

        renderAllcategories(response.data.data);
    } catch(error) {
        console.error(error)
    }
}