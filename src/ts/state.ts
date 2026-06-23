import { updateCounterFavorites } from "./favoriteFunctions";
import type { User } from "./types";

export let productFormMode: "create" | "edit" = "create";
export let currentEditingProductId: string | null = null;


// Filter state
export const filters = {
  category: "All",
  search: ""
}

// Auth state
export let favoriteIds: string[] = [];
export let currentUser: User | null = null;


// Setters
export function setCurrentUser(user: User | null) {
  currentUser = user;
};

export function setFavoriteIds(ids: string[]) {
  favoriteIds = ids; 

  updateCounterFavorites();
};

export function setEditingProduct(id: string | null, mode: "create" | "edit") {
    productFormMode = mode;
    currentEditingProductId = id;
};