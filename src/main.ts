import {
    getAllData, showModal, closeModal, modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside,
    CardsContainer,
    products

} from "./functions";
import { addToCart, renderCartItems } from "./cartFunctions";

openFavoriteBtn.addEventListener('click', () => showModal("favorites"));
openCartBtn.addEventListener('click', () => showModal("cart"));

Aside.addEventListener('click', (e) => e.stopPropagation());

modal.addEventListener('click', () => closeModal());
closeModalBtn.addEventListener('click', () => closeModal());

CardsContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;

    if (!target.classList.contains('add-to-cart-btn')) return;

    const id = Number(target.dataset.id);

    const product = products.find(p => p.id === id);

    if (!product) return;

    addToCart(product);
    renderCartItems();
})

getAllData();