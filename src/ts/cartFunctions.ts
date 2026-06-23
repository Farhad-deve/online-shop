import { currentUser } from "./state";
import { showModal } from "./ui";
import { addToCart, clearCart, getCarts, removeFromCart, setCartQty } from "./requests";
import { type CartItem } from "./types";

let cartItems: CartItem[] = [];
const CartContainer = document.querySelector("#cart-container") as HTMLElement;
const counterCarts = document.querySelector('.counter-carts') as HTMLSpanElement;
const TotalPrice = document.querySelector('#total-price') as HTMLSpanElement;
const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
const checkoutBtn = document.querySelector('#checkout-btn') as HTMLButtonElement;

export function updateCartCounter(data: CartItem[]) {
  if (!counterCarts) return;

  const totalQty = data.reduce((sum, item) => sum + item.qty, 0);

  counterCarts.textContent = String(totalQty);

  if (totalQty === 0) {
    counterCarts.classList.add('opacity-0', 'translate-y-0-5rem');
  } else {
    counterCarts.classList.remove('opacity-0', 'translate-y-0-5rem');
  }

  if (TotalPrice) {
    const totalCost = data.reduce((sum, item) => sum + item.subtotal, 0);
    TotalPrice.textContent = String(`$${totalCost.toFixed(2)}`);
  }
}

export function createCartItem(data: CartItem) {
  const cItem = document.createElement("div");
  cItem.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-1rem', 'py-0-5rem', 'flex', 'flex-col', 'justify-between', 'gap-1rem');
  cItem.innerHTML = `
    <div class="flex items-center gap-0-5rem md-gap-1rem">
      <img src="${data.product.imageUrl}" alt="${data.product.title}" loading="lazy" class="rounded-8px pointer-events-none btn-42 border-1 border-light-gray">
      <div class="md-flex md-flex-col flex flex-col justify-between">
        <h4 class="leading-tight text-0-8rem">${data.product.title}</h4>
        <p class="text-gray text-0-7rem capitalize">${data.product.category}</p>
        <p class="text-blue text-0-7rem font-700">$${data.subtotal.toFixed(2)}</p>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="border-1 border-light-gray px-0-5rem py-0-5rem flex items-center gap-1rem rounded-8px">
        <button type="button" data-id="${data.product.id}" data-action="decrease" class="text-gray font-900 border-none bg-transparent">-</button>
        <span class="text-0-8rem font-600">${data.qty}</span>
        <button type="button" data-id="${data.product.id}" data-action="increase" class="text-gray font-900 border-none bg-transparent">+</button>
      </div>

      <div>
        <button type="button" data-id="${data.product.id}" data-action="remove" class="border-1 border-light-gray bg-transparent btn-34 flex items-center justify-center rounded-8px">
          <i class="fa-solid fa-trash text-gray pointer-events-none"></i>
        </button>
      </div>
    </div>
  `

  CartContainer.appendChild(cItem);
};

export function renderCartItems(data: CartItem[]) {
  cartItems = data;

  CartContainer.innerHTML = '';
  data.forEach((item) => {
    createCartItem(item);
  })

  updateCartCounter(data);
};


CartContainer.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;

  const action = target.dataset.action
  if (!action) return;

  const productId = target.dataset.id;
  if (!productId) return;

  const existingItem = cartItems.find((item) => item.product.id === productId);
  if (!existingItem) return;

  if (action === "increase") {
    existingItem.qty += 1;
    existingItem.subtotal = existingItem.product.price * existingItem.qty;

  } else if (action === "decrease") {

    if (existingItem.qty <= 1) {
      cartItems = cartItems.filter(item => item.product.id !== productId);
    } else {
      existingItem.qty -= 1;
      existingItem.subtotal = existingItem.product.price * existingItem.qty;
    }

  } else if (action === "remove") {
    cartItems = cartItems.filter(item => item.product.id !== productId);
  }

  renderCartItems(cartItems);

  try {

    if (action === "increase") {
      await setCartQty(productId, existingItem.qty);
    
    } else if (action ===  "decrease") {

      if (existingItem.qty < 1) {
        await removeFromCart(productId);
      } else {
        await setCartQty(productId, existingItem.qty);
      }

    } else if (action === "remove") {
      await removeFromCart(productId);
    }

  } catch (error) {
    console.error("Failed to update cart on server, rolling back...", error)

    const freshCarts = await getCarts();
    cartItems = freshCarts;
    renderCartItems(cartItems);
  }
});

CardsContainer.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;

  const button = target.closest('[data-action="add-to-cart"]');
  if (!button) return;

  const productId = button.getAttribute('data-id');
  if (!productId) return;

  if (!currentUser) {
    showModal("auth-mode");
    return;
  }

  await addToCart(productId, 1);

  const updatedCarts = await getCarts();
  renderCartItems(updatedCarts);
});

checkoutBtn.addEventListener('click', async () => {
  const previousCartItems = [...cartItems];

  renderCartItems([]);
  try {
    await clearCart();
  } catch (error) {
    console.error("Failed to clear cart on server, restoring back...", error)
    renderCartItems(previousCartItems);
  }
});