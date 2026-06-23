import { CardsContainer, CategoriesContainer } from "./dom";
import { getProducts } from "./requests";
import { favoriteIds, filters } from "./state";
import type { Card } from "./types";

export function createCard(data: Card, favoriteIds: string[] = []) {
    const card = document.createElement("article");
    card.classList.add('card', 'rounded-8px', 'overflow-hidden', 'border-1', 'border-light-gray', 'bg-white', 'max-w-350px', 'transition-all-03s-ease', 'flex', 'flex-col');
    const isFavorite = favoriteIds.includes(data.id);
    card.innerHTML = `
        <div class="relative">
          <img src="${data.imageUrl}" alt="${data.title}" loading="lazy" class="object-cover h-150px md-h-250px w-full pointer-events-none border-b-1 border-light-gray transition-all-03s-ease">
          <input type="checkbox" data-id="${data.id}" name="" id="favorite-checkbox-${data.id}" class="favorite-checkbox hidden" ${isFavorite ? "checked" : ""}>
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
};

export function createCategoryCard(data: string) {
    const category = document.createElement("div");
    category.classList.add('py-0-5rem');
    const id = data.toLocaleLowerCase().replace(/\s+/g, "-");

    category.innerHTML = `
    <input type="radio" name="category" id="${id}" data-category="${data}" class="hidden" ${data === "All" ? "checked" : ""}>
    <label for="${id}"
      class="border-1 border-light-gray text-gray font-500 bg-white rounded-8px px-0-5rem py-0-5rem cursor-pointer capitalize transition-all-03s-ease">${data}</label>
  `

    CategoriesContainer.appendChild(category);
};

export function renderAllcategories(categories: string[]) {
    CategoriesContainer.innerHTML = '';

    createCategoryCard("All");

    categories.forEach((category) => {
        createCategoryCard(category);
    })

    const categoryInputs = document.querySelectorAll('input[name="category"]') as NodeListOf<HTMLInputElement>;

    categoryInputs.forEach((input) => {
        input.addEventListener("change", () => {
            filters.category = input.dataset.category ?? "All";

            applyFilters();
        });
    });
};


export async function applyFilters() {
    try {
        const data = await getProducts(filters.search, filters.category);

        renderAllCard(data);
    } catch (error) {
        console.error(error)
    }
};

export function renderAllCard(data: Card[]) {
    CardsContainer.innerHTML = '';

    data.forEach((card) => {
        createCard(card, favoriteIds);
    });
};