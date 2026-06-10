import { type FavoriteCard } from "./types";
import { products } from "./functions";

let favoriteCards: FavoriteCard[] = [];
export const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;
const counterFavorites = document.querySelector('.counter-favorites') as HTMLSpanElement;

export function pushToFavoriteList(product: FavoriteCard) {
    const exists = favoriteCards.some(fCard => fCard.id === product.id);

    if (!exists) {
        favoriteCards.push(product);
        counterFavorites.textContent = String(favoriteCards.length);
        counterFavorites.classList.replace('opacity-0', 'opacity-100');
        counterFavorites.classList.replace('translate-y-0-5rem', 'translate-y-0');
    }

}

export function removeFromFavoriteList(id: number) {
    favoriteCards = favoriteCards.filter(fCard => fCard.id !== id);

    counterFavorites.textContent = String(favoriteCards.length);

    if (favoriteCards.length === 0) {
        counterFavorites.classList.replace('opacity-100', 'opacity-0');
        counterFavorites.classList.replace('translate-y-0', 'translate-y-0-5rem');
    }
}


export function createFavoriteCard(data: FavoriteCard) {
    const fCard = document.createElement("div");
    fCard.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-1rem', 'py-0-5rem', 'flex', 'justify-between');
    fCard.innerHTML = `
    <div class="flex items-center gap-0-5rem md-gap-1rem">
      <img src="${data.thumbnail}" alt="${data.title}" loading="lazy" class="rounded-8px pointer-events-none btn-42">
      <div class="md-flex md-flex-col flex flex-col justify-between">
        <h4 class="leading-tight text-0-8rem">${data.title}</h4>
        <p class="text-gray text-0-7rem capitalize">${data.category}</p>
        <p class="text-blue text-0-7rem font-700">$${data.price}</p>
      </div>
    </div>

    <div class="border-1 border-light-gray bg-light-red btn-34 flex items-center justify-center rounded-8px">
      <i class="fa-solid fa-heart text-red"></i>
    </div>
  `

    FavoriteContainer.appendChild(fCard);
}

export function renderFavoriteCards() {
    FavoriteContainer.innerHTML = '';

    favoriteCards.forEach((card) => {
        createFavoriteCard(card);
    })
}

CardsContainer.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;

    if (!target.classList.contains('favorite-checkbox')) return;

    const id = Number(target.dataset.id);

    const product = products.find(p => p.id === id);

    if (!product) return;

    if (target.checked) {
        pushToFavoriteList(product);
    } else {
        removeFromFavoriteList(id);
    }

    renderFavoriteCards();
})