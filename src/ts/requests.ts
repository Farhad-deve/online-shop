import { api } from "../api/api";
import { type RegUser, type LogUser, type ApiResponse, type Card, type User, type FavoriteCard, type CartItem } from "../ts/types";
import { renderCartItems } from "./cartFunctions";
import { renderFavoriteCards } from "./favoriteFunctions";
import { loading, renderAllCard, renderAllcategories, setFavoriteIds } from "./functions";
import { showFormError } from "./validation";

export async function getMe(): Promise<User | null> {
    try {
        const token = localStorage.getItem('token');

        if (!token) return null;

        const response = await api.get<ApiResponse<User>>('/auth/me');

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
        const response = await api.get<ApiResponse<string[]>>('/products/categories');

        return response.data.data
    } catch (error) {
        console.error(error)
        return [];
    }
};

export async function getFavorites() {
    try {
        const token = localStorage.getItem('token');

        if (!token) return [];

        const response = await api.get<ApiResponse<FavoriteCard[]>>('/favorites');

        const user = await getMe();

        if (user) {
            setFavoriteIds(user.favorites);
        }

        return response.data.data
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function getCarts() {
    try {
        const token = localStorage.getItem('token');

        if (!token) return [];

        const response = await api.get<ApiResponse<CartItem[]>>('/cart');

        console.log(response.data.data)
        return response.data.data
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function addToCart(productId: string) {
    try {
        const response = await api.post(`/cart/${productId}`);

        const user = await getMe();

        if (user) {
            renderCartItems(user.cart);
        }

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
};



export async function addToFavorites(productId: string) {
    try {
        const response = await api.post(`/favorites/${productId}`);

        const user = await getMe();

        if (user) {
            setFavoriteIds(user.favorites);
        }

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function removeFromFavorites(productId: string) {
    try {
        const response = await api.delete(`/favorites/${productId}`);

        const user = await getMe();

        if (user) {
            setFavoriteIds(user.favorites);
        }

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

export async function getData(isLogin: boolean) {
    try {
        loading(true);
        const categories = await getCategories();
        const data = await getProducts();
        const favorites = await getFavorites();
        const carts = await getCarts();

        loading(false);
        if (isLogin === true) {
            renderAllCard(data);
            renderAllcategories(categories);
            renderFavoriteCards(favorites);
        } else if (isLogin === false) {
            renderAllCard(data);
            renderAllcategories(categories);
            getCarts();
        }
    } catch (error) {
        console.error(error)
    }
}