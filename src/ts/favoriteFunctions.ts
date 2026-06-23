import { type FavoriteCard } from "./types";
import { currentUser, favoriteIds, setFavoriteIds, showModal } from "./functions";
import { addToFavorites, getFavorites, removeFromFavorites } from "./requests";

export const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;
const counterFavorites = document.querySelector('.counter-favorites') as HTMLSpanElement;

let localFavorites: FavoriteCard[] = [];

export function createFavoriteCard(data: FavoriteCard) {
    const fCard = document.createElement("div");
    fCard.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-1rem', 'py-0-5rem', 'flex', 'justify-between');
    fCard.innerHTML = `
    <div class="flex items-center gap-0-5rem md-gap-1rem">
      <img src="${data.imageUrl}" alt="${data.title}" loading="lazy" class="rounded-8px pointer-events-none border-1 border-light-gray btn-42">
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

export function renderFavoriteCards(favorites: FavoriteCard[]) {
    localFavorites = favorites;
    FavoriteContainer.innerHTML = '';

    favorites.forEach((card) => {
        createFavoriteCard(card);
    })
}

export function updateCounterFavorites() {
    const count = favoriteIds.length;

    counterFavorites.textContent = String(count);

    if (count === 0) {
        counterFavorites.classList.replace('opacity-100', 'opacity-0');
        counterFavorites.classList.replace('translate-y-0', 'translate-y-0-5rem');
    } else {
        counterFavorites.classList.replace('opacity-0', 'opacity-100');
        counterFavorites.classList.replace('translate-y-0-5rem', 'translate-y-0');
    }
}

export function clearFavoritesUI() {
    FavoriteContainer.innerHTML = '';
}

export function clearFavoriteCheckboxes() {
    const favoriteCheckboxes = document.querySelectorAll('.favorite-checkbox') as NodeListOf<HTMLInputElement>;

    favoriteCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    })
}


CardsContainer.addEventListener('click', async (e) => {
    const target = e.target as HTMLInputElement;

    const favoriteBtn = target.closest('.favorite-checkbox') as HTMLInputElement;
    if (!favoriteBtn) return;

    const productId = favoriteBtn.getAttribute('data-id');
    if (!productId) return;

    if (!currentUser) {
        target.checked = false;
        showModal("auth-mode");
        return
    };

    const isAlreadyFavorite = currentUser.favorites.includes(productId);

    const originalUserFavorites = [...currentUser.favorites];
    const originalFavoriteIds = [...favoriteIds];
    const originalLocalFavorites = [...localFavorites];

    if (isAlreadyFavorite) {
        currentUser.favorites = currentUser.favorites.filter(id => id !== productId);
        setFavoriteIds(favoriteIds.filter(id => id !== productId));
        localFavorites = localFavorites.filter(card => card.id !== productId);
    } else {
        currentUser.favorites.push(productId);
        setFavoriteIds([...favoriteIds, productId]);

        const cardArticle = favoriteBtn.closest('article');
        if (cardArticle) {
            const title = cardArticle.querySelector('h3')?.textContent || "";
            const category = cardArticle.querySelector('p')?.textContent || "";
            const priceText = cardArticle.querySelector('.font-700')?.textContent || "";
            const price = parseFloat(priceText.replace("$", ""));
            const imageUrl = cardArticle.querySelector('img')?.src || "";
            
            localFavorites.push({ id: productId, title, category, price, imageUrl });
        }

        renderFavoriteCards(localFavorites);
    }

    try {
        if (isAlreadyFavorite) {
            await removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }

        const freshFavorites = await getFavorites();
        renderFavoriteCards(freshFavorites);

    } catch (error) {
        console.error("Favorite sync failed, rolling back UI...", error);

        currentUser.favorites = originalUserFavorites;
        setFavoriteIds(originalFavoriteIds);
        renderFavoriteCards(originalLocalFavorites);

        favoriteBtn.checked = isAlreadyFavorite;
    }
});