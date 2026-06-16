import { api } from "../api/api";
import { renderFavoriteCards } from "./favoriteFunctions";

import { type ApiResponse, type Card, type User } from "./types";

export const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;
export const AuthContainer = document.querySelector("#auth-container") as HTMLElement;
export const AddProductContainer = document.getElementById("add-product-container") as HTMLElement;
export const CategoriesContainer = document.querySelector("#categories-container") as HTMLElement;

export const modal = document.querySelector('#modal') as HTMLDivElement;
const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;
export const authTitle = document.querySelector('#auth-title') as HTMLHeadElement;

export const Aside = document.querySelector('#aside') as HTMLElement;

export const openFavoriteBtn = document.querySelector('#open-favorite-btn') as HTMLButtonElement;
export const openCartBtn = document.querySelector('#open-cart-btn') as HTMLButtonElement;
export const openAuthContainerBtn = document.querySelector('#open-auth-container-btn') as HTMLButtonElement;
export const openAddProductBtn = document.querySelector('#open-add-product-btn') as HTMLButtonElement;

export const profileBtn = document.querySelector('#profile-btn') as HTMLDivElement;
export const profileName = document.querySelector('#profile-name') as HTMLSpanElement;
export const profileLetter = document.querySelector('#profile-letter') as HTMLSpanElement;

export const SearchInput = document.querySelector('#search-input') as HTMLInputElement;
export const nameInput = document.querySelector('#nameInput') as HTMLInputElement;
export const emailInput = document.querySelector('#emailInput') as HTMLInputElement;
export const passwordInput = document.querySelector('#passwordInput') as HTMLInputElement;

export const closeModalBtn = document.querySelectorAll('#close-modal-btn') as NodeListOf<HTMLButtonElement>;
export const authModeInputs = document.querySelectorAll('input[name="auth-mode"]') as NodeListOf<HTMLInputElement>;
export const authModeSwitch = document.querySelector('#auth-mode-switch') as HTMLDivElement;

const checkoutBar = document.querySelector('#checkout-bar') as HTMLDivElement;

const CartContainer = document.querySelector("#cart-container") as HTMLElement;

const loader = document.querySelector('#loader') as HTMLDivElement;

export const Form = document.querySelector('#auth-form') as HTMLFormElement;

export const formNameContainer = document.querySelector('#form-name-container') as HTMLDivElement;
export const authBtn = document.querySelector('#auth-btn') as HTMLButtonElement;
export const authHintText = document.querySelector('#auth-hint-text') as HTMLSpanElement;
export const authLink = document.querySelector('#auth-link') as HTMLAnchorElement;

export let products: Card[] = [];
export const filters = {
  category: "all",
  search: ""
}


export function createCard(data: Card) {
  const card = document.createElement("article");
  card.classList.add('card', 'rounded-8px', 'overflow-hidden', 'border-1', 'border-light-gray', 'bg-white', 'max-w-350px', 'transition-all-03s-ease', 'flex', 'flex-col');
  card.innerHTML = `
        <div class="relative">
          <img src="${data.imageUrl}" alt="${data.title}" loading="lazy" class="object-cover h-150px md-h-250px w-full pointer-events-none border-b-1 border-light-gray transition-all-03s-ease">
          <input type="checkbox" data-id="${data.id}" name="" id="favorite-checkbox-${data.id}" class="favorite-checkbox hidden">
          <div data-id="${data.id}" class="favorite-btn absolute btn-34 rounded-8px bg-light-red border-1 border-light-gray flex items-center justify-center">
            <label for="favorite-checkbox-${data.id}" class="cursor-pointer">
              <i class="fa-regular fa-heart text-gray heart-regular"></i>
              <i class="fa-solid fa-heart text-red heart-solid"></i>
            </label>
          </div>
        </div>

        <div class="flex flex-col h-full justify-between gap-1rem py-1rem px-0-7rem md-gap-1rem overflow-hidden">
          <p class="text-0-7rem font-600 text-blue uppercase flex-1">${data.category}</p>

          <h3 class="text-0-9rem font-600 flex-1">${data.title}</h3>

          <div class="flex justify-between items-center flex-1">
            <span class="font-700 text-0-9rem">$${data.price.toFixed(2)}</span>
            <button data-action="add-to-cart" data-id="${data.id}" id="add-to-cart-btn" type="button" class="add-to-cart-btn bg-blue border-1 border-blue text-white flex items-center gap-0-5rem py-0-5rem px-0-7rem rounded-8px font-500 transition-all-03s-ease hover-bg-white-text-blue">
              <i class="fa-solid fa-cart-plus pointer-events-none"></i>
              <span class="hidden md-inline-block pointer-events-none">Add to Cart</span>
            </button>
          </div>
        </div>
  `

  CardsContainer.appendChild(card);
}

export function createCategoryCard(data: string) {
  const category = document.createElement("div");
  category.classList.add('py-0-5rem');
  const id = data.toLowerCase()

  category.innerHTML = `
    <input type="radio" name="category" id="${id}" data-category="${id}" class="hidden" ${id === "all" ? "checked" : ""}>
    <label for="${id}"
      class="border-1 border-light-gray text-gray font-500 bg-white rounded-8px px-0-5rem py-0-5rem cursor-pointer capitalize transition-all-03s-ease">${data}</label>
  `

  CategoriesContainer.appendChild(category);
}

export function renderAllcategories(categories: string[]) {
  CategoriesContainer.innerHTML = '';

  createCategoryCard("all");

  categories.forEach((category) => {
    createCategoryCard(category);
  })

  const categoryInputs = document.querySelectorAll('input[name="category"]') as NodeListOf<HTMLInputElement>;

  categoryInputs.forEach((input) => {
    input.addEventListener("change", () => {
      filters.category = input.dataset.category ?? "all";

      applyFilters();
    });
  });
}


export function applyFilters() {
  let filteredProducts = products;

  if (filters.category !== "all") {
    filteredProducts = filteredProducts.filter(
      product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();

    filteredProducts = filteredProducts.filter(
      product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  renderAllCard(filteredProducts);
}


export function renderAllCard(data: Card[]) {
  CardsContainer.innerHTML = '';

  data.forEach((card) => {
    createCard(card);
  });
}

export function loading(state: boolean) {
  if (state) {
    loader.classList.replace('opacity-0', 'opacity-100');
  } else {
    loader.classList.replace('opacity-100', 'opacity-0');
  }
}

export function showModal(type: string) {
  if (type === "favorites") {
    FavoriteContainer.classList.remove('hidden');
    CartContainer.classList.add('hidden');
    AuthContainer.classList.add('hidden');
    checkoutBar.classList.add('hidden')
    AddProductContainer.classList.add('hidden');
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    Aside.classList.replace('translate-x-full', 'translate-x-0');
    modalTitle.textContent = "Favorites";
  } else if (type === "cart") {
    FavoriteContainer.classList.add('hidden');
    CartContainer.classList.remove('hidden');
    AddProductContainer.classList.add('hidden');
    AuthContainer.classList.add('hidden');
    checkoutBar.classList.remove('hidden')
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    Aside.classList.replace('translate-x-full', 'translate-x-0');
    modalTitle.textContent = "Cart";
  } else if (type === "auth-mode") {
    FavoriteContainer.classList.add('hidden');
    CartContainer.classList.add('hidden');
    AddProductContainer.classList.add('hidden');
    AuthContainer.classList.remove('hidden');
    Aside.classList.replace('translate-x-0', 'translate-x-full');
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
  } else if (type === "add-product") {
    FavoriteContainer.classList.add('hidden');
    CartContainer.classList.add('hidden');
    AuthContainer.classList.add('hidden');
    AddProductContainer.classList.remove('hidden');
    Aside.classList.replace('translate-x-0', 'translate-x-full');
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
  } else {
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.classList.replace('pointer-events-auto', 'pointer-events-none');
    Aside.classList.replace('translate-x-0', 'translate-x-full');
  }

}

export function closeModal() {
  modal.classList.replace('opacity-100', 'opacity-0');
  modal.classList.replace('pointer-events-auto', 'pointer-events-none');
  Aside.classList.replace('translate-x-0', 'translate-x-full');
}

export function updateNavUI(user : User | null) {
  if (!user) {
    openAuthContainerBtn.classList.remove('hidden');
    profileBtn.classList.add('hidden');
    return;
  }

  openAuthContainerBtn.classList.add('hidden');

  profileName.textContent = user.name;
  profileLetter.textContent = user.name.charAt(0).toUpperCase();
  
  profileBtn.classList.remove('hidden');
}

export async function getAllData() {
  try {
    loading(true);
    const response = await api<ApiResponse<Card[]>>("/products");
    if (!response) return;

    products = response.data.data;

    loading(false);
    renderAllCard(products);
    renderFavoriteCards();

  } catch (error) {
    console.error(error)
  }
}