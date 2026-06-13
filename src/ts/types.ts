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

export interface RegUser {
    name: string;
    email: string;
    password: string;
}