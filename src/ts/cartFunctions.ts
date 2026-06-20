import { type Card } from "./types";

let cartItems: CartItem[] = [];
const CartContainer = document.querySelector("#cart-container") as HTMLElement;
const counterCarts = document.querySelector('.counter-carts') as HTMLSpanElement;
const TotalPrice = document.querySelector('#total-price') as HTMLSpanElement;


export function createCartItem(data: CartItem) {
    const cItem = document.createElement("div");
    cItem.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-1rem', 'py-0-5rem', 'flex', 'flex-col', 'justify-between', 'gap-1rem');
    cItem.innerHTML = `
    <div class="flex items-center gap-0-5rem md-gap-1rem">
      <img src="${data.imageUrl}" alt="${data.title}" loading="lazy" class="rounded-8px pointer-events-none btn-42">
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
};

export function renderCartItems(data : CartItem[]) {
    CartContainer.innerHTML = '';

    data.forEach((item) => {
        createCartItem(item);
    })
};

CartContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const action = target.dataset.action;
    const id = target.dataset.id as string;

    if (!action) return;

    
});