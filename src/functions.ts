import { api } from "./api";
import { type Card, type CartItem, type FavoriteCard } from "./types";

const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;
const CartContainer = document.querySelector("#cart-container") as HTMLElement;

export const modal = document.querySelector('#modal') as HTMLDivElement;
const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;

export const Aside = document.querySelector('#aside') as HTMLElement;

export const openFavoriteBtn = document.querySelector('#open-favorite-btn') as HTMLButtonElement;
const counterFavorites = document.querySelector('.counter-favorites') as HTMLSpanElement;
export const openCartBtn = document.querySelector('#open-cart-btn') as HTMLButtonElement;
const counterCarts = document.querySelector('.counter-carts') as HTMLSpanElement;
export const closeModalBtn = document.querySelector('#close-modal-btn') as HTMLButtonElement;

const checkoutBar = document.querySelector('#checkout-bar') as HTMLDivElement;
const TotalPrice = document.querySelector('#total-price') as HTMLSpanElement;

const loader = document.querySelector('#loader') as HTMLDivElement;

let favoriteCards: FavoriteCard[] = [];
let products : Card[] = [];
let cartItems: CartItem[] = [];

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

CardsContainer.addEventListener('click', (e) => {
  const target = e.target as HTMLButtonElement;

  if (!target.classList.contains('add-to-cart-btn')) return;

  const id = Number(target.dataset.id);

  const product = products.find(p => p.id === id);

  if (!product) return;

  addToCart(product);
  renderCartItems();
})

CartContainer.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action) return;

  if (action === "increase") {
    increaseQuantity(id)
  }

  if (action === "decrease") {
    decreaseQuantity(id)
  }

  if (action === "remove") {
    removeCartItem(id)
  }
})

export function pushToFavoriteList(product: FavoriteCard) {
  const exists = favoriteCards.some(fCard => fCard.id === product.id);

  if (!exists) {
    favoriteCards.push(product);
    counterFavorites.textContent = String(favoriteCards.length);
    counterFavorites.classList.replace('opacity-0', 'opacity-100');
    counterFavorites.classList.replace('translate-y-0-5rem', 'translate-y-0');
  }

}

export function removeFromFavoriteList(id : number) {
  favoriteCards = favoriteCards.filter(fCard => fCard.id !== id);

  counterFavorites.textContent = String(favoriteCards.length);

  if (favoriteCards.length === 0) {
    counterFavorites.classList.replace('opacity-100', 'opacity-0');
    counterFavorites.classList.replace('translate-y-0', 'translate-y-0-5rem');
  }
}

export function addToCart(product: Card) {
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    })
    counterCarts.textContent = String(cartItems.length);
    counterCarts.classList.replace('opacity-0', 'opacity-100');
    counterCarts.classList.replace('translate-y-0-5rem', 'translate-y-0');
  }

  renderCartItems();
}

export function removeCartItem(id : number) {
  cartItems = cartItems.filter(item => item.id !== id);

  if (cartItems.length === 0) {
    counterCarts.textContent = String(cartItems.length);
    counterCarts.classList.replace('opacity-100', 'opacity-0');
    counterCarts.classList.replace('translate-y-0', 'translate-y-0-5rem');
  }

  renderCartItems();
}

export function increaseQuantity(id: number) {
  const item = cartItems.find(item => item.id === id);

  if (!item) return;

  item.quantity++; 

  renderCartItems();
}

export function decreaseQuantity(id: number) {
  const item = cartItems.find(item => item.id === id);

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    removeCartItem(id);
    return;
  } 

  renderCartItems();
}

export function updateCartTotalPrice() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  TotalPrice.textContent = `$${total.toFixed(2)}`;
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

export function createCartItem(data: CartItem) {
  const cItem = document.createElement("div"); 
  cItem.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-1rem', 'py-0-5rem', 'flex', 'flex-col', 'justify-between', 'gap-1rem');
  const totalPrice = (data.price * data.quantity).toFixed(2);
  cItem.innerHTML = `
    <div class="flex items-center gap-0-5rem md-gap-1rem">
      <img src="${data.thumbnail}" alt="${data.title}" loading="lazy" class="rounded-8px pointer-events-none btn-42">
      <div class="md-flex md-flex-col flex flex-col justify-between">
        <h4 class="leading-tight text-0-8rem">${data.title}</h4>
        <p class="text-gray text-0-7rem capitalize">${data.category}</p>
        <p class="text-blue text-0-7rem font-700">$${totalPrice}</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="border-1 border-light-gray px-0-5rem py-0-5rem flex items-center gap-1rem rounded-8px">
        <button type="button" data-id="${data.id}" data-action="decrease" class="text-gray font-900 border-none bg-transparent">-</button>
        <span class="text-0-8rem font-600">${data.quantity}</span>
        <button type="button" data-id="${data.id}" data-action="increase" class="text-gray font-900 border-none bg-transparent">+</button>
      </div>

      <div>
        <button type="button" data-id="${data.id}" data-action="remove" class="border-1 border-light-gray bg-transparent btn-34 flex items-center justify-center rounded-8px">
          <i class="fa-solid fa-trash text-gray pointer-events-none"></i>
        </button>
      </div>
    </div>
  `

  CartContainer.appendChild(cItem);
}

export function renderFavoriteCards() {
  FavoriteContainer.innerHTML = '';

  favoriteCards.forEach((card) => {
    createFavoriteCard(card);
  })
}

export function renderCartItems() {
  CartContainer.innerHTML = '';

  cartItems.forEach((item) => {
    createCartItem(item);
  })

  updateCartTotalPrice();
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