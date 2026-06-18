import { api } from "../api/api";
import { type RegUser, type LogUser, type ApiResponse, type Card, type User } from "../ts/types";
import { loading, renderAllCard, renderAllcategories, setFavoriteIds } from "./functions";
import { showFormError } from "./validation";

export async function getMe() : Promise<User | null> {
    try {
        const token = localStorage.getItem('token');

        if (!token) return null;

        const response = await api.get<ApiResponse<User>>('/auth/me');

        console.log(response.data)
        return response.data.data
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function registerUser(userData: RegUser) {
    try {
        const response = await api.post('/auth/register', userData);

        localStorage.setItem('token', response.data.data.token);

        return response.data
    } catch (error: any) {
        console.error(error)
        const message = error.response?.data?.message;

        if (message) {
            showFormError(message);
        }
        throw error;
    }
}

export async function loginUser(userData: LogUser) {
    try {
        const response = await api.post('/auth/login', userData);

        localStorage.setItem('token', response.data.data.token);


        return response.data
    } catch (error: any) {
        console.error(error)
        const message = error.response?.data?.message;

        if (message) {
            showFormError(message);
        }
        throw error;
    }
}

export async function getCategories() {
    try {
        const response = await api.get('/products/categories');

        return response.data.data
    } catch (error) {
        console.error(error)
    }
};

export async function getFavorites() {
    try {
        const response = await api.get('/favorites');

        setFavoriteIds((await getMe())?.favorites ?? []);

        return response.data.data
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function addToFavorites(productId : string) {
    try {
        const response = await api.post(`/favorites/${productId}`);

        setFavoriteIds((await getMe())?.favorites ?? []);

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function removeFromFavorites(productId : string) {
    try {
        const response = await api.delete(`/favorites/${productId}`);

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function getProducts(q = "", category = "all") {
    const response = await api.get<ApiResponse<Card[]>>("/products", {
        params: {
            q,
            category: category === "all" ? undefined : category
        }
    });

    return response.data.data
};

export async function getData() {
    try {
        loading(true);
        const categories = await getCategories();
        const data = await getProducts();

        
        loading(false);
        renderAllCard(data);
        renderAllcategories(categories);
    } catch (error) {
        console.error(error)
    }
}