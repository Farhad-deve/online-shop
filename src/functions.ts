import { api } from "./api";
import { renderFavoriteCards } from "./favoriteFunctions";
import { type Card } from "./types";

export const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;

export const modal = document.querySelector('#modal') as HTMLDivElement;
const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;

export const Aside = document.querySelector('#aside') as HTMLElement;

export const openFavoriteBtn = document.querySelector('#open-favorite-btn') as HTMLButtonElement;
export const openCartBtn = document.querySelector('#open-cart-btn') as HTMLButtonElement;
export const closeModalBtn = document.querySelector('#close-modal-btn') as HTMLButtonElement;

const checkoutBar = document.querySelector('#checkout-bar') as HTMLDivElement;

const CartContainer = document.querySelector("#cart-container") as HTMLElement;

const loader = document.querySelector('#loader') as HTMLDivElement;

export let products : Card[] = [];

export function createCard(data: Card, category?: string) {
  const card = document.createElement("article");
  card.classList.add('card', 'rounded-8px','overflow-hidden', 'border-1', 'border-light-gray', 'bg-white', 'max-w-300px', 'transition-all-03s-ease', 'flex', 'flex-col');
  card.innerHTML = `
        <div class="relative border-b-1 border-light-red">
          <img src="${data.images[0]}" alt="${data.title}" loading="lazy" class="object-cover w-full pointer-events-none transition-all-03s-ease">
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
            <span class="font-700 text-0-9rem">$${data.price}</span>
            <button data-action="add-to-cart" data-id="${data.id}" id="add-to-cart-btn" type="button" class="add-to-cart-btn bg-blue border-1 border-blue text-white flex items-center gap-0-5rem py-0-5rem px-0-7rem rounded-8px font-500 transition-all-03s-ease">
              <i class="fa-solid fa-cart-plus pointer-events-none"></i>
              <span class="hidden md-inline-block pointer-events-none">Add to Cart</span>
            </button>
          </div>
        </div>
    `

  // const favoriteCheckbox = card.querySelector('.favorite-checkbox') as HTMLInputElement;
  // const favoriteBtn = card.querySelector('#favorite-btn') as HTMLElement;

  // favoriteCheckbox.addEventListener('change', () => {
  //   if (favoriteCheckbox.checked) {
  //     pushToFavoriteList(data);
  //   } else {
  //     favoriteCards = favoriteCards.filter(fCard => fCard.id !== data.id);
  //   }
  // });

  CardsContainer.appendChild(card);
}


export function renderAllCard(data: Card[], category?: string) {
  data.forEach((card) => {
    createCard(card, category);
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
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    Aside.classList.replace('translate-x-full', 'translate-x-0');
    modalTitle.textContent = "Favorites";
    checkoutBar.classList.add('hidden')
  } else if (type === "cart") {
    FavoriteContainer.classList.add('hidden');
    CartContainer.classList.remove('hidden');
    modal.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    Aside.classList.replace('translate-x-full', 'translate-x-0');
    modalTitle.textContent = "Cart";
    checkoutBar.classList.remove('hidden')
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

export async function getAllData() {
  try {
    loading(true);
    const response = await api("/products");

    if (!response) return;

    products = response.data.products;

    loading(false);
    renderAllCard(products);
    renderFavoriteCards();

  } catch (error) {
    console.error(error)
  } 
}