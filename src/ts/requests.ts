import { api } from "../api/api";
import { type RegUser, type LogUser } from "../ts/types";

export async function getMe() {
    try {
        const response = await api.get('/auth/me');

        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

export async function registerUser(userData : RegUser) {
    try {
        const response = await api.post('/auth/register', userData);

        localStorage.setItem('token', response.data.token);

        console.log(response)
        console.log(response.data.token)
    } catch(error) {
        console.error(error)
    }
}

export async function loginUser(userData : LogUser) {
    try {
        const response = await api.post('/auth/login', userData);

        localStorage.setItem('token', response.data.token);

        console.log(response)
        console.log(response.data.token)
    } catch(error) {
        console.error(error)
    }
}

export async function getCategories() {
    try {
        const response = await api.get('/products/categories');

        console.log(response)
    } catch(error) {
        console.error(error)
    }
}