import { api } from "../api/api";
import { type RegUser, type LogUser, type ApiResponse, type Card, type User, type FavoriteCard, type CartItem, type CartResponse } from "../ts/types";
import { renderCartItems } from "./cartFunctions";
import { renderFavoriteCards } from "./favoriteFunctions";
import { loading, renderAllCard, renderAllcategories, setFavoriteIds, setCurrentUser, currentUser, updateNavUI } from "./functions";
import { renderMyProducts } from "./myProductsFunctions";
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

        const fetchedCards = response.data.data;
        const ids = fetchedCards.map((card) => card.id);

        setFavoriteIds(ids);

        return fetchedCards;
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function getCarts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await api.get<ApiResponse<CartResponse<CartItem[]>>>('/cart');

        return response.data.data.items
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function getMyProducts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await api.get<ApiResponse<Card[]>>('/products/mine');

        return response.data.data
    } catch (error) {
        console.error(error)
    }
}

export async function deleteMyProduct(productId: string) {
    try {
        const response = await api.delete(`/products/${productId}`);

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function updateMyProduct(productId: string, formData: FormData) {
    try {
        const response = await api.patch(`/products/${productId}`, formData);

        return response.data.data
    } catch (error) {
        console.error(error)
        throw error;
    }
    
}

export async function addToCart(productId: string, qty : number) {
    try {
        const response = await api.post(`/cart/${productId}`, { qty });

        return response.data
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export async function setCartQty(productId: string, qty : number) {
    try {
        return api.patch(`/cart/${productId}`, { qty });
    } catch (error) {
        console.error(error)
        throw error;
    }    
}

export async function removeFromCart(productId: string) {
    try {
        return api.delete(`/cart/${productId}`);
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function clearCart() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        return api.delete('/cart');
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function addToFavorites(productId: string) {
    try {
        const response = await api.post(`/favorites/${productId}`);

        if (currentUser) {
            setFavoriteIds(currentUser.favorites);
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

        if (currentUser) {
            setFavoriteIds(currentUser.favorites);
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

export async function addProduct(formData: FormData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await api.post<ApiResponse<Card>>('/products', formData);

        return response.data.data
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function getData(isLogin: boolean) {
    try {
        loading(true);

        const user = await getMe();
        setCurrentUser(user);

        const [categories, favorites, data, carts, mine] = await Promise.all([
            getCategories(),
            getFavorites(),
            getProducts(),
            getCarts(),
            getMyProducts()
        ])

        loading(false);

        if (isLogin === true && user) {
            updateNavUI(user);
            renderAllCard(data);
            renderAllcategories(categories);
            renderFavoriteCards(favorites);
            renderCartItems(carts);
            renderMyProducts(mine || [])
        } else if (isLogin === false) {
            renderAllCard(data);
            renderAllcategories(categories);
        }
    } catch (error) {
        console.error(error)
        loading(false);
    }
};