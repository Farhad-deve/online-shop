import { api } from "./api";
import { type Card } from "./types";

const CardsContainer = document.querySelector("#cards-container") as HTMLElement;

export function createCard(data : Card, category? : string) {
    const card = document.createElement("article");
    card.classList.add('card', 'rounded-8px', 'overflow-hidden', 'border-1', 'border-light-gray', 'bg-white', 'max-w-300px', 'transition-all-03s-ease')
    card.innerHTML = `
        <div class="relative border-b-1 border-light-gray">
          <img src="${data.images[0]}" alt="${data.title}" loading="lazy" class="object-cover w-full pointer-events-none transition-all-03s-ease">
          <input type="checkbox" name="" id="favorite-checkbox-${data.id}" class="favorite-checkbox hidden">
          <div id="favorite-btn" class="absolute btn-34 rounded-8px bg-light-red border-1 border-light-gray flex items-center justify-center">
            <label for="favorite-checkbox-${data.id}" class="cursor-pointer">
              <i class="fa-regular fa-heart text-gray heart-regular"></i>
              <i class="fa-solid fa-heart text-red heart-solid"></i>
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-0-5rem py-1rem px-0-7rem md-gap-1rem">
          <p class="text-0-7rem font-600 text-blue uppercase">${data.category}</p>

          <h3 class="text-0-9rem font-600">${data.title}</h3>

          <div class="flex justify-between items-center">
            <span class="font-700 text-0-9rem">$${data.price}</span>
            <button id="add-to-cart-btn" type="button" class="hidden md-block bg-blue border-1 border-blue text-white py-0-5rem px-0-7rem rounded-8px font-500 transition-all-03s-ease">
              <i class="fa-solid fa-cart-plus"></i>
              Add to Cart
            </button>
            <button id="add-to-cart-btn" type="button"
              class="md-hidden bg-blue border-1 border-blue text-white py-0-5rem px-0-7rem rounded-8px">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
    `

    CardsContainer.appendChild(card);
}

export function renderAllCard(data : Card[], category? : string) {
    data.forEach((card) => {
        createCard(card, category);
    });
}

export async function getAllData() {
    const response = await api("/products");
    
    renderAllCard(response.data.products);
}