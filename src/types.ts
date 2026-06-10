export interface Card {
    id: number;
    title: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    images: string[];
    thumbnail: string;
}

export interface FavoriteCard {
    id: number;
    title: string;
    category: string;
    price: number;
    thumbnail: string;
}

export interface CartItem extends FavoriteCard {
    quantity: number;
}