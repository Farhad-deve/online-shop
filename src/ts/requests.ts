import { api } from "../api/api";
import { type RegUser } from "../ts/types";

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
    } catch(error) {
        console.error(error)
    }
}