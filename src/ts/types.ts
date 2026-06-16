export interface Card {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;

    imageUrl: string;
    imagePublicId: string;

    owner: Owner;
    status: string;

    createdAt: string;
    updatedAt: string;

    rejectionReason?: string;
    reviewedBy?: string;
    reviewedAt?: string;
}

export interface Owner {
    email: string;
    name: string;
    id: string;
}

export interface FavoriteCard {
    id: string;
    title: string;
    category: string;
    price: number;
    imageUrl: string;
}

export interface CartItem extends FavoriteCard {
    quantity: number;
}

export interface LogUser {
    email: string;
    password: string;
}

export interface RegUser extends LogUser {
    name: string;
}

export interface User {
    name: string;
    role: string;
    email: string;
    id: string;
    cart: CartItem[];
    favorites: FavoriteCard[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta: Meta
}

export interface Meta {
  page: number
  limit: number
  total: number
  pages: number
}